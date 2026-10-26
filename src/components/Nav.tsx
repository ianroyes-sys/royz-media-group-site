"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import styles from "./Nav.module.css";

const links = [
  { href: "/#work", label: "Work", section: "work" },
  { href: "/#preview", label: "Preview yours", section: "preview" },
  { href: "/solutions", label: "Who it’s for", section: "solutions" },
  { href: "/#pricing", label: "Pricing", section: "pricing" },
  { href: "/#process", label: "Process", section: "process" },
];

export function Nav() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const toggle = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const close = () => { setOpen(false); requestAnimationFrame(() => toggle.current?.focus()); };
  useEffect(() => {
    const onScroll = () => {
      setSolid(window.scrollY > 24);
      const section = links.filter(l => { const node = document.getElementById(l.section); return node && node.getBoundingClientRect().top < 180; }).at(-1);
      setActive(section?.section || "");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = Array.from(document.querySelectorAll<HTMLElement>("main, footer"));
    const previousInert = background.map(node => node.inert);
    background.forEach(node => { node.inert = true; });
    sheet.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); setOpen(false); requestAnimationFrame(() => toggle.current?.focus()); }
      if (e.key === "Tab") {
        const nodes = Array.from(sheet.current?.querySelectorAll<HTMLElement>("a, button") || []);
        const i = nodes.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); nodes.at(-1)?.focus(); }
        if (!e.shiftKey && (i === nodes.length - 1 || i === -1)) { e.preventDefault(); nodes[0]?.focus(); }
      }
    };
    const onResize = () => { if (window.innerWidth >= 1000) setOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previous;
      background.forEach((node, i) => { node.inert = previousInert[i]; });
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);
  const href = (url: string) => pathname === "/" && url.startsWith("/#") ? url.slice(1) : url;
  return (
    <header className={styles.header} data-solid={solid || pathname !== "/"}>
      <nav aria-label="Main navigation" className={styles.bar} inert={open || undefined}>
        <a href="/" title="Home" className={styles.logo}><Logo /></a>
        <div className={styles.links}>
          {links.map(l => <a key={l.href} href={href(l.href)} aria-current={active === l.section || pathname.startsWith(`/${l.section}`) ? "location" : undefined}>{l.label}</a>)}
        </div>
        <a href={href("/#book")} className={styles.cta}>Let’s talk <span aria-hidden>↗</span></a>
        <button ref={toggle} type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} aria-controls="mobile-navigation" className={styles.toggle}><span>Menu</span><span className={styles.menuIcon} aria-hidden><i /><i /></span></button>
      </nav>
      {open && <div ref={sheet} id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Navigation menu" className={styles.sheet}>
        <div className={styles.sheetTop}><Logo /><button type="button" onClick={close} aria-label="Close menu" className={styles.close}>Close <span aria-hidden>×</span></button></div>
        <p className={styles.overline}>A home for your next big idea.</p>
        <nav aria-label="Mobile navigation" className={styles.mobileLinks}>
          {links.map((l, i) => <a key={l.href} href={href(l.href)} onClick={close}><span className={styles.index}>0{i + 1}</span><span>{l.label}</span><span className={styles.linkArrow} aria-hidden>↗</span></a>)}
          <a href={href("/#book")} onClick={close} className={styles.mobileCta}>Let’s build yours <span aria-hidden>↗</span></a>
        </nav>
        <div className={styles.sheetBrand} aria-hidden>ROYZ.</div>
      </div>}
    </header>
  );
}
