import { foundingRemaining, pricing, pricingNotes, site } from "@/config/site";

export function Pricing() {
  return (
    <section id="pricing" className="spotlight section-space">
      <div className="shell">
        <div className="max-w-[62ch]">
          <div className="eyebrow" data-reveal>
            06 — Pricing
          </div>
          <h2 className="h2 mt-5" data-reveal>
            The number, before you have to ask for it.
          </h2>
          <p className="lede mt-5" data-reveal>
            One-time development, optional monthly care. We agree on deliverables,
            revisions, and third-party costs in writing before work begins.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-3">
          {pricing.map((t, i) => (
            <div
              key={t.name}
              className="pricing-card bg-ink p-7"
              data-featured={t.featured}
              data-reveal
              style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-block h-[8px] w-[22px] shrink-0 skew-x-[-38deg] ${
                    t.featured ? "bg-royal" : "bg-royal/40"
                  }`}
                />
                <span className="text-[16px] font-semibold tracking-[-0.015em] text-chalk">
                  {t.name}
                </span>
              </div>

              <div className="mt-6">
              <div className="flex items-baseline gap-2">
                <span className="tnum text-[clamp(30px,3.4vw,40px)] font-semibold tracking-[-0.03em] text-chalk">
                  {t.price}
                </span>
                <span className="text-[13px] text-muted">build</span>
              </div>
              <div className="mt-1.5 text-[13px] leading-snug text-muted">
                {t.priceNote}
              </div>

              <p className="mt-3 text-[14px] text-chalk">Optional care: {t.retainer}</p>
              </div>
              <p className="mt-6 min-h-[96px] text-[15px] leading-relaxed text-muted">{t.body}</p>

              <ul className="mt-7 grid gap-2.5 border-t border-line pt-7">
                {t.includes.map((line) => (
                  <li
                    key={line}
                    className="flex gap-3 text-[14px] leading-relaxed text-muted"
                  >
                    <span className="mt-[9px] inline-block h-[5px] w-[14px] shrink-0 skew-x-[-38deg] bg-royal/50" />
                    {line}
                  </li>
                ))}
              </ul>

              <a
                href="#book"
                className={`btn mt-8 w-full self-end ${t.featured ? "btn--primary" : ""}`}
              >
                Discuss this package
              </a>
            </div>
          ))}
        </div>

        {foundingRemaining > 0 ? (
          <p className="mt-8 text-[14px] leading-relaxed text-muted" data-reveal>
            The church founding offer is limited to the first five qualifying projects.
            We confirm availability and your final scope before taking payment.

          </p>
        ) : null}

        <ul className="mt-10 grid gap-2.5 md:grid-cols-2">
          {pricingNotes.map((n, i) => (
            <li
              key={n}
              className="flex gap-3 text-[14px] leading-relaxed text-muted"
              data-reveal
              style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
            >
              <span className="mt-[9px] inline-block h-[5px] w-[14px] shrink-0 skew-x-[-38deg] bg-royal/50" />
              {n}
            </li>
          ))}
        </ul>

        <p className="mt-8 text-[13px] leading-relaxed text-muted/80" data-reveal>
          Not sure which one you are? That is what the free call is for — email{" "}
          <a className="text-chalk underline underline-offset-4" href={`mailto:${site.email}`}>
            {site.email}
          </a>{" "}
          or book below.
        </p>
      </div>
    </section>
  );
}
