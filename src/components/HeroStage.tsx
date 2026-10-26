"use client";
import { useEffect, useRef, useState } from "react";
import { cases } from "@/config/site";
import { AppVideo } from "./AppVideo";

const order = ["lighthouse", "guerrier", "alexroyes"];
export function HeroStage() {
  const ref = useRef<HTMLDivElement>(null);
  const [motion, setMotion] = useState(true);
  const [arrangement, setArrangement] = useState("Spread");
  const [light, setLight] = useState("Cobalt");
  useEffect(() => {
    const stage = ref.current;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (!stage || preference.matches || !motion) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = stage.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      stage.style.setProperty("--travel", String(progress));
    };
    const scroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const pointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || (e.target instanceof Element && e.target.closest(".showroom-phone, button, a"))) return;
      const r = stage.getBoundingClientRect();
      stage.style.setProperty("--lean", `${((e.clientX-r.left)/r.width-.5)*12}deg`);
      stage.style.setProperty("--lift", `${((e.clientY-r.top)/r.height-.5)*-7}deg`);
    };
    const reset = () => { stage.style.setProperty("--lean", "0deg"); stage.style.setProperty("--lift", "0deg"); };
    window.addEventListener("scroll", scroll, {passive:true});
    stage.addEventListener("pointermove", pointer);
    stage.addEventListener("pointerleave", reset);
    update();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", scroll); stage.removeEventListener("pointermove",pointer); stage.removeEventListener("pointerleave",reset); reset(); stage.style.setProperty("--travel","0"); };
  }, [motion]);
  return <div ref={ref} className="showroom" data-motion={motion} data-arrangement={arrangement} data-light={light}>
    <div className="showroom-grid" aria-hidden />
    <div className="showroom-word" aria-hidden>YOUR APP.</div>
    <div className="showroom-toolbar">
      <div className="showroom-layout" role="group" aria-label="Showcase arrangement">{["Spread", "Straight"].map(mode=><button type="button" key={mode} aria-pressed={arrangement===mode} onClick={()=>setArrangement(mode)}>{mode}</button>)}</div>
      <div className="showroom-lights" role="group" aria-label="Showcase lighting"><span>Studio light</span>{["Cobalt", "Silver", "Violet"].map(tone=><button key={tone} type="button" aria-label={`${tone} studio light`} aria-pressed={light===tone} onClick={()=>setLight(tone)} data-tone={tone} />)}</div>
    </div>
    <div className="showroom-orbit" aria-hidden /><div className="showroom-orbit showroom-orbit--two" aria-hidden />
    <div className="showroom-phones">
      {order.map((slug,i) => { const c=cases.find(c=>c.slug===slug)!; return <div key={slug} className={`showroom-phone showroom-phone--${i}`}>
        <div className="device"><div className="device__screen"><AppVideo src={c.video} poster={c.poster} label={`${c.client} app showcase`} controls={false} eager={i===1} /></div><div className="device__glare" /></div>
        <a href={`/work/${slug}`} className="showroom-label">{c.client}<span aria-hidden>↗</span></a>
      </div>; })}
    </div>
    <span className="showroom-index" aria-hidden>RMG / SELECTED BUILDS<br />01 — 03</span>
    <button className="showroom-motion" type="button" aria-pressed={!motion} onClick={()=>setMotion(!motion)}>{motion ? "Pause depth effects" : "Resume depth effects"}<span aria-hidden>{motion ? "Ⅱ" : "↗"}</span></button>
  </div>;
}
