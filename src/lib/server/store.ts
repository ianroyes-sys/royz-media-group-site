export async function database(path: string, body: unknown, method = "POST") {
  const url = process.env.RMG_SUPABASE_URL;
  const key = process.env.RMG_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Inquiry storage is not configured");
  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${path}`, {
    method, headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(body), signal: AbortSignal.timeout(4000), cache: "no-store",
  });
  if (!response.ok) throw new Error(`Storage request failed (${response.status})`);
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
