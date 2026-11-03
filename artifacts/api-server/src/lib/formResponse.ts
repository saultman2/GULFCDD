import type { Request, Response } from "express";

export function isNativeForm(req: Request) {
  return !req.is("application/json") && typeof req.body?.data !== "string";
}

export function formError(req: Request, res: Response, status: number, message: string) {
  if (!isNativeForm(req)) {
    res.status(status).json({ error: message });
    return;
  }
  const escaped = message.replace(/[&<>"']/g, (value) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[value]!);
  res.status(status).type("html").send(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex,nofollow"><title>Message not sent | GulfCDD</title></head><body><main><h1>Your message was not sent</h1><p role="alert">${escaped}</p><p>Use your browser's Back button to review your details, or <a href="/contact/">contact Gulf Coast Digital Designs</a>.</p></main></body></html>`);
}

export function formSuccess(req: Request, res: Response) {
  if (isNativeForm(req)) res.redirect(303, "/contact/thanks/");
  else res.status(200).json({ ok: true });
}
