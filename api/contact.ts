import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

type Payload = {
  name?: string;
  email?: string;
  company?: string;
  nature?: string;
  scope?: string;
  timeline?: string;
  budget?: string;
  narrative?: string;
};

const DESTINATION = process.env.CONTACT_DESTINATION || "misshossain2437@gmail.com";
const FROM = process.env.CONTACT_FROM || "Mariya Akter Studio <onboarding@resend.dev>";
const REPLY_TO_DOMAIN = "mariyaakter.me";

function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtml(p: Required<Payload>): string {
  const rows: Array<[string, string]> = [
    ["Nature", p.nature],
    ["Scope", p.scope],
    ["Timeline", p.timeline],
    ["Budget", p.budget || "Open"],
    ["Company", p.company || "—"],
    ["Email", p.email],
  ];
  const table = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 14px 6px 0;color:#8a8680;font:500 11px/1.4 ui-sans-serif,system-ui;letter-spacing:.08em;text-transform:uppercase">${escape(
          k,
        )}</td><td style="padding:6px 0;font:400 14px/1.5 ui-serif,Georgia;color:#0B0A09">${escape(v)}</td></tr>`,
    )
    .join("");
  const narrativeHtml = escape(p.narrative || "(no narrative provided)").replace(/\n/g, "<br/>");
  return `
  <div style="background:#FBF7F1;padding:40px 16px;font-family:ui-sans-serif,system-ui">
    <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #EAE4DA;border-radius:4px;padding:36px">
      <div style="font:500 11px/1.4 ui-sans-serif;letter-spacing:.2em;color:#8a8680;text-transform:uppercase">New inquiry · mariyaakter.me</div>
      <h1 style="font:400 28px/1.2 ui-serif,Georgia;color:#0B0A09;margin:14px 0 22px">From ${escape(p.name)}</h1>
      <table style="border-collapse:collapse;width:100%">${table}</table>
      <hr style="border:none;border-top:1px solid #EAE4DA;margin:28px 0"/>
      <div style="font:500 11px/1.4 ui-sans-serif;letter-spacing:.2em;color:#8a8680;text-transform:uppercase;margin-bottom:8px">Narrative</div>
      <div style="font:400 15px/1.6 ui-serif,Georgia;color:#0B0A09">${narrativeHtml}</div>
      <p style="margin-top:32px;font:400 12px/1.5 ui-sans-serif;color:#8a8680">Reply directly to this email — it will reach ${escape(
        p.email,
      )}.</p>
    </div>
  </div>`;
}

function buildText(p: Required<Payload>): string {
  return [
    `New inquiry — mariyaakter.me`,
    ``,
    `From: ${p.name} <${p.email}>`,
    `Company: ${p.company || "—"}`,
    ``,
    `Nature: ${p.nature}`,
    `Scope: ${p.scope}`,
    `Timeline: ${p.timeline}`,
    `Budget: ${p.budget || "Open"}`,
    ``,
    p.narrative || "(no narrative provided)",
  ].join("\n");
}

function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = (req.body ?? {}) as Payload;
  const name = (body.name ?? "").toString().trim();
  const email = (body.email ?? "").toString().trim();
  if (!name) return res.status(400).json({ ok: false, error: "Name is required." });
  if (!validEmail(email)) return res.status(400).json({ ok: false, error: "A valid email is required." });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ ok: false, error: "Email service is not configured." });
  }

  const payload: Required<Payload> = {
    name,
    email,
    company: (body.company ?? "").toString().trim(),
    nature: (body.nature ?? "—").toString().trim(),
    scope: (body.scope ?? "—").toString().trim(),
    timeline: (body.timeline ?? "—").toString().trim(),
    budget: (body.budget ?? "").toString().trim(),
    narrative: (body.narrative ?? "").toString().trim(),
  };

  const resend = new Resend(apiKey);
  try {
    const result = await resend.emails.send({
      from: FROM,
      to: DESTINATION,
      replyTo: `${name} <${email}>`,
      subject: `New inquiry — ${payload.nature} · ${name}`,
      text: buildText(payload),
      html: buildHtml(payload),
      headers: {
        "X-Entity-Ref-ID": `inquiry-${Date.now()}`,
        "X-Inquiry-Source": REPLY_TO_DOMAIN,
      },
    });
    if (result.error) {
      return res.status(502).json({ ok: false, error: result.error.message ?? "Email send failed." });
    }
    return res.status(200).json({ ok: true, id: result.data?.id ?? null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ ok: false, error: message });
  }
}
