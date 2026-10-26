"use client";

import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { Arrow } from "./Hero";
import { LeadForm } from "./LeadForm";
import { PREVIEW_EVENT, readPreviewConcept, formatPreviewConcept, validatePreviewConcept, type PreviewConcept } from "@/lib/preview";
import { trackEvent } from "@/lib/analytics";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Cal?: any;
  }
}

export function Booking({ inquiriesAvailable = true }: { inquiriesAvailable?: boolean }) {
  const [failed, setFailed] = useState(false);
  const [opened, setOpened] = useState(false);
  const [ready, setReady] = useState(false);
  const [concept, setConcept] = useState<PreviewConcept | null>(null);
  const [bookingConcept, setBookingConcept] = useState<PreviewConcept | null>(null);
  useEffect(() => {
    setConcept(readPreviewConcept());
    const update = (e: Event) => setConcept(validatePreviewConcept((e as CustomEvent).detail));
    window.addEventListener(PREVIEW_EVENT, update);
    return () => window.removeEventListener(PREVIEW_EVENT, update);
  }, []);
  const bookingUrl = new URL(`https://cal.com/${site.calLink}`);
  if (concept) bookingUrl.searchParams.set("notes", formatPreviewConcept(concept));


  useEffect(() => {
    if (!site.calConfigured || !opened) return;
    let alive = true;

    // Cal.com's official loader. It installs a queue synchronously so calls
    // made before embed.js lands are replayed once it does — writing our own
    // stub races the real script and throws "Cal is not defined".
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (function (C: any, A: string, L: string) {
      const p = (a: any, ar: any) => a.q.push(ar);
      const d = C.document;
      C.Cal =
        C.Cal ||
        function (...args: any[]) {
          const cal = C.Cal;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (args[0] === L) {
            const api = function (...a: any[]) {
              p(api, a);
            };
            const namespace = args[1];
            (api as any).q = (api as any).q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], args);
              p(cal, ["initNamespace", namespace]);
            } else {
              p(cal, args);
            }
            return;
          }
          p(cal, args);
        };
    })(window, "https://app.cal.com/embed/embed.js", "init");
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const w = window as Window;
    w.Cal?.("init", { origin: "https://cal.com" });
    w.Cal?.("inline", {
      elementOrSelector: "#cal-inline",
      calLink: site.calLink,
      // config.theme is the only one Cal reads before first paint — the ui()
      // call below lands too late to stop a light-mode visitor seeing a white
      // calendar flash on a black page.
      config: { theme: "dark", ...(bookingConcept ? { notes: formatPreviewConcept(bookingConcept) } : {}) },
      layout: "month_view",
    });
    w.Cal?.("ui", {
      theme: "dark",
      hideEventTypeDetails: false,
      layout: "month_view",
      cssVarsPerTheme: { dark: { "cal-brand": "#2E52FF" } },
    });

    const onReady = () => { if (alive) { setReady(true); setFailed(false); } };
    const onFailed = () => { if (alive) setFailed(true); };
    const completed = new Set<string>();
    const onBooked = (event: { detail?: { data?: { uid?: string; status?: string; paymentRequired?: boolean } } }) => {
      const data = event.detail?.data;
      if (!alive || !data?.uid || data.status !== "ACCEPTED" || data.paymentRequired || completed.has(data.uid)) return;
      completed.add(data.uid);
      trackEvent("booking_completed");
    };
    w.Cal?.("on", { action: "linkReady", callback: onReady });
    w.Cal?.("on", { action: "linkFailed", callback: onFailed });
    w.Cal?.("on", { action: "bookingSuccessfulV2", callback: onBooked });
    const guard = setTimeout(() => { if (alive) setFailed(true); }, 18000);
    const clearGuard = () => clearTimeout(guard);
    w.Cal?.("on", { action: "linkReady", callback: clearGuard });
    return () => {
      alive = false;
      clearTimeout(guard);
      w.Cal?.("off", { action: "linkReady", callback: onReady });
      w.Cal?.("off", { action: "linkReady", callback: clearGuard });
      w.Cal?.("off", { action: "linkFailed", callback: onFailed });
      w.Cal?.("off", { action: "bookingSuccessfulV2", callback: onBooked });
    };
  }, [opened, bookingConcept]);

  return (
    <section id="book" className="scroll-mt-24 border-t border-line bg-ink section-space">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12">
          {/* Pitch */}
          <div className="lg:col-span-5">
            <div className="eyebrow" data-reveal>
              Let’s talk
            </div>
            <h2 className="h2 mt-5" data-reveal>
              Tell us what you have in mind.
            </h2>
            <p className="lede mt-5" data-reveal>
              Send a project brief or choose a free 15-minute conversation.
              We’ll discuss the audience, first version, likely scope, and next steps.
            </p>

            <ul className="mt-9 space-y-3.5" data-reveal>
              {[
                "Free consultation, with no obligation",
                "A written scope before you commit",
                "If an app is the wrong move, we'll say so",
                "Your saved app concept comes with you",
              ].map((p) => (
                <li key={p} className="flex items-start gap-3 text-[14.5px]">
                  <span className="mt-[7px] inline-block h-[7px] w-[19px] shrink-0 skew-x-[-38deg] bg-royal" />
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-10" data-reveal>
              <LeadForm available={inquiriesAvailable} />
            </div>

            <div className="panel mt-4 p-6">
              <div className="text-[11px] tracking-[0.18em] text-muted">
                OR JUST EMAIL US
              </div>
              <a
                href={`mailto:${site.email}?subject=App%20enquiry%20—%20via%20royzmediagroup.com`}
                className="mt-2 block break-all text-[17px] font-semibold text-chalk transition-colors hover:text-royal"
              >
                {site.email}
              </a>
              {site.phone ? (
                <a
                  href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}
                  className="mt-1 block text-[15px] text-muted transition-colors hover:text-chalk"
                >
                  {site.phone}
                </a>
              ) : null}
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <div className="panel overflow-hidden p-5 sm:p-8">
              <p className="eyebrow">Free consultation</p>
              <h3 className="mt-3 text-2xl font-semibold text-chalk">Find a time that works.</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">15 minutes with Ian Royes. Times are shown in your timezone. The calendar loads when you open it.</p>
              {concept && <div className="mt-5 rounded-xl border border-line bg-ink-deep p-4 text-sm">
                <p className="font-semibold text-chalk">{concept.name || "Your app concept"}</p>
                <p className="mt-2 text-muted">{concept.industry} · {concept.layout} · {concept.features.join(", ") || "Features to discuss"}</p>
                <p className="mt-2 text-xs text-muted">{opened ? "The concept selected when you opened the calendar is included in its notes. Use the separate booking page below for your latest changes." : "Included in the booking notes when you open the calendar."}</p>
              </div>}
              {!opened && <button type="button" className="btn btn--primary mt-6" onClick={() => {setBookingConcept(concept); setOpened(true); trackEvent("booking_opened");}}>Choose a time <Arrow /></button>}
              {opened && !ready && !failed && <div role="status" className="mt-6 rounded-xl border border-line p-8 text-sm text-muted">Loading available appointments…</div>}
              {opened && <div id="cal-inline" className={`cal-shell mt-5 ${failed ? "hidden" : ""}`} />}
              {failed && <p role="status" className="mt-5 text-sm text-muted">The embedded calendar could not load. You can still book on Cal.com or send your brief using the form.</p>}
              <a href={bookingUrl.toString()} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("booking_opened")} className="mt-5 inline-block text-sm text-chalk underline underline-offset-4">Open the booking page in a new tab ↗</a>
              <p className="mt-4 text-xs text-muted">Scheduling is provided by Cal.com. <a href="/privacy" className="underline underline-offset-4">How we handle your details</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
