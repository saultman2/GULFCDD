import { Router } from "express";
import publicRouter from "./public";
import adminRouter from "./admin";
import onboardingRouter from "./onboarding";
import { ensureCampaignTables } from "../../campaign/storage";

const router = Router();
let ready: Promise<void> | undefined;
router.use("/campaign", async (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    ready ??= ensureCampaignTables();
    await ready;
    next();
  } catch (err) {
    ready = undefined;
    req.log.error({ err }, "Campaign database unavailable");
    res.status(503).json({ error: "Applications are temporarily unavailable. Please call (228) 278-7782." });
  }
});
router.use("/campaign", publicRouter, adminRouter, onboardingRouter);
router.use("/campaign", (err: unknown, req: import("express").Request, res: import("express").Response, _next: import("express").NextFunction) => {
  req.log.error({ err }, "Campaign request failed");
  res.status(503).json({ error: "We couldn't complete that request. Please try again or contact GulfCDD." });
});
export default router;
