export const PREVIEW_EVENT = "rmg:preview";
export const PREVIEW_STORAGE_KEY = "rmg:preview:v1";
export const PREVIEW_FEATURES = ["Booking", "Video library", "Events", "Member area", "Notifications", "Payments"] as const;
export type PreviewConcept = {
  name: string;
  industry: "church" | "clinic" | "coach" | "brand";
  accent: string;
  layout: "community" | "editorial" | "dashboard";
  features: string[];
};
export const DEFAULT_CONCEPT: PreviewConcept = { name: "", industry: "church", accent: "#34D3DC", layout: "community", features: ["Video library", "Events"] };
let sessionConcept: PreviewConcept | null = null;

export function validatePreviewConcept(value: unknown): PreviewConcept | null {
  if (!value || typeof value !== "object") return null;
  const c = value as Record<string, unknown>;
  if (typeof c.name !== "string" || c.name.length > 60 || typeof c.industry !== "string" || !["church", "clinic", "coach", "brand"].includes(c.industry) || typeof c.accent !== "string" || !/^#[0-9a-f]{6}$/i.test(c.accent) || typeof c.layout !== "string" || !["community", "editorial", "dashboard"].includes(c.layout) || !Array.isArray(c.features) || c.features.length > 6 || !c.features.every(f => typeof f === "string" && PREVIEW_FEATURES.includes(f as typeof PREVIEW_FEATURES[number]))) return null;
  return { name: c.name.replace(/[\u0000-\u001f]/g, ""), industry: c.industry as PreviewConcept["industry"], accent: c.accent, layout: c.layout as PreviewConcept["layout"], features: [...new Set(c.features)] as string[] };
}

export function readPreviewConcept(): PreviewConcept | null {
  if (typeof window === "undefined") return null;
  if (sessionConcept) return sessionConcept;
  try {
    const raw = localStorage.getItem(PREVIEW_STORAGE_KEY);
    if (!raw || raw.length > 2000) return null;
    const stored = JSON.parse(raw);
    if (typeof stored.savedAt !== "number" || Date.now() - stored.savedAt > 30 * 86400000) return null;
    return validatePreviewConcept(stored.concept);
  } catch { return null; }
}

export function savePreviewConcept(concept: PreviewConcept): boolean {
  const safe = validatePreviewConcept(concept);
  if (!safe || typeof window === "undefined") return false;
  sessionConcept = safe;
  let saved = false;
  try { localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify({concept: safe, savedAt: Date.now()})); saved = true; } catch { /* Private browsing may disable storage. Event handoff still works. */ }
  window.dispatchEvent(new CustomEvent(PREVIEW_EVENT, {detail: safe}));
  return saved;
}

export function clearPreviewConcept(): void {
  if (typeof window === "undefined") return;
  sessionConcept = null;
  try { localStorage.removeItem(PREVIEW_STORAGE_KEY); } catch { /* Nothing persisted when storage is disabled. */ }
  window.dispatchEvent(new CustomEvent(PREVIEW_EVENT, {detail: null}));
}

export function conceptFromSearch(search: string): PreviewConcept | null {
  try {
    const raw = new URLSearchParams(search).get("concept");
    return raw && raw.length <= 2000 ? validatePreviewConcept(JSON.parse(raw)) : null;
  } catch { return null; }
}

export function conceptUrl(concept: PreviewConcept): string {
  const url = new URL(window.location.pathname, window.location.origin);
  url.searchParams.set("concept", JSON.stringify(validatePreviewConcept(concept) ?? DEFAULT_CONCEPT));
  url.hash = "preview";
  return url.toString();
}

export function formatPreviewConcept(concept: PreviewConcept): string {
  return [`App concept: ${concept.name || "Name to be decided"}`, `Industry: ${concept.industry}`, `Color: ${concept.accent}`, `Layout: ${concept.layout}`, `Features: ${concept.features.join(", ") || "To be discussed"}`].join("\n");
}
