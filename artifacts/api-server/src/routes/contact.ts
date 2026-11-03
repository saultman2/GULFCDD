import { Router } from "express";
import nodemailer from "nodemailer";
import formRateLimiter from "../middlewares/formRateLimit";
import { isValidEmail } from "../lib/validation";
import { formError, formSuccess, isNativeForm } from "../lib/formResponse";

const contactRouter = Router();

contactRouter.post("/contact", formRateLimiter, async (req, res) => {
  const {
    name,
    businessName,
    email,
    phone,
    websiteNeeded,
    budget,
    timeline,
    message,
    preferredContact,
  } = req.body as Record<string, string>;
  if (req.body.company_website) {
    formError(req, res, 400, "This submission could not be accepted.");
    return;
  }
  if (isNativeForm(req) && req.body.mathAnswer !== "2") {
    formError(req, res, 400, "Please answer the quick check with 2.");
    return;
  }

  // Honeypot — bots fill hidden fields, humans don't
  if ((req.body as Record<string, string>)._hp) {
    res.status(200).json({ ok: true });
    return;
  }

  const normalizedName = typeof name === "string" ? name.trim() : "";
  const normalizedEmail = typeof email === "string" ? email.trim() : "";
  const normalizedPhone = typeof phone === "string" ? phone.trim() : "";
  if (normalizedName.length < 2 || !normalizedEmail) {
    formError(req, res, 400, "Your name and email address are required");
    return;
  }
  if (!isValidEmail(normalizedEmail)) {
    formError(req, res, 400, "A valid email address is required");
    return;
  }
  if (
    (phone != null && typeof phone !== "string") ||
    (normalizedPhone && !/^\d{10,15}$/.test(normalizedPhone.replace(/\D/g, ""))) ||
    (preferredContact === "text" && !normalizedPhone)
  ) {
    formError(req, res, 400, "Please add a valid phone number with 10–15 digits, or leave it blank for an email reply");
    return;
  }
  if (normalizedName.length > 200 || normalizedEmail.length > 254 ||
    Object.values(req.body).some((value) => typeof value !== "string" || value.length > 10000)) {
    formError(req, res, 400, "Please keep your message under 10,000 characters and use plain text fields.");
    return;
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    req.log.warn(
      "SMTP credentials not configured — contact form submission received but email not sent",
    );
    formError(req, res, 503, "Email delivery is temporarily unavailable. Please email aultman@gulfcoastdigitaldesign.com directly.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const body = [
    "New project inquiry from GulfCDD.com",
    "",
    `Name:               ${normalizedName}`,
    `Business:           ${businessName || "Not provided"}`,
    `Email:              ${normalizedEmail}`,
    `Phone:              ${normalizedPhone || "Not provided"}`,
    `Preferred contact:  ${preferredContact || "Not specified"}`,
    "",
    `Website needed:     ${websiteNeeded || "Not specified"}`,
    `Budget:             ${budget || "Not specified"}`,
    `Timeline:           ${timeline || "Not specified"}`,
    "",
    "Message:",
    message || "No message provided",
  ].join("\n");

  await transporter.sendMail({
    from: smtpUser,
    to: smtpUser,
    replyTo: normalizedEmail,
    subject: `New inquiry: ${normalizedName}${businessName ? ` — ${businessName}` : ""}`,
    text: body,
  });

   req.log.info("Contact form email sent");
   formSuccess(req, res);
});

export default contactRouter;
