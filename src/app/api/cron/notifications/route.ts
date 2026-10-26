import {timingSafeEqual} from "node:crypto";
import {dispatchNotifications} from "@/lib/server/notifications";
import {json} from "@/lib/server/http";
export const runtime = "nodejs";
export const maxDuration = 30;
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const supplied = request.headers.get("authorization") || "";
  const expected = Buffer.from(`Bearer ${secret || ""}`);
  const suppliedBytes = Buffer.from(supplied);
  if (!secret || suppliedBytes.length !== expected.length || !timingSafeEqual(suppliedBytes, expected)) return json({error: "Unauthorized"}, 401);
  try {
    const results = await dispatchNotifications();
    return json({processed: results.length, pending: results.filter(result => result.pending).length});
  } catch {
    console.error("RMG notification retry failed; inspect pending inquiries");
    return json({error: "Retry unavailable"}, 503);
  }
}
