import { Resend } from "resend";

/**
 * POST /api/contact — Vercel Serverless Function.
 *
 * Validates a contact form submission and forwards it by email through Resend.
 * The visitor's address is set as the reply-to so the message can be answered
 * directly from the portfolio owner's inbox.
 *
 * Required environment variables (server-side only, never exposed to the client):
 *   RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL
 */

// The body cap must comfortably exceed the worst-case valid submission:
// 5000 message chars + 100 name chars + 254 email chars, each of which can be
// up to 4 bytes in UTF-8, plus JSON overhead.
const MAX_BODY_BYTES = 64 * 1024; // 64 KB
const NAME_MAX = 100;
const EMAIL_MAX = 254;
const MESSAGE_MAX = 5000;

// Best-effort in-memory rate limiting. Serverless instances are ephemeral and
// not shared, so this only throttles repeated requests hitting the same warm
// instance. It is a cheap first line of defence, not a durable guarantee.
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitStore = new Map();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Byte size of the payload actually received, so the body limit does not rely
 * on a client-supplied Content-Length header (which may be absent or falsified).
 */
function receivedByteSize(body) {
  if (typeof body === "string") return Buffer.byteLength(body, "utf8");
  if (body && typeof body === "object") {
    try {
      return Buffer.byteLength(JSON.stringify(body), "utf8");
    } catch {
      return Number.POSITIVE_INFINITY;
    }
  }
  return 0;
}

/** Collapses a value into a safe single-line string. */
function toSingleLine(value) {
  if (typeof value !== "string") return "";
  return value.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim();
}

/** Keeps paragraph breaks in the message while stripping stray control chars. */
function toMessage(value) {
  if (typeof value !== "string") return "";
  return value
    .replace(/\r\n/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function validate({ name, email, message }) {
  const errors = [];

  if (!name) {
    errors.push("A name is required.");
  } else if (name.length > NAME_MAX) {
    errors.push(`Name must be ${NAME_MAX} characters or fewer.`);
  }

  if (!email) {
    errors.push("An email address is required.");
  } else if (email.length > EMAIL_MAX || !EMAIL_PATTERN.test(email)) {
    errors.push("A valid email address is required.");
  }

  if (!message) {
    errors.push("A message is required.");
  } else if (message.length > MESSAGE_MAX) {
    errors.push(`Message must be ${MESSAGE_MAX} characters or fewer.`);
  }

  return errors;
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0];
  }
  return req.socket?.remoteAddress || "unknown";
}

function isRateLimited(key) {
  const now = Date.now();
  const recent = (rateLimitStore.get(key) || []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitStore.set(key, recent);
    return true;
  }

  recent.push(now);
  rateLimitStore.set(key, recent);

  // Opportunistically prune stale keys so the map cannot grow unbounded.
  if (rateLimitStore.size > 5000) {
    for (const [entryKey, timestamps] of rateLimitStore) {
      if (timestamps.every((timestamp) => now - timestamp >= RATE_LIMIT_WINDOW_MS)) {
        rateLimitStore.delete(entryKey);
      }
    }
  }

  return false;
}

function buildEmailText({ name, email, message }) {
  return [
    "New message from your portfolio contact form.",
    "",
    `Name:  ${name}`,
    `Email: ${email}`,
    "",
    "Message:",
    message,
  ].join("\n");
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  // Cheap early rejection using the declared size; the authoritative check
  // happens below against the payload actually received.
  const contentLength = Number(req.headers["content-length"] || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "Request payload is too large." });
  }

  if (isRateLimited(getClientIp(req))) {
    res.setHeader("Retry-After", String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)));
    return res
      .status(429)
      .json({ error: "Too many requests. Please try again in a minute." });
  }

  let payload = req.body;

  // Authoritative check: measured from the payload actually received, so a
  // missing or falsified Content-Length header cannot bypass the limit.
  if (receivedByteSize(payload) > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "Request payload is too large." });
  }

  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      return res.status(400).json({ error: "Invalid request payload." });
    }
  }
  if (!payload || typeof payload !== "object") {
    return res.status(400).json({ error: "Invalid request payload." });
  }

  // Honeypot: a real visitor never fills this hidden field. Respond with a
  // normal success so automated senders get no signal that they were caught.
  const honeypot = typeof payload.company === "string" ? payload.company.trim() : "";
  if (honeypot) {
    return res.status(200).json({ ok: true });
  }

  const name = toSingleLine(payload.name);
  const email = toSingleLine(payload.email);
  const message = toMessage(payload.message);

  if (validate({ name, email, message }).length > 0) {
    return res
      .status(400)
      .json({ error: "Invalid submission. Please check the form and try again." });
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error(
      "[api/contact] Missing environment variables. RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL must all be set.",
    );
    return res
      .status(500)
      .json({ error: "The contact form is not configured yet. Please try again later." });
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: buildEmailText({ name, email, message }),
    });

    if (error) {
      console.error("[api/contact] Resend reported an error:", error);
      return res
        .status(502)
        .json({ error: "Unable to send your message right now. Please try again later." });
    }

    return res.status(200).json({ ok: true });
  } catch (sendError) {
    console.error("[api/contact] Unexpected failure:", sendError);
    return res
      .status(500)
      .json({ error: "Unable to send your message right now. Please try again later." });
  }
}
