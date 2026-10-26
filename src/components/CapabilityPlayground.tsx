"use client";
import { useState, type CSSProperties } from "react";
import { Mark } from "./Logo";
import styles from "./CapabilityPlayground.module.css";
const palettes = [{name:"Cobalt",color:"#2e52ff",paper:"#e0e6ff"},{name:"Coral",color:"#bd4329",paper:"#ffe1d6"},{name:"Forest",color:"#146652",paper:"#d4ede1"}];
export function CapabilityPlayground() {
  const [palette,setPalette]=useState(0);
  const [notice,setNotice]=useState(false);
  const [content,setContent]=useState("Watch");
  const p=palettes[palette];
  return <section id="capabilities" className={`${styles.section} section-space`}>
    <div className="shell">
      <div className={styles.heading}><div><p className="eyebrow">The details make the difference</p><h2>Looks like you.<br /><span>Works for them.</span></h2></div><p>Good design invites you in. Great functionality gives you a reason to stay.<br /><span>Go ahead. Try a few things.</span></p></div>
      <div className={styles.grid}>
        <article className={`${styles.tile} ${styles.identity}`} style={{"--identity":p.color,"--paper":p.paper} as CSSProperties}>
          <div className={styles.tileTop}><span>YOUR IDENTITY</span><span>↗</span></div>
          <div className={styles.brandScene} aria-hidden="true"><div className={styles.brandSheet}><span>Made for<br />your people.</span><span>YOUR BRAND / YOUR WORLD</span></div><div className={styles.brandIcon}><Mark leg={p.paper} /></div><div className={styles.brandChip}>Aa<span>Every detail,<br />deliberate.</span></div></div>
          <div className={styles.identityBottom}><div><h3>Unmistakably yours.</h3><p>A distinct palette, type system, and feel.</p></div><div className={styles.swatches} role="group" aria-label="Example brand palette">{palettes.map((c,i)=><button key={c.name} type="button" aria-label={`${c.name} palette`} aria-pressed={palette===i} onClick={()=>setPalette(i)} style={{background:c.color}}><span>{palette===i?"✓":""}</span></button>)}</div></div>
        </article>
        <article className={`${styles.tile} ${styles.notification}`}>
          <div className={styles.tileTop}><span>STAY CONNECTED</span><span>↗</span></div>
          <div className={styles.notificationScene}><div className={styles.bell} aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M10 33h28l-4-7V19a10 10 0 0 0-20 0v7l-4 7Z" stroke="currentColor" strokeWidth="2"/><path d="M20 39h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></div><div className={styles.message} data-visible={notice} aria-live="polite">{notice?<><span className={styles.messageIcon}>R</span><div><strong>Your community is calling.</strong><p>A new session is ready to watch.</p><small>Example notification · Just now</small></div></>:<span className={styles.messageEmpty}>A little nudge. A closer connection.</span>}</div></div>
          <h3>A reason to come back.</h3><p>Notifications that bring your people to the moments that matter.</p><button className={styles.tryButton} type="button" onClick={()=>setNotice(!notice)}>{notice?"Reset demo":"Try a notification"}<span aria-hidden>{notice?"↺":"↗"}</span></button>
        </article>
        <article className={`${styles.tile} ${styles.native}`}>
          <div className={styles.tileTop}><span>MADE FOR iOS</span><span>↗</span></div>
          <div className={styles.layerScene} aria-hidden="true"><div /><div /><div><Mark /></div></div>
          <h3>Native feels different.</h3><p>SwiftUI apps with the gestures, responsiveness, and polish people expect on iPhone.</p>
        </article>
        <article className={`${styles.tile} ${styles.content}`}>
          <div className={styles.tileTop}><span>ONE HOME FOR YOUR WORLD</span><span>↗</span></div>
          <div className={styles.contentDemo}><div role="group" aria-label="Example app content" className={styles.contentTabs}>{["Watch","Listen","Connect"].map(t=><button type="button" key={t} aria-pressed={content===t} onClick={()=>setContent(t)}>{t}</button>)}</div><div className={styles.contentArt} data-kind={content} aria-hidden="true">{content==="Watch"?<><div className={styles.play}>▶</div><span>Stories worth staying for.</span></>:content==="Listen"?<><div className={styles.wave}>{[24,42,65,35,80,55,92,45,70,32,55,20].map((h,i)=><i key={i} style={{height:h}} />)}</div><span>Take your world with you.</span></>:<><div className={styles.community}><b>You</b><b>Us</b><b>All</b></div><span>Find your people.</span></>}</div></div>
          <h3>Everything, together.</h3><p>Content, bookings, community, and accounts—connected around the way you work.</p>
        </article>
        <article className={`${styles.tile} ${styles.ownership}`}>
          <div className={styles.tileTop}><span>FROM LAUNCH. ONWARD.</span><span>↗</span></div>
          <div className={styles.ownershipArt} aria-hidden="true"><span>100<span>%</span></span><p>YOURS.</p></div>
          <h3>Your app. Your keys.</h3><p>Designs, code, and accounts in your name. Submission support to get started. Optional care to keep moving.</p><a className={styles.tryButton} href="#process">See how we build <span aria-hidden>↗</span></a>
        </article>
      </div>
      <p className={styles.caption}>Interactive examples above. Your app’s features are defined together in your written scope.</p>
    </div>
  </section>;
}
