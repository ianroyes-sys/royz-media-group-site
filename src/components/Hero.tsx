import { HeroStage } from "./HeroStage";

export function Hero() {
  return <section id="top" className="hero-experience">
    <div className="shell hero-intro">
      <p className="eyebrow hero-kicker"><span /> Independent app design & development</p>
      <h1 className="hero-title">Your world.<br /><span>In your app.</span></h1>
      <div className="hero-aside">
        <p>Custom iOS apps for communities, creators, and businesses. Built around your identity. Made to feel unmistakably yours.</p>
        <a href="#book" className="btn btn--primary">Let’s build your app <Arrow /></a>
        <span className="hero-note">From first idea to App Store submission.</span>
      </div>
    </div>
    <HeroStage />
    <div className="shell hero-footer"><a href="#work">Scroll to explore <span aria-hidden>↓</span></a><span>Design. Development. Launch.</span><span className="hidden sm:inline">Your brand. Every detail.</span></div>
  </section>;
}

export function Arrow({ className = "" }: { className?: string }) {
  return <svg className={`btn__arrow ${className}`} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden><path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
