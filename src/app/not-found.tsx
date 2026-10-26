import Link from "next/link";
import { ContentPage } from "@/components/ContentPage";
import styles from "./not-found.module.css";

export default function NotFound() {
  return <ContentPage><section className={`shell ${styles.page}`}>
    <p className="eyebrow">404 / Outside the frame</p>
    <div className={styles.code} aria-hidden><span>4</span><span className={styles.orbit}><span className={styles.planet} /><span className={styles.satellite} /></span><span>4</span></div>
    <h1>Good ideas get lost.<br /><em>You don’t have to.</em></h1>
    <p className={styles.description}>This page has moved, or never quite made it to launch.<br className="hidden sm:block" /> There’s plenty worth exploring from here.</p>
    <div className={styles.actions}><Link href="/" className="btn btn--primary">Back to home <span aria-hidden>↗</span></Link><Link href="/work" className="btn btn--ghost">Explore the work</Link></div>
  </section></ContentPage>;
}
