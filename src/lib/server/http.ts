import { createHmac } from "node:crypto";

export class RequestError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export async function readJson(request: Request, limit = 12000): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.includes("application/json")) throw new RequestError("Use a JSON request.", 415);
  const origin = request.headers.get("origin");
  if (origin) {
    let source: URL;
    try { source = new URL(origin); } catch { throw new RequestError("This request is not allowed.", 403); }
    // Next.js may build request.url from its internal localhost listener. The
    // browser's Host header identifies the public target; do not trust forwarded
    // host/proto values. Compare host + port, allowing TLS termination upstream.
    const targetHost = request.headers.get("host") || new URL(request.url).host;
    if (!["http:", "https:"].includes(source.protocol) || source.origin !== origin || source.host.toLowerCase() !== targetHost.toLowerCase()) throw new RequestError("This request is not allowed.", 403);
  }
  if (request.headers.get("sec-fetch-site") === "cross-site") throw new RequestError("This request is not allowed.", 403);
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError("A request body is required.");
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const {value, done} = await reader.read();
    if (done) break;
    total += value.length;
    if (total > limit) { await reader.cancel(); throw new RequestError("Your message is too long.", 413); }
    chunks.push(value);
  }
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    return parsed;
  } catch { throw new RequestError("Please check your submission."); }
}
export function rateKey(request: Request, suffix = "") {
  // Vercel overwrites this header. Never store raw IP addresses.
  const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "local";
  const secret = process.env.RMG_RATE_LIMIT_SECRET;
  if (!secret) throw new Error("Rate limit secret is not configured");
  return createHmac("sha256", secret).update(`${new Date().toISOString().slice(0,10)}:${ip}:${suffix}`).digest("hex");
}
export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export function recipientRateKey(email: string) {
  const secret = process.env.RMG_RATE_LIMIT_SECRET;
  if (!secret) throw new Error("Rate limit secret is not configured");
  return createHmac("sha256", secret).update(`${new Date().toISOString().slice(0,10)}:recipient:${email}`).digest("hex");
}
