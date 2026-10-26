"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_CONCEPT, PREVIEW_FEATURES, clearPreviewConcept, conceptFromSearch, conceptUrl, readPreviewConcept, savePreviewConcept, type PreviewConcept } from "@/lib/preview";
import { Arrow } from "./Hero";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

type Industry = {
  id: string;
  label: string;
  tagline: string;
  cta: string;
  eyebrow: string;
  tabs: string[];
  cards: { kicker: string; title: string }[];
  listTitle: string;
  list: string[];
  defaultAccent: string;
};

const INDUSTRIES: Industry[] = [
  {
    id: "church",
    label: "Church",
    eyebrow: "WELCOME HOME",
    tagline: "Sunday, and the six days after it.",
    cta: "Plan your visit",
    tabs: ["Home", "Watch", "Groups", "Give"],
    cards: [
      { kicker: "THIS SUNDAY", title: "Two services · 9 & 11 AM" },
      { kicker: "LATEST MESSAGE", title: "The Wall Is About to Fall" },
    ],
    listTitle: "GET CONNECTED",
    list: ["Life Groups near you", "Serve on a team", "Give online"],
    defaultAccent: "#34D3DC",
  },
  {
    id: "clinic",
    label: "Clinic",
    eyebrow: "PATIENT PORTAL",
    tagline: "Care that starts before the waiting room.",
    cta: "Book an appointment",
    tabs: ["Home", "Book", "Care", "Chat"],
    cards: [
      { kicker: "NEXT OPENING", title: "Tomorrow · 8:40 AM" },
      { kicker: "YOUR CARE TEAM", title: "Meet the practice" },
    ],
    listTitle: "YOUR CARE",
    list: ["Upcoming appointments", "Forms & paperwork", "Message the practice"],
    defaultAccent: "#2E52FF",
  },
  {
    id: "coach",
    label: "Coach",
    eyebrow: "WORK WITH ME",
    tagline: "The work starts on the call.",
    cta: "Book a free call",
    tabs: ["Home", "Book", "Media", "About"],
    cards: [
      { kicker: "DISCOVERY CALL", title: "15 minutes · Free" },
      { kicker: "TRANSPARENT PRICING", title: "Rates & fees" },
    ],
    listTitle: "WAYS TO WORK",
    list: ["1:1 coaching", "Speaking & seminars", "Team workshops"],
    defaultAccent: "#C9A227",
  },
  {
    id: "brand",
    label: "Personal brand",
    eyebrow: "THE ARCHIVE",
    tagline: "Everything you make, in one place.",
    cta: "Step inside",
    tabs: ["Home", "Films", "Shop", "About"],
    cards: [
      { kicker: "NEW DROP", title: "The Spring Collection" },
      { kicker: "LATEST FILM", title: "Can't Kill the South" },
    ],
    listTitle: "THE ARCHIVE",
    list: ["Films & episodes", "Behind the scenes", "Join the list"],
    defaultAccent: "#E6187C",
  },
];

const SWATCHES = [
  "#2E52FF",
  "#34D3DC",
  "#E11D2E",
  "#E6187C",
  "#C9A227",
  "#0F5741",
  "#E8C766",
  "#8B5CF6",
];

const LAYOUTS = [
  { id: "community", label: "Community", description: "A welcoming home, events and stories." },
  { id: "editorial", label: "Editorial", description: "A bold cover and a curated content feed." },
  { id: "dashboard", label: "Dashboard", description: "Quick actions and an organized member hub." },
] as const;

function track(name: AnalyticsEvent, concept: PreviewConcept) {
  trackEvent(name);
  window.dispatchEvent(new CustomEvent("rmg:analytics", { detail: { name, industry: concept.industry, layout: concept.layout, featureCount: concept.features.length } }));
}

export function Previewer() {
  const [concept, setConcept] = useState<PreviewConcept>(DEFAULT_CONCEPT);
  const [logo, setLogo] = useState("");
  const [notice, setNotice] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [tab, setTab] = useState("Home");
  const [action, setAction] = useState("");
  const started = useRef(false);
  const logoRequest = useRef(0);
  const industry = INDUSTRIES.find(i => i.id === concept.industry)!;

  useEffect(() => {
    const loaded = conceptFromSearch(window.location.search) || readPreviewConcept();
    if (loaded) { setConcept(loaded); savePreviewConcept(loaded); }
  }, []);

  function update(change: Partial<PreviewConcept>) {
    const next = { ...concept, ...change };
    setConcept(next);
    setShareUrl("");
    setNotice("");
    savePreviewConcept(next);
    if (!started.current) { track("preview_started", next); started.current = true; }
  }

  async function uploadLogo(file?: File) {
    const request = ++logoRequest.current;
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setNotice("Choose a PNG, JPG or WebP image under 2 MB."); return;
    }
    const temporary = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (request !== logoRequest.current) { URL.revokeObjectURL(temporary); return; }
      if (img.width > 4096 || img.height > 4096 || img.width < 1 || img.height < 1) { setNotice("Use a logo no larger than 4096 × 4096 pixels."); URL.revokeObjectURL(temporary); return; }
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, 256 / Math.max(img.width, img.height));
      canvas.width = Math.round(img.width * scale); canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      setLogo(canvas.toDataURL("image/png"));
      setNotice("Logo added for this preview. It stays on this device and is not included in saved links or inquiries.");
      URL.revokeObjectURL(temporary);
    };
    img.onerror = () => { URL.revokeObjectURL(temporary); if (request === logoRequest.current) setNotice("That image could not be opened. Try another PNG, JPG or WebP."); };
    img.src = temporary;
  }

  async function saveLink() {
    const persisted = savePreviewConcept(concept);
    const url = conceptUrl(concept);
    setShareUrl(url);
    track("preview_saved", concept);
    try { await navigator.clipboard.writeText(url); track("preview_shared", concept); setNotice(`Concept link copied.${persisted ? " Draft saved on this device for 30 days." : " Local storage is unavailable; keep this link."}`); }
    catch { setNotice("Your concept link is ready below. Select and copy it to keep or share."); }
  }

  function reset() {
    clearPreviewConcept();
    logoRequest.current++;
    setConcept(DEFAULT_CONCEPT); setLogo(""); setShareUrl(""); setTab("Home"); setAction("");
    const url = new URL(window.location.href);
    url.searchParams.delete("concept");
    window.history.replaceState(window.history.state, "", url);
    setNotice("Concept cleared from this device. Previously shared links still work for anyone who has them.");
  }

  return (
    <section id="preview" className="spotlight scroll-mt-24 py-20 md:py-28">
      <div className="shell">
        <div className="max-w-[62ch]">
          <div className="eyebrow" data-reveal>02 — Preview yours</div>
          <h2 className="h2 mt-5" data-reveal>Start with your world. Make it your own.</h2>
          <p className="lede mt-5" data-reveal>Choose a direction, try a few features, and bring your concept to our first conversation.</p>
        </div>
        <div className="sticky top-20 z-20 mt-8 flex items-center gap-3 rounded-xl border border-line bg-[#101114]/95 p-3 shadow-xl backdrop-blur lg:hidden" aria-label="Live concept summary">
          <span className="h-10 w-10 shrink-0 rounded-xl border border-white/30" style={{ background: concept.accent }} />
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{concept.name || "Your app concept"}</p><p className="text-xs text-muted">{industry.label} · {concept.layout} · {concept.features.length} features</p></div>
          <a className="text-sm font-semibold underline underline-offset-4" href="#live-concept">View</a>
        </div>
        <div className="mt-10 grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <label className="block text-sm font-semibold" htmlFor="concept-name">Your business or community name</label>
            <input id="concept-name" value={concept.name} onChange={e => update({name: e.target.value})} placeholder="Grace Community Church" maxLength={60} className="mt-3 h-14 w-full rounded-xl border border-line bg-surface px-4 text-base text-chalk outline-none focus:border-royal" />
            <fieldset className="mt-7"><legend className="text-sm font-semibold">1. Choose your industry</legend><div className="mt-3 flex flex-wrap gap-2">{INDUSTRIES.map(i => <button type="button" key={i.id} aria-pressed={concept.industry === i.id} onClick={() => { update({industry: i.id as PreviewConcept["industry"], accent: i.defaultAccent}); setTab("Home"); setAction(""); }} className={`rounded-full border px-4 py-3 text-sm ${concept.industry === i.id ? "border-royal bg-royal/20 text-chalk" : "border-line text-muted"}`}>{i.label}</button>)}</div></fieldset>
            <fieldset className="mt-7"><legend className="text-sm font-semibold">2. Set your color</legend><div className="mt-3 flex flex-wrap items-center gap-2">{SWATCHES.map(s => <button type="button" key={s} aria-label={`Use color ${s}`} aria-pressed={concept.accent.toLowerCase() === s.toLowerCase()} onClick={() => update({accent:s})} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30" style={{background:s}}>{concept.accent.toLowerCase() === s.toLowerCase() && <span className="rounded-full bg-black/80 px-1 text-white" aria-hidden>✓</span>}</button>)}<label className="flex items-center gap-2 text-xs text-muted">Custom<input aria-label="Custom brand color" type="color" value={concept.accent} onChange={e => update({accent:e.target.value})} className="h-11 w-11 cursor-pointer rounded" /></label></div></fieldset>
            <div className="mt-7"><label htmlFor="concept-logo" className="block text-sm font-semibold">Add your logo <span className="font-normal text-muted">(optional)</span></label><input id="concept-logo" type="file" accept="image/png,image/jpeg,image/webp" onChange={e => { void uploadLogo(e.target.files?.[0]); e.target.value = ""; }} className="mt-3 w-full min-w-0 text-sm text-muted file:mr-3 file:rounded-lg file:border file:border-line file:bg-surface file:px-3 file:py-3 file:text-chalk" /><p className="mt-2 text-xs leading-relaxed text-muted">PNG, JPG or WebP, up to 2 MB. Logo stays in this browser tab; it is not uploaded or included in shared links.</p>{logo && <button type="button" onClick={() => { logoRequest.current++; setLogo(""); }} className="mt-2 text-sm underline">Remove logo</button>}</div>
            <fieldset className="mt-7"><legend className="text-sm font-semibold">3. Pick a layout</legend><div className="mt-3 grid gap-2">{LAYOUTS.map(l => <button type="button" key={l.id} aria-pressed={concept.layout === l.id} onClick={() => update({layout:l.id})} className={`rounded-xl border p-4 text-left ${concept.layout === l.id ? "border-royal bg-royal/10" : "border-line bg-surface"}`}><span className="block text-sm font-semibold">{l.label}</span><span className="mt-1 block text-xs text-muted">{l.description}</span></button>)}</div></fieldset>
            <fieldset className="mt-7"><legend className="text-sm font-semibold">4. Select features to discuss</legend><div className="mt-3 grid grid-cols-2 gap-2">{PREVIEW_FEATURES.map(f => <label key={f} className="flex cursor-pointer items-center gap-2 rounded-xl border border-line p-3 text-sm"><input type="checkbox" checked={concept.features.includes(f)} onChange={e => update({features:e.target.checked ? [...concept.features,f] : concept.features.filter(v => v !== f)})} className="h-4 w-4 accent-[#2e52ff]" />{f}</label>)}</div></fieldset>
            <div className="mt-7 flex flex-wrap gap-3"><button type="button" className="btn btn--ghost" onClick={() => void saveLink()}>Save / share concept</button><a href="#book" className="btn btn--primary" onClick={() => { savePreviewConcept(concept); track("preview_booking", concept); }}>Discuss this app <Arrow /></a></div>
            <p className="mt-3 text-xs leading-relaxed text-muted">Draft settings save on this device for 30 days. Shared links include the name you enter, layout, color and features. You can request an emailed copy with your inquiry.</p><button type="button" onClick={reset} className="mt-3 min-h-11 text-xs text-muted underline underline-offset-4">Reset and clear saved draft</button>
            <p role="status" className="mt-3 text-sm leading-relaxed text-chalk">{notice}</p>
            {shareUrl && <label className="mt-3 block text-sm">Your concept link<input aria-label="Saved concept link" readOnly value={shareUrl} onFocus={e => e.target.select()} className="mt-2 w-full rounded-lg border border-line bg-surface p-3 text-xs" /></label>}
          </div>
          <div id="live-concept" className="scroll-mt-44 lg:sticky lg:top-28">
            <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.15em] text-muted">Illustrative concept · Try the buttons</p>
            <div className="mx-auto w-[280px] max-w-full"><div className="device"><div className="device__screen"><MockApp concept={concept} industry={industry} logo={logo} tab={tab} setTab={t => {setTab(t);setAction("");}} action={action} setAction={setAction} /></div><div className="device__glare" /></div></div>
            <p className="mx-auto mt-7 max-w-sm text-center text-sm leading-relaxed text-muted">Sample content and interactions only. Your final design, integrations and feature scope are agreed together before a build.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MockApp({ concept, industry, logo, tab, setTab, action, setAction }: {concept:PreviewConcept;industry:Industry;logo:string;tab:string;setTab:(tab:string)=>void;action:string;setAction:(action:string)=>void}) {
  const accent = concept.accent;
  return <div className="flex h-full flex-col bg-[#0B0C0E] text-white">
    <div className="flex justify-between px-5 py-3 text-[9px] text-white/70"><span>9:41</span><span>CONCEPT</span></div>
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      {tab === "Home" ? <>
        <div className={`px-4 ${concept.layout === "editorial" ? "flex min-h-[230px] flex-col justify-end pb-5 pt-6" : "pb-4 pt-4"}`} style={{background: concept.layout === "dashboard" ? "#181b22" : `linear-gradient(155deg, ${accent}66, #0B0C0E)`}}>
          {logo && <img src={logo} alt="Your uploaded logo" width={36} height={36} className="mb-3 h-9 w-9 rounded-lg bg-white/10 object-contain" />}
          <p className="text-[8px] font-bold tracking-widest text-white/80">{industry.eyebrow}</p>
          <p className={`mt-2 break-words font-semibold leading-tight ${concept.layout === "editorial" ? "font-serif text-[29px]" : "text-[22px]"}`}>{concept.name || "Your Name Here"}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-white/80">{industry.tagline}</p>
          {concept.layout !== "dashboard" && <button type="button" onClick={() => setAction(`${industry.cta}: in your finished app, this can connect to your chosen booking or content service.`)} className="mt-4 min-h-11 rounded-full bg-white px-4 py-2 text-[11px] font-semibold text-black">{industry.cta} →</button>}
        </div>
        <div className="space-y-3 px-4 py-3">
          {concept.layout === "dashboard" && <div className="grid grid-cols-2 gap-2">{industry.list.map((row,i) => <button type="button" key={row} onClick={() => setAction(`${row}: sample member shortcut. The finished app will show your real content.`)} className="min-h-20 rounded-xl border border-white/15 p-3 text-left text-[10px]" style={{background:`${accent}20`}}><span className="mb-2 block text-base">{["↗","◷","＋"][i]}</span>{row}</button>)}</div>}
          <div className={concept.layout === "editorial" ? "divide-y divide-white/15" : "space-y-2"}>{industry.cards.map((c,i) => <button type="button" key={c.kicker} onClick={() => setAction(`${c.title}: this is sample content. Your app will use your own stories and information.`)} className={`block w-full p-3 text-left ${concept.layout === "editorial" ? "flex gap-3 py-4" : "rounded-xl border border-white/15 bg-white/5"}`}>{concept.layout === "editorial" && <span className="font-serif text-2xl text-white/50">0{i+1}</span>}<span><span className="block text-[8px] font-semibold tracking-wider text-white/65">{c.kicker}</span><span className="mt-1 block text-[12px] font-medium">{c.title}</span></span></button>)}</div>
          {concept.features.length > 0 && <div><p className="mb-2 text-[8px] font-semibold tracking-widest text-white/65">YOUR FEATURES</p><div className="flex flex-wrap gap-1">{concept.features.map(f => <button type="button" key={f} onClick={() => setAction(`${f}: added to your concept. We will confirm the right integration and scope together.`)} className="min-h-9 rounded-lg border border-white/20 px-2 text-[9px]">{f}</button>)}</div></div>}
        </div>
      </> : <div className="p-4"><p className="text-[9px] uppercase tracking-widest text-white/60">Sample {tab} screen</p><h3 className="mt-3 text-2xl font-semibold">{tab === industry.tabs[1] ? industry.cards[0].title : tab}</h3><p className="mt-3 text-xs leading-relaxed text-white/75">A dedicated space for your {tab.toLowerCase()} experience. Your content and connected services will bring it to life.</p><div className="mt-5 space-y-2">{industry.list.map(item => <button type="button" key={item} onClick={() => setAction(`${item}: sample action selected. No booking, payment or message has been sent.`)} className="block min-h-12 w-full rounded-lg border border-white/15 bg-white/5 p-3 text-left text-xs">{item} →</button>)}</div><button type="button" onClick={() => setTab("Home")} className="mt-5 min-h-11 text-xs underline">Return home</button></div>}
      {action && <div className="mx-4 mb-4 rounded-xl border border-white/25 bg-[#202838] p-3"><p role="status" className="text-[11px] leading-relaxed">{action}</p><button type="button" onClick={() => setAction("")} className="mt-2 min-h-9 text-[11px] underline">Dismiss</button></div>}
    </div>
    <div className="grid grid-cols-4 border-t border-white/15 bg-black/70 px-1 pb-3 pt-1">{industry.tabs.map(t => <button type="button" key={t} onClick={() => setTab(t)} aria-pressed={tab === t} className={`min-h-11 rounded-lg text-[10px] font-medium ${tab === t ? "bg-white/15 text-white" : "text-white/60"}`}>{t}</button>)}</div>
  </div>;
}
