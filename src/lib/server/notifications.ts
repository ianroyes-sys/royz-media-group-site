import {database} from "./store";
import {notifyLead, type NotificationRecord} from "./leads";

/** A DB lease prevents a browser retry and cron invocation sending concurrently. */
export async function dispatchNotifications(id: string | null = null) {
  const claimed = await database("rpc/rmg_claim_notifications", {p_id: id, p_limit: id ? 1 : 10}) as NotificationRecord[];
  if (!Array.isArray(claimed) || claimed.length > 10) throw new Error("Invalid notification claim");
  return Promise.all(claimed.map(async row => {
    const delivery = await notifyLead(row);
    const pending = !delivery.notified || (row.email_preview && !delivery.previewEmailed);
    await database(`rmg_inquiries?id=eq.${row.id}`, {
      notified_at: delivery.notified ? row.notified_at || new Date().toISOString() : null,
      preview_emailed: delivery.previewEmailed,
      next_notification_attempt_at: pending ? new Date(Date.now() + Math.min(24, 2 ** row.notification_attempts) * 3600000).toISOString() : null,
    }, "PATCH");
    if (pending) console.error("RMG notification pending", {reference: row.id, attempts: row.notification_attempts});
    return {reference: row.id, ...delivery, pending};
  }));
}
