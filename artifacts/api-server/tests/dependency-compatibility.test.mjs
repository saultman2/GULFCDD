import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import test from "node:test";
import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  createClerkProxyHandler,
  getClerkProxyHost,
} from "../src/middlewares/clerkProxyMiddleware.ts";

async function serve(t, handler) {
  const server = createServer(handler);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve) => {
    server.close(resolve);
    server.closeAllConnections();
  }));
  return `http://127.0.0.1:${server.address().port}`;
}

test("proxy preserves Clerk paths, query strings, raw bodies, cookies and public headers", async (t) => {
  const upstream = await serve(t, async (req, res) => {
    const parts = [];
    for await (const part of req) parts.push(part);
    res.setHeader("Set-Cookie", ["session=test; HttpOnly; Secure", "other=value"]);
    res.end(JSON.stringify({
      url: req.url, method: req.method, headers: req.headers,
      body: Buffer.concat(parts).toString(),
    }));
  });
  // This is a deliberately fake key. Tests never contact Clerk or use secrets.
  const handler = createClerkProxyHandler(upstream, "test-only-not-a-real-key");
  const app = express();
  app.use(CLERK_PROXY_PATH, handler);
  const origin = await serve(t, app);
  const response = await fetch(`${origin}${CLERK_PROXY_PATH}/v1/client?__clerk_api_version=2026-01-01&x=a%2Fb`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Forwarded-Host": "www.gulfcdd.com, internal.example",
      "X-Forwarded-Proto": "https",
      "X-Forwarded-For": "203.0.113.10, 10.0.0.1",
      Cookie: "client=test",
    },
    body: "strategy=email_code&code=123456",
    signal: AbortSignal.timeout(5000),
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.getSetCookie().length, 2);
  const result = await response.json();
  assert.equal(result.url, "/v1/client?__clerk_api_version=2026-01-01&x=a%2Fb");
  assert.equal(result.method, "POST");
  assert.equal(result.body, "strategy=email_code&code=123456");
  assert.equal(result.headers.host, new URL(upstream).host);
  assert.equal(result.headers["clerk-proxy-url"], `https://www.gulfcdd.com${CLERK_PROXY_PATH}`);
  assert.equal(result.headers["clerk-secret-key"], "test-only-not-a-real-key");
  assert.equal(result.headers["x-forwarded-for"], "203.0.113.10");
  assert.equal(result.headers.cookie, "client=test");

  // Requests that retain the prefix also work (without stripping similar names).
  const unmounted = await serve(t, handler);
  for (const [path, expected] of [
    [`${CLERK_PROXY_PATH}?x=1`, "/?x=1"],
    [`${CLERK_PROXY_PATH}/v1/environment`, "/v1/environment"],
    ["/api/__clerk-other", "/api/__clerk-other"],
  ]) {
    const r = await fetch(`${unmounted}${path}`, { signal: AbortSignal.timeout(5000) });
    assert.equal((await r.json()).url, expected);
  }
});

test("upstream errors return a bounded, credential-free response", async (t) => {
  const upstream = await serve(t, (req) => req.socket.destroy());
  const app = express();
  app.use(CLERK_PROXY_PATH, createClerkProxyHandler(upstream, "test-only-secret"));
  app.get("/health", (_req, res) => res.send("ok"));
  const origin = await serve(t, app);
  const response = await fetch(`${origin}${CLERK_PROXY_PATH}/v1/client`, {
    signal: AbortSignal.timeout(5000),
  });
  assert.equal(response.status, 502);
  assert.equal(await response.text(), "Authentication service temporarily unavailable.");
  assert.equal(await (await fetch(`${origin}/health`)).text(), "ok");
});

test("public host selection handles all forwarded header shapes", () => {
  assert.equal(getClerkProxyHost({ headers: { host: "fallback.test" } }), "fallback.test");
  assert.equal(getClerkProxyHost({ headers: {
    host: "internal", "x-forwarded-host": ["www.gulfcdd.com, proxy", "extra"],
  } }), "www.gulfcdd.com");
  assert.equal(getClerkProxyHost({ headers: {} }), undefined);
});

test("development proxy continues to bypass Clerk without reading a key", () => {
  const previous = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = "development";
    let called = false;
    clerkProxyMiddleware()({}, {}, () => { called = true; });
    assert.equal(called, true);
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
  }
});

test("Nodemailer composes existing mail fields and attachments without SMTP", async () => {
  const transport = nodemailer.createTransport({ streamTransport: true, buffer: true });
  const result = await transport.sendMail({
    from: "GulfCDD <sender@example.test>",
    to: "owner@example.test",
    replyTo: "customer@example.test",
    subject: "New request — Gulf Coast",
    text: "Please call about my website.",
    html: "<p>Please call about my website.</p>",
    attachments: [{ filename: "brief.txt", content: Buffer.from("Project brief") }],
  });
  assert.deepEqual(result.envelope.to, ["owner@example.test"]);
  const message = result.message.toString();
  assert.match(message, /Reply-To: customer@example.test/);
  assert.match(message, /multipart\/mixed/);
  assert.match(message, /filename=brief.txt/);
  assert.match(message, /Please call about my website/);
});

test("Multer accepts uploads and rejects size limits/malformed multipart without crashing", async (t) => {
  const app = express();
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 32, files: 1 } });
  app.post("/upload", upload.single("file"), (req, res) => {
    res.json({ name: req.file.originalname, body: req.file.buffer.toString() });
  });
  app.get("/health", (_req, res) => res.send("ok"));
  app.use((err, _req, res, _next) => res.status(400).json({ code: err.code || "INVALID_MULTIPART" }));
  const origin = await serve(t, app);
  const valid = new FormData();
  valid.append("file", new Blob(["Brief"]), "brief.txt");
  const success = await fetch(`${origin}/upload`, { method: "POST", body: valid });
  assert.deepEqual(await success.json(), { name: "brief.txt", body: "Brief" });
  const oversized = new FormData();
  oversized.append("file", new Blob(["x".repeat(64)]), "large.txt");
  const failure = await fetch(`${origin}/upload`, { method: "POST", body: oversized });
  assert.equal(failure.status, 400);
  assert.equal((await failure.json()).code, "LIMIT_FILE_SIZE");
  const malformed = await fetch(`${origin}/upload`, {
    method: "POST", headers: { "Content-Type": "multipart/form-data; boundary=broken" },
    body: "--broken\r\nnot-a-valid-part", signal: AbortSignal.timeout(5000),
  });
  assert.equal(malformed.status, 400);
  assert.equal(await (await fetch(`${origin}/health`)).text(), "ok");
});
