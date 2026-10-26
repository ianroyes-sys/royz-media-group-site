import { json, rateKey, recipientRateKey, readJson, RequestError } from "@/lib/server/http";
import { parseLead } from "@/lib/server/leads";
import { database } from "@/lib/server/store";
import { dispatchNotifications } from "@/lib/server/notifications";
export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const lead = parseLead(await readJson(request));
    // Refuse new submissions if the delivery channel is unconfigured.
    if (!process.env.RMG_RESEND_API_KEY || !process.env.RMG_EMAIL_FROM || !process.env.RMG_INQUIRY_EMAIL) throw new Error("Email is not configured");
    const result = await database("rpc/rmg_accept_inquiry", {p_id: lead.requestId, p_hash: lead.hash, p_rate_key: rateKey(request), p_recipient_key: recipientRateKey(lead.email), p_name: lead.name, p_email: lead.email, p_message: lead.want, p_preview: lead.preview, p_email_preview: lead.emailPreview});
    if (result === "limited") return json({error: "Too many requests. Please try again in an hour, or email us directly."}, 429);
    if (result === "conflict") return json({error: "This submission changed. Please try again."}, 409);
    if (result === "existing_sent" || result === "existing_preview_sent") return json({ok: true, reference: lead.requestId, notified: true, previewEmailed: result === "existing_preview_sent"});
    if (result !== "saved" && result !== "existing") throw new Error("Storage did not acknowledge inquiry");
    let notified = false, previewEmailed = false;
    try {
      const delivery = await dispatchNotifications(lead.requestId);
      if (delivery[0]) {notified = delivery[0].notified; previewEmailed = delivery[0].previewEmailed;}
    } catch { console.error("RMG inquiry notification pending", {reference: lead.requestId}); }
    // Receipt means durable storage, even if an email provider is temporarily down.
    return json({ok: true, reference: lead.requestId, notified, previewEmailed});
  } catch (error) {
    if (error instanceof RequestError) return json({error: error.message}, error.status);
    console.error("RMG inquiry delivery unavailable");
    return json({error: "We couldn’t submit your inquiry right now. Your details are still here. Please retry, or email contact@royzmediagroup.com."}, 503);
  }
}
