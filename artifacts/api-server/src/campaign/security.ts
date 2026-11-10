import { createHash, randomBytes } from "node:crypto";
import { getAuth, createClerkClient } from "@clerk/express";
import type { RequestHandler } from "express";
import { isCampaignOwner, isGoogleOwnerSession } from "./owner-policy";

export const digest = (value: string) => createHash("sha256").update(value).digest("hex");
export const token = () => randomBytes(32).toString("hex");
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY ?? "" });
export const requireCampaignAdmin: RequestHandler = async (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  const { userId, sessionId } = getAuth(req);
  if (!userId || !sessionId) { res.status(401).json({ error: "Sign in with the owner's Google account to continue." }); return; }
  try {
    const user = await clerk.users.getUser(userId);
    if (!isCampaignOwner(user)) {
      res.status(403).json({ error: "This dashboard is restricted to aultman@gulfcoastdigitaldesign.com through Google sign-in." }); return;
    }
    const session = await clerk.sessions.getSession(sessionId);
    const client = await clerk.clients.getClient(session.clientId);
    if (!isGoogleOwnerSession(session, client, userId, sessionId)) {
      res.status(403).json({ error: "Sign out and sign back in with the owner's Google account to access this dashboard." }); return;
    }
    res.locals.adminId = userId;
    next();
  } catch {
    res.status(503).json({ error: "Unable to verify dashboard access. Please try again shortly." });
  }
};
export const requireSameOrigin: RequestHandler = (req, res, next) => {
  const origin = req.get("origin");
  const host = req.get("x-forwarded-host") ?? req.get("host");
  if (origin && new URL(origin).host !== host && origin !== "https://www.gulfcdd.com" && origin !== "https://gulfcdd.com") {
    res.status(403).json({ error: "Cross-site submissions aren't allowed." }); return;
  }
  next();
};
export function rateLimit(limit: number, windowMs: number): RequestHandler {
  const hits = new Map<string, { count: number; until: number }>();
  return (req, res, next) => {
    const now = Date.now();
    for (const [key, value] of hits) if (value.until <= now) hits.delete(key);
    const key = req.ip ?? "unknown";
    const hit = hits.get(key) ?? { count: 0, until: now + windowMs };
    hit.count++; hits.set(key, hit);
    if (hit.count > limit) { res.setHeader("Retry-After", String(Math.ceil((hit.until - now) / 1000))); res.status(429).json({ error: "Too many requests. Please try again later." }); return; }
    next();
  };
}
export function attributionOnly(input: Record<string, string> = {}) {
  const result: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "source"]) {
    const value = input[key];
    // No URLs, emails, click IDs or free-text personal information in analytics.
    if (value && /^[a-zA-Z0-9 _.-]{1,100}$/.test(value)) result[key] = value;
  }
  return result;
}
