import rateLimit from "express-rate-limit";
import { formError } from "../lib/formResponse";

const formRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions, please try again later." },
  handler: (req, res) => formError(req, res, 429, "Too many submissions. Please try again in 15 minutes."),
});

export default formRateLimiter;
