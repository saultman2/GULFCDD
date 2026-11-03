import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createRequire } from "node:module";
import { createServer } from "node:net";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

test("production bundle contains every upstream Stripe migration unchanged", async () => {
  const upstream = path.join(path.dirname(require.resolve("stripe-replit-sync")), "migrations");
  const packaged = path.join(root, "dist/migrations");
  const names = (await readdir(upstream)).filter((name) => name.endsWith(".sql")).sort();
  assert.ok(names.length > 0, "Expected Stripe SQL migrations");
  assert.deepEqual((await readdir(packaged)).filter((name) => name.endsWith(".sql")).sort(), names);
  for (const name of names) {
    assert.deepEqual(
      await readFile(path.join(packaged, name)),
      await readFile(path.join(upstream, name)),
      `Migration changed: ${name}`,
    );
  }
});

test("production health checks respond while Stripe database initialization is stalled", { timeout: 15000 }, async (t) => {
  // Fake PostgreSQL accepts TCP but never answers. No real database or Stripe
  // request is made, and no schema/data is modified by this test.
  const sockets = new Set();
  const fakeDb = createServer((socket) => {
    sockets.add(socket);
    socket.on("close", () => sockets.delete(socket));
  });
  fakeDb.listen(0, "127.0.0.1");
  await once(fakeDb, "listening");
  t.after(() => {
    for (const socket of sockets) socket.destroy();
    fakeDb.close();
  });
  const reservation = createServer();
  reservation.listen(0, "127.0.0.1");
  await once(reservation, "listening");
  const port = reservation.address().port;
  await new Promise((resolve) => reservation.close(resolve));

  const child = spawn(process.execPath, [path.join(root, "dist/index.mjs")], {
    cwd: root,
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: String(port),
      DATABASE_URL: `postgresql://test:test@127.0.0.1:${fakeDb.address().port}/test?sslmode=disable`,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", (chunk) => { output += chunk; });
  child.stderr.on("data", (chunk) => { output += chunk; });
  t.after(async () => {
    if (child.exitCode === null && child.signalCode === null) {
      const exited = once(child, "exit");
      child.kill("SIGKILL");
      await exited;
    }
  });
  const deadline = Date.now() + 7000;
  let ready = false;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/healthz`, {
        signal: AbortSignal.timeout(500),
      });
      if (response.status === 200) {
        assert.deepEqual(await response.json(), { status: "ok" });
        ready = true;
        break;
      }
    } catch { /* wait for the process to bind */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.ok(ready, "Health endpoint must respond before database initialization completes");
  assert.match(output, /Initializing Stripe schema/);
  assert.doesNotMatch(output, /Stripe schema ready/);
  assert.equal(child.exitCode, null);
  const response = await fetch(`http://127.0.0.1:${port}/api`);
  assert.equal(response.status, 200);
});
