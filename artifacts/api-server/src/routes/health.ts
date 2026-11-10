import { Router, type IRouter, type RequestHandler } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const sendHealthResponse: RequestHandler = (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
};

// Keep the service root healthy for uptime monitors that probe /api.
router.get("/", sendHealthResponse);
router.get("/healthz", sendHealthResponse);

export default router;
