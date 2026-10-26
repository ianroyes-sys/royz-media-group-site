"use client";

import { useRef, useState, type CSSProperties } from "react";
import { cases } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { Arrow } from "./Hero";
import { AppVideo } from "./AppVideo";
import styles from "./Work.module.css";

export function Work() {
  const [active, setActive] = useState(0);
  const c = cases[active];
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  function select(i: number, focus = false) {
    setActive(i);
    if (focus) tabs.current[i]?.focus();
    trackEvent("portfolio_viewed");
  }

  return <section id="work" className={`${styles.section} section-space scroll-mt-24`}>
    <div className="shell">
      <div className={styles.heading}>
        <div><p className="eyebrow">Selected work / 01—05</p><h2 className={styles.title}>Made to feel<br /><span>like you.</span></h2></div>
        <div className={styles.intro}><p className="lede">Five audiences. Five distinct identities. Explore real app recordings and the thinking behind every screen.</p><a href="/work" className={styles.textLink}>All case studies <Arrow /></a></div>
      </div>
      <div className={styles.tabs} role="tablist" aria-label="Client work">
        {cases.map((item, i) => <button key={item.slug} ref={el => { tabs.current[i] = el; }} id={`work-tab-${item.slug}`} role="tab" aria-selected={active === i} aria-controls="work-panel" tabIndex={active === i ? 0 : -1} onClick={() => select(i)} onKeyDown={e => {
          let next = i;
          if (e.key === "ArrowRight") next = (i + 1) % cases.length;
          else if (e.key === "ArrowLeft") next = (i + cases.length - 1) % cases.length;
          else if (e.key === "Home") next = 0;
          else if (e.key === "End") next = cases.length - 1;
          else return;
          e.preventDefault(); select(next, true);
        }} className={styles.tab} style={{ "--tab-accent": item.accent } as CSSProperties}><span className={styles.tabNumber}>{String(i + 1).padStart(2, "0")}</span>{item.client}</button>)}
      </div>
      <div id="work-panel" role="tabpanel" tabIndex={0} aria-labelledby={`work-tab-${c.slug}`} className={styles.stage} style={{ "--project-accent": c.accent, "--project-wash": `${c.accent}26` } as CSSProperties}>
        <div className={styles.copy} key={`${c.slug}-copy`}>
          <p className={styles.category}><span />{c.category} / {c.designSystem} identity</p>
          <h3 className={styles.client}>{c.client}</h3>
          <p className={styles.headline}>{c.headline}</p>
          <p className={styles.description}>{c.blurb}</p>
          <ul className={styles.features}>{c.features.map(f => <li key={f}><span aria-hidden="true">↗</span>{f}</li>)}</ul>
          <a href={`/work/${c.slug}`} className={styles.caseLink}>Inside the project <Arrow /></a>
          <p className={styles.release}>Recorded build · Release details in the case study</p>
        </div>
        <div className={styles.visual}>
          <span className={styles.projectNumber} aria-hidden="true">{String(active + 1).padStart(2, "0")}</span>
          <div className={styles.orbit} aria-hidden="true" />
          <div className={styles.phone} key={c.slug}>
            <div className="device"><div className="device__screen"><AppVideo src={c.video} poster={c.poster} label={`${c.client} app walkthrough`} onPlay={() => trackEvent("portfolio_viewed")} /></div></div>
          </div>
          <div className={styles.palette} aria-label={`${c.designSystem} design palette`}><span>{c.designSystem}</span><div>{c.palette.map(p => <span key={p} title={p} style={{ background: p }} />)}</div></div>
        </div>
        <div className={styles.stageFooter}>
          <span className={styles.position} aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, "0")}<span> / {String(cases.length).padStart(2, "0")}</span></span>
          <span className={styles.watchNote}>Walkthrough plays automatically · Sound off</span>
          <div className={styles.arrows}><button type="button" onClick={() => select((active + cases.length - 1) % cases.length)} aria-label="Previous project"><span aria-hidden="true">←</span></button><button type="button" onClick={() => select((active + 1) % cases.length)} aria-label="Next project"><span aria-hidden="true">→</span></button></div>
        </div>
      </div>
    </div>
  </section>;
}
