import { CapabilityPlayground } from "./CapabilityPlayground";
import { cases, process, stats } from "@/config/site";

/** Proof bar + a marquee of who the work was actually for. */
export function Proof() {
  const names = [...cases.map((c) => c.client), "World Harvest", "Selah", "SpendType"];
  const loop = names;

  return (
    <section className="border-y border-line bg-ink py-9">
      <div className="shell">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              data-reveal
              style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
            >
              <div className="tnum text-[clamp(28px,3.6vw,42px)] font-semibold tracking-[-0.03em] text-chalk">
                {s.value}
              </div>
              <div className="mt-1.5 text-[13px] leading-snug text-muted">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="marquee mt-8">
        <div className="marquee__track">
          {loop.map((n, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-8 px-8 text-[15px] font-medium tracking-[-0.01em] text-muted"
            >
              {n}
              <span className="inline-block h-[7px] w-[18px] skew-x-[-38deg] bg-royal/40" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Capabilities() { return <CapabilityPlayground />; }

export function Process() {
  return <section id="process" className="process-editorial section-space">
    <div className="shell process-layout">
      <div className="process-intro"><p className="eyebrow">From the first conversation</p><h2>A real app.<br />Every step.</h2><p>You review the direction. You test the build. You always know what comes next.</p><a href="#book">Start with a conversation <span aria-hidden>↗</span></a><div className="process-time"><span>2–4</span><p>weeks to TestFlight for focused builds,<br />once scope and assets are ready.</p></div></div>
      <ol className="process-steps">{process.map((p,i)=><li key={p.step}><details open={i===0}><summary><span className="process-number">{p.step}</span><span><small>{p.time}</small><strong>{p.title}</strong></span><span className="process-plus" aria-hidden>+</span></summary><p>{p.body}</p></details></li>)}</ol>
    </div>
  </section>;
}
