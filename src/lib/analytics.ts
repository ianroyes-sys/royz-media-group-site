export const ANALYTICS_EVENTS = ["page_view", "preview_started", "preview_saved", "preview_shared", "preview_booking", "portfolio_viewed", "booking_opened", "booking_completed"] as const;
export type AnalyticsEvent = typeof ANALYTICS_EVENTS[number];
export function trackEvent(name: AnalyticsEvent) {
  if (typeof window === "undefined" || document.documentElement.dataset.analytics !== "enabled" || navigator.doNotTrack === "1" || (navigator as Navigator & {globalPrivacyControl?: boolean}).globalPrivacyControl) return;
  void fetch("/api/events", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({name}), keepalive: true}).catch(() => {});
}
