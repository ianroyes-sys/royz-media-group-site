import {ANALYTICS_EVENTS} from "@/lib/analytics";
import {json, rateKey, readJson, RequestError} from "@/lib/server/http";
import {database} from "@/lib/server/store";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (request.headers.get("dnt") === "1" || request.headers.get("sec-gpc") === "1") return new Response(null, {status: 204});
  try {
    const body = await readJson(request, 256);
    if (typeof body.name !== "string" || !ANALYTICS_EVENTS.includes(body.name as typeof ANALYTICS_EVENTS[number])) throw new RequestError("Unknown event.");
    await database("rpc/rmg_count_event", {p_event: body.name, p_rate_key: rateKey(request, "events")});
    return new Response(null, {status: 204});
  } catch (error) {
    return json({error: "Event unavailable"}, error instanceof RequestError ? error.status : 503);
  }
}
