import { Router } from "express";
import nodemailer from "nodemailer";
import formRateLimiter from "../middlewares/formRateLimit";

const widgetRouter = Router();

widgetRouter.post("/widget", formRateLimiter, async (req, res) => {
  const { name, phone, note } = req.body as Record<string, string>;

  if (!name || name.trim().length < 2) {
    res.status(400).json({ error: "Name is required" });
    return;
  }
  if (!phone || phone.replace(/\D/g, "").length < 10) {
    res.status(400).json({ error: "A valid phone number is required" });
    return;
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    req.log.warn(
      "SMTP credentials not configured — widget text-back request received but email not sent",
    );
    res.status(200).json({ ok: true, note: "no-smtp" });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const body = [
    "Text-back request from GulfCDD.com support widget",
    "",
    `Name:    ${name}`,
    `Phone:   ${phone}`,
    `Note:    ${note || "No message left"}`,
  ].join("\n");

  await transporter.sendMail({
    from: smtpUser,
    to: smtpUser,
    subject: `Text-back request: ${name} — ${phone}`,
    text: body,
  });

  req.log.info({ name, phone }, "Widget text-back email sent");
  res.status(200).json({ ok: true });
});

export default widgetRouter;
