import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { build } from "esbuild";

// Exercise the real handler and validation without sending email or reading secrets.
const compiled = await build({
  entryPoints: [fileURLToPath(new URL("../src/routes/contact.ts", import.meta.url))],
  bundle: true,
  write: false,
  platform: "node",
  format: "cjs",
  plugins: [{
    name: "contact-test-boundaries",
    setup(builder) {
      builder.onResolve({ filter: /^(express|nodemailer)$|middlewares\/formRateLimit$/ }, ({ path }) => ({
        path,
        namespace: "test-boundary",
      }));
      builder.onLoad({ filter: /.*/, namespace: "test-boundary" }, ({ path }) => ({
        contents: path === "express"
          ? "export function Router() { return { post(path, ...handlers) { this.handler = handlers.at(-1); } }; }"
          : path === "nodemailer"
            ? "export default { createTransport() { return { async sendMail(mail) { sent.push(mail); } }; } };"
            : "export default function limit(req, res, next) { next(); }",
        loader: "js",
      }));
    },
  }],
});

function createHandler() {
  const sent = [];
  const module = { exports: {} };
  vm.runInNewContext(compiled.outputFiles[0].text, {
    module,
    exports: module.exports,
    sent,
    process: { env: { SMTP_USER: "test@example.test", SMTP_PASS: "test-only" } },
  });
  return { handler: module.exports.default.handler, sent };
}

async function submit(body) {
  const { handler, sent } = createHandler();
  const result = { status: 200 };
  const res = {
    status(code) { result.status = code; return this; },
    json(value) { result.body = value; return this; },
  };
  await handler({ body, is(type) { return type === "application/json"; }, log: { info() {}, warn() {} } }, res);
  return { ...result, sent };
}

test("short inquiries accept an omitted phone and preserve the email and message", async () => {
  const result = await submit({
    name: " Test Visitor ",
    email: "visitor@example.test",
    message: "Please help with a website.",
    preferredContact: "email",
  });
  assert.equal(result.status, 200);
  assert.equal(result.sent.length, 1);
  assert.equal(result.sent[0].replyTo, "visitor@example.test");
  assert.match(result.sent[0].text, /Phone:\s+Not provided/);
  assert.match(result.sent[0].text, /Please help with a website\./);
  assert.match(result.sent[0].text, /Name:\s+Test Visitor/);
});

test("optional formatted phone numbers are included in the inquiry", async () => {
  const result = await submit({
    name: "Test Visitor", email: "visitor@example.test", phone: "(202) 555-0100",
  });
  assert.equal(result.status, 200);
  assert.match(result.sent[0].text, /\(202\) 555-0100/);
});

test("invalid contact details do not send mail", async () => {
  for (const body of [
    { name: "", email: "visitor@example.test" },
    { name: "Test Visitor", email: "invalid" },
    { name: "Test Visitor", email: "visitor@example.test", phone: "123" },
    { name: "Test Visitor", email: "visitor@example.test", phone: {} },
    { name: "Test Visitor", email: "visitor@example.test", preferredContact: "text" },
  ]) {
    const result = await submit(body);
    assert.equal(result.status, 400);
    assert.equal(result.sent.length, 0);
  }
});

test("existing detailed inquiries still deliver their project fields", async () => {
  const result = await submit({
    name: "Test Visitor", email: "visitor@example.test", phone: "2025550100",
    businessName: "Example Business", websiteNeeded: "redesign", budget: "small",
    timeline: "flexible", preferredContact: "text", message: "Existing form inquiry",
  });
  assert.equal(result.status, 200);
  for (const value of ["Example Business", "redesign", "small", "flexible", "text"]) {
    assert.ok(result.sent[0].text.includes(value));
  }
});
