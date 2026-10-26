import Link from "next/link";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function ContentPage({ children }: { children: React.ReactNode }) {
  return <><Nav /><main id="main-content" className="pt-32 pb-20 sm:pt-40 sm:pb-28">{children}</main><Footer /></>;
}

export function ProjectCTA() {
  return <section className="shell mt-20"><div className="rounded-2xl border border-line bg-surface px-6 py-10 sm:p-12"><p className="eyebrow">Your next chapter</p><h2 className="h2 mt-4 max-w-xl">Let’s make room for your idea.</h2><p className="mt-5 max-w-xl leading-relaxed text-body">Tell us who you serve and what should be easier. We’ll help define the right first version, scope, and next steps.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/#book" className="btn btn--primary">Discuss your project <span aria-hidden="true">↗</span></Link><Link href="/#preview" className="btn btn--ghost">Try an app concept</Link></div></div></section>;
}
