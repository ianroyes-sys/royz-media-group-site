import { site } from "@/config/site";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className="shell">
        <div className={styles.invitation}>
          <div><p className={styles.eyebrow}>Big ideas deserve a home.</p><h2>Let’s put yours<br /><em>in their hands.</em></h2></div>
          <a className={styles.start} href="/#book"><span>Start a conversation</span><span className={styles.arrow} aria-hidden>↗</span></a>
        </div>
        <div className={styles.details}>
          <p className={styles.description}>{site.name} builds App Store–ready iOS apps for communities, businesses, and brands with something to say.</p>
          <nav aria-label="Footer navigation"><span className={styles.eyebrow}>Explore</span><div className={styles.linkGrid}>{[
            { href: "/work", label: "The work" }, { href: "/solutions", label: "Who it’s for" },
            { href: "/#preview", label: "Preview yours" }, { href: "/#pricing", label: "Pricing" },
            { href: "/#process", label: "Our process" }, { href: "/privacy", label: "Privacy" },
          ].map(l => <a key={l.href} href={l.href}>{l.label}<span aria-hidden>↗</span></a>)}</div></nav>
          <div className={styles.contact}><span className={styles.eyebrow}>Say hello</span><a href={`mailto:${site.email}`}>{site.email}</a>{site.social.instagram && <a href={site.social.instagram}>Instagram ↗</a>}{site.social.linkedin && <a href={site.social.linkedin}>LinkedIn ↗</a>}</div>
        </div>
        <a href="/" className={styles.wordmark} aria-label="Royz Media Group home">{Array.from("ROYZ MEDIA").map((letter, i) => <span key={i} aria-hidden>{letter === " " ? "\u00a0" : letter}</span>)}<span className={styles.registered} aria-hidden>↗</span></a>
        <div className={styles.bottom}><span>© {year} {site.name}</span><span>Independent studio. Endless possibilities.</span><a href="#main-content">Back to top ↑</a></div>
      </div>
    </footer>
  );
}
