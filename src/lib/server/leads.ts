import { createHash } from "node:crypto";
import { formatPreviewConcept, validatePreviewConcept } from "../preview";
import { RequestError } from "./http";

export function parseLead(data: Record<string, unknown>) {
  const string = (key: string, max: number, required = false) => {
    const v = data[key];
    if (typeof v !== "string" || v.length > max || (required && !v.trim())) throw new RequestError(`Please check your ${key === "want" ? "project details" : key}.`);
    return v.trim();
  };
  if (data.company) throw new RequestError("Unable to accept this submission.");
  const name = string("name", 120, true);
  const email = string("email", 254, true).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\r\n]/.test(name)) throw new RequestError("Please enter a valid name and email.");
  const want = string("want", 4000, true);
  if (typeof data.requestId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.requestId)) throw new RequestError("Please refresh the page and try again.");
  const preview = data.preview == null ? null : validatePreviewConcept(data.preview);
  if (data.preview != null && !preview) throw new RequestError("Please update your app concept and try again.");
  if (data.emailPreview != null && typeof data.emailPreview !== "boolean") throw new RequestError("Invalid email preference.");
  const lead = {name, email, want, preview, emailPreview: !!preview && data.emailPreview === true};
  return { ...lead, requestId: data.requestId, hash: createHash("sha256").update(JSON.stringify(lead)).digest("hex") };
}
export type NotificationRecord = {
  id: string; name: string; email: string; message: string; preview: unknown;
  email_preview: boolean; preview_emailed: boolean; notified_at: string | null;
  notification_attempts: number;
};
export async function notifyLead(row: NotificationRecord) {
  const key = process.env.RMG_RESEND_API_KEY;
  const from = process.env.RMG_EMAIL_FROM;
  const to = process.env.RMG_INQUIRY_EMAIL;
  if (!key || !from || !to) throw new Error("Inquiry email is not configured");
  const send = async (body: object, id: string) => {
    const result = await fetch("https://api.resend.com/emails", {method: "POST", headers: {Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": id}, body: JSON.stringify(body), signal: AbortSignal.timeout(5000)});
    if (!result.ok) throw new Error(`Email delivery request failed (${result.status})`);
    const receipt = await result.json();
    if (typeof receipt.id !== "string" || !receipt.id) throw new Error("Email provider did not confirm receipt");
  };
  const preview = validatePreviewConcept(row.preview);
  const concept = preview ? `\n\n${formatPreviewConcept(preview)}` : "";
  const owner = row.notified_at ? Promise.resolve() : send({from, to: [to], reply_to: row.email, subject: "New Royz Media Group project inquiry", text: `Name: ${row.name}\nEmail: ${row.email}\n\n${row.message}${concept}\n\nReference: ${row.id}`}, `inquiry-${row.id}`);
  const needsPreview = row.email_preview && !row.preview_emailed && !!preview;
  const url = new URL("https://royzmediagroup.com/");
  if (preview) url.searchParams.set("concept", JSON.stringify(preview));
  url.hash = "preview";
  // Independent sends: a customer-copy failure never resets owner delivery state.
  const copy = needsPreview ? send({from, to: [row.email], subject: "Your Royz Media Group app concept", text: `You requested a copy of your illustrative app concept. Open it here:\n${url}\n\nThis is a concept, not a finished application or quote. Your project inquiry has been received.\n\nRoyz Media Group\nhttps://royzmediagroup.com/privacy`}, `concept-${row.id}`) : Promise.resolve();
  const [ownerResult, copyResult] = await Promise.allSettled([owner, copy]);
  return {notified: !!row.notified_at || ownerResult.status === "fulfilled", previewEmailed: row.preview_emailed || (needsPreview && copyResult.status === "fulfilled")};
}
