import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { build } from "esbuild";

// Keep SMTP and uploads outside this handler test; no secrets or real emails.
const compiled = await build({
  entryPoints: [fileURLToPath(new URL("../src/routes/intake.ts", import.meta.url))],
  bundle: true, write: false, platform: "node", format: "cjs",
  plugins: [{
    name: "quote-test-boundaries",
    setup(builder) {
      builder.onResolve({ filter: /^(express|nodemailer|multer)$|middlewares\/formRateLimit$/ }, ({ path }) => ({ path, namespace: "test-boundary" }));
      builder.onLoad({ filter: /.*/, namespace: "test-boundary" }, ({ path }) => ({
        loader: "js",
        contents: path === "express"
          ? "export function Router(){return {post(path,...handlers){this.handler=handlers.at(-1);}}}"
          : path === "nodemailer"
            ? "export default {createTransport(){return {async sendMail(mail){sent.push(mail);}}}}"
            : path === "multer"
              ? "function multer(){return {fields(){return (req,res,next)=>next();}}};multer.memoryStorage=()=>({});export default multer;"
              : "export default function limit(req,res,next){next();}",
      }));
    },
  }],
});

async function submit(body) {
  const sent = [];
  const module = { exports: {} };
  vm.runInNewContext(compiled.outputFiles[0].text, {
    module, exports: module.exports, sent,
    process: { env: { SMTP_USER: "test@example.test", SMTP_PASS: "test-only" } },
  });
  const result = { status: 200 };
  const res = {
    status(code) { result.status = code; return this; },
    json(body) { result.body = body; return this; },
  };
  await module.exports.default.handler({
    body,
    is(type) { return type === "application/json"; },
    log: { info() {}, warn() {}, error() {} },
  }, res);
  return { ...result, sent };
}
const basics = { mode: "quick", bizName: "Example Business", contactName: "Test Visitor", email: "visitor@example.test" };

test("all tiers, selected services and features reach the internal quote email", async () => {
  for (const tier of ["essential", "growth", "full-service", "unsure", "standard", "gold", "platinum", "custom"]) {
    const result = await submit({
      ...basics, tierPreference: tier, phone: "",
      services: ["Full business sites"], features: ["Appointment and booking request forms"],
      source: "homepage-special", notes: "Please quote a booking website.",
    });
    assert.equal(result.status, 200);
    assert.equal(result.sent.length, 2);
    const internal = result.sent.find(mail => mail.subject.startsWith("New quote request:"));
    for (const text of ["Tier preference:", "Full business sites", "Appointment and booking request forms", "Homepage special offer", "Please quote a booking website.", "Not provided"]) {
      assert.ok(internal.text.includes(text), text);
    }
    assert.equal(internal.replyTo, basics.email);
    const confirmation = result.sent.find(mail => mail.to === basics.email);
    assert.ok(confirmation.text.includes("Veteran-Owned & Operated | Biloxi, MS"));
    assert.ok(!confirmation.text.includes("Ocean Springs, MS"));
  }
});
test("legacy quick requests and detailed intake remain accepted", async () => {
  for (const body of [
    basics,
    { ...basics, mode: "full", tierPreference: "Gold", featuresNeeded: ["Booking"], industry: "Contractor", phone: "(228) 555-0142" },
  ]) {
    const result = await submit(body);
    assert.equal(result.status, 200);
    assert.equal(result.sent.length, 2);
  }
});
test("malformed tiers, choices and optional phone numbers do not send mail", async () => {
  for (const extra of [
    { tierPreference: "__proto__" }, { tierPreference: "invalid" },
    { services: "Online stores" }, { features: [{}] },
    { source: "unknown" }, { phone: "123" },
  ]) {
    const result = await submit({ ...basics, ...extra });
    assert.equal(result.status, 400);
    assert.equal(result.sent.length, 0);
  }
});
