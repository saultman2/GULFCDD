import { Router } from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import formRateLimiter from "../middlewares/formRateLimit";
import { isValidEmail } from "../lib/validation";
import { formError, formSuccess, isNativeForm } from "../lib/formResponse";

const intakeRouter = Router();
const QUOTE_TIERS: Record<string, string> = {
  essential: "Essential",
  growth: "Growth",
  "full-service": "Full Service",
  unsure: "Not sure yet — help me choose",
  // Older form links still submit; label them with the current plans.
  standard: "Essential",
  gold: "Growth",
  platinum: "Full Service",
  custom: "Full Service",
};
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_TOTAL_FILE_SIZE = 18 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = new Set([
  ".ai", ".eps", ".heic", ".jpeg", ".jpg", ".pdf", ".png", ".svg", ".webp",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 10,
    fields: 100,
    fieldSize: 100_000,
  },
  fileFilter: (_req, file, callback) => {
    const extension = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf("."));
    if (!ALLOWED_FILE_EXTENSIONS.has(extension)) {
      callback(new Error("Unsupported file type. Please upload a JPG, PNG, SVG, PDF, AI, EPS, WEBP, or HEIC file."));
      return;
    }
    callback(null, true);
  },
});

function makeTransporter(smtpUser: string, smtpPass: string) {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
  });
}

function optional(label: string, value: string | string[] | undefined): string {
  if (!value || (Array.isArray(value) && value.length === 0)) return "";
  const v = Array.isArray(value) ? value.join(", ") : value;
  return `${label}: ${v}\n`;
}

function buildQuickBody(d: Record<string, unknown>): string {
  return [
    "=== NEW QUOTE REQUEST (Quick Form) ===",
    "Gulf Coast Digital Designs — gulfcdd.com",
    "",
    "── Contact ──────────────────────────────",
    `Business Name:    ${d.bizName}`,
    `Contact Name:     ${d.contactName}`,
    `Phone:            ${d.phone || "Not provided"}`,
    `Email:            ${d.email}`,
    "",
    "── Project Details ──────────────────────",
    optional("Tier preference", typeof d.tierPreference === "string" ? QUOTE_TIERS[d.tierPreference] : undefined),
    optional("Services requested", d.services as string[]),
    optional("Features requested", d.features as string[]),
    optional("Request source", d.source === "homepage-special" ? "Homepage special offer" : d.source === "quote" ? "Website quote form" : undefined),
    optional("Current Website", d.currentSite as string),
    optional("Goals", d.goals as string[]),
    optional("Notes", d.notes as string),
    "─────────────────────────────────────────",
    "Reply directly to this email or reach the client at the phone/email above.",
  ].join("\n");
}

function buildFullBody(d: Record<string, unknown>): string {
  return [
    "=== NEW QUOTE REQUEST (Full Details Form) ===",
    "Gulf Coast Digital Designs — gulfcdd.com",
    "",
    "── Contact ──────────────────────────────",
    `Business Name:      ${d.bizName}`,
    `Contact Name:       ${d.contactName}`,
    `Phone:              ${d.phone}`,
    `Email:              ${d.email}`,
    optional("Industry", d.industry as string),
    optional("Service Area", d.serviceArea as string),
    optional("Business Description", d.bizDesc as string),
    "",
    "── Online Presence ──────────────────────",
    optional("Current Website", d.currentSite as string),
    optional("Domain Name", d.domainName as string),
    optional("Domain Registrar", d.domainRegistrar as string),
    optional("Google Business", d.googleBiz as string),
    optional("Facebook", d.facebook as string),
    optional("Instagram", d.instagram as string),
    optional("Other Links", d.otherLinks as string),
    "",
    "── Project Goals ────────────────────────",
    optional("Goals", d.goals as string[]),
    optional("Pages Needed", d.pagesNeeded as string[]),
    optional("Features Needed", d.featuresNeeded as string[]),
    optional("Reference / Inspiration Sites", d.refSites as string),
    "",
    "── Content ──────────────────────────────",
    optional("Services / Products to List", d.servicesList as string),
    optional("Unique Selling Points", d.sellingPoints as string),
    optional("Testimonials / Reviews", d.testimonials as string),
    optional("Logo Files Attached", d.logoFiles as string[]),
    optional("Photo Files Attached", d.photoFiles as string[]),
    "",
    "── Timeline & Budget ────────────────────",
    optional("Urgency", d.urgency as string),
    optional("Tier / Package Preference", d.tierPreference as string),
    optional("Additional Notes", d.notes as string),
    "─────────────────────────────────────────",
    "Reply to this email or reach the client at the phone/email above.",
  ].join("\n");
}

function buildClientConfirmation(contactName: string, mode: "quick" | "full"): string {
  const detail = mode === "quick"
    ? "We will reach out within one business day to confirm details and walk you through next steps."
    : "We will review everything you sent and follow up within one business day.";

  return [
    `Hi ${contactName},`,
    "",
    `Thanks for reaching out to Gulf Coast Digital Designs! We received your quote request${mode === "full" ? " and attached files" : ""} and will be in touch soon.`,
    "",
    detail,
    "",
    "In the meantime, feel free to reply to this message or reach us directly:",
    "  Email: aultman@gulfcoastdigitaldesign.com",
    "  Phone: (228) 278-7782",
    "  Web:   https://www.gulfcdd.com",
    "",
    "— Josh & Stephen Aultman",
    "  Gulf Coast Digital Designs",
    "  Veteran-Owned & Operated | Biloxi, MS",
  ].join("\n");
}

intakeRouter.post(
  "/intake",
  formRateLimiter,
  (req, res, next) => {
    upload.fields([
      { name: "logoFiles", maxCount: 5 },
      { name: "photoFiles", maxCount: 10 },
    ])(req, res, (err) => {
      if (!err) {
        next();
        return;
      }
      if (err instanceof multer.MulterError) {
        const message = err.code === "LIMIT_FILE_SIZE"
          ? "Each uploaded file must be 8 MB or smaller."
          : err.code === "LIMIT_FILE_COUNT"
            ? "Please upload no more than 10 files."
            : "There was a problem processing your uploaded files.";
        res.status(400).json({ error: message });
        return;
      }
      res.status(400).json({ error: err instanceof Error ? err.message : "There was a problem processing your uploaded files." });
    });
  },
  async (req, res) => {
  let d: Record<string, unknown>;
  try {
    d = typeof req.body.data === "string"
      ? JSON.parse(req.body.data) as Record<string, unknown>
      : req.body as Record<string, unknown>;
  } catch {
    res.status(400).json({ error: "The submitted form data could not be read." });
    return;
  }
  if (!d || typeof d !== "object" || Array.isArray(d)) {
    res.status(400).json({ error: "Please send your project details as a form." });
    return;
  }
  const mode = (d.mode as string) === "full" ? "full" : "quick";
  if (d.company_website || req.body.company_website) {
    formError(req, res, 400, "This submission could not be accepted.");
    return;
  }
  if (isNativeForm(req)) {
    if (d.mathAnswer !== "2") {
      formError(req, res, 400, "Please answer the quick check with 2.");
      return;
    }
    for (const key of ["services", "features", "goals", "pagesNeeded", "featuresNeeded"]) {
      if (typeof d[key] === "string") d[key] = [d[key]];
    }
    if (mode === "quick" && !d.tierPreference) {
      formError(req, res, 400, "Please choose a tier, or select Not sure yet.");
      return;
    }
  }
  const contactName = typeof d.contactName === "string" ? d.contactName.trim() : "";
  const email = typeof d.email === "string" ? d.email.trim() : "";
  const bizName = typeof d.bizName === "string" ? d.bizName.trim() : "";

  // Honeypot — bots fill hidden fields, humans don't
  if (d._hp) {
    res.status(200).json({ ok: true });
    return;
  }

  if (!contactName || !email || !bizName) {
    formError(req, res, 400, "Your name, business name and email are required.");
    return;
  }
  if (!isValidEmail(email)) {
    formError(req, res, 400, "A valid email address is required");
    return;
  }
  if (contactName.length > 200 || bizName.length > 200 || email.length > 254 ||
    Object.values(d).some((value) => typeof value === "string" ? value.length > 10000 :
      !Array.isArray(value) || value.length > 30 || value.some((entry) => typeof entry !== "string" || entry.length > 10000))) {
    formError(req, res, 400, "Please use plain text fields and keep each answer under 10,000 characters.");
    return;
  }
  if (mode === "full" && (!d.industry || typeof d.phone !== "string" || !/^\d{10,15}$/.test(d.phone.replace(/\D/g, "")))) {
    formError(req, res, 400, "Please add your industry and a phone number with 10–15 digits.");
    return;
  }
  if (mode === "quick") {
    if (d.tierPreference !== undefined && (
      typeof d.tierPreference !== "string" ||
      !Object.hasOwn(QUOTE_TIERS, d.tierPreference)
    )) {
       formError(req, res, 400, "Choose Essential, Growth, Full Service, or Not sure yet.");
      return;
    }
    for (const [key, limit] of [["services", 8], ["features", 12]] as const) {
      const choices = d[key];
      if (choices !== undefined && (
        !Array.isArray(choices) || choices.length > limit ||
        choices.some((value) => typeof value !== "string" || !value.trim() || value.length > 150)
      )) {
         formError(req, res, 400, `Please choose valid ${key} from the form.`);
        return;
      }
    }
    if (d.source !== undefined && d.source !== "quote" && d.source !== "homepage-special") {
       formError(req, res, 400, "The quote request source was not recognized. Please reopen the quote form.");
      return;
    }
    if (d.phone !== undefined && (
      typeof d.phone !== "string" ||
      (d.phone.trim() && !/^\d{10,15}$/.test(d.phone.replace(/\D/g, "")))
    )) {
       formError(req, res, 400, "Add a phone number with 10–15 digits, or leave it blank.");
      return;
    }
  }
  d = { ...d, contactName, email, bizName };

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    req.log.warn("SMTP credentials not configured — intake form received but email not sent");
    formError(req, res, 503, "Email delivery is temporarily unavailable. Please email aultman@gulfcoastdigitaldesign.com directly.");
    return;
  }

  const transporter = makeTransporter(smtpUser, smtpPass);
  const internalBody = mode === "quick" ? buildQuickBody(d) : buildFullBody(d);
  const clientBody = buildClientConfirmation(contactName, mode);
  const subject = `New quote request: ${bizName} — ${contactName}`;
  const uploadedFiles = (req.files && !Array.isArray(req.files))
    ? Object.values(req.files).flat()
    : [];
  const totalFileSize = uploadedFiles.reduce((total, file) => total + file.size, 0);

  if (totalFileSize > MAX_TOTAL_FILE_SIZE) {
    res.status(400).json({ error: "Your uploaded files are too large to send together. Please keep the total under 18 MB." });
    return;
  }

  const attachments = uploadedFiles.map((file) => ({
    filename: file.originalname,
    content: file.buffer,
    contentType: file.mimetype,
  }));

  // Send both emails in parallel
  try {
    await Promise.all([
      // 1. Notification to GulfCDD
      transporter.sendMail({
        from: smtpUser,
        to: "aultman@gulfcoastdigitaldesign.com",
        replyTo: email,
        subject,
        text: internalBody,
        attachments,
      }),
      // 2. Confirmation back to the client
      transporter.sendMail({
        from: smtpUser,
        to: email,
        replyTo: "aultman@gulfcoastdigitaldesign.com",
        subject: "We received your quote request — Gulf Coast Digital Designs",
        text: clientBody,
      }),
    ]);
  } catch (err) {
    req.log.error({ err, bizName, email }, "Intake form email failed — SMTP error");
    formError(req, res, 500, "Email delivery failed. Please contact us directly at aultman@gulfcoastdigitaldesign.com.");
    return;
  }

  req.log.info({ bizName, email, mode }, "Intake form emails sent");
  formSuccess(req, res);
  },
);

export default intakeRouter;
