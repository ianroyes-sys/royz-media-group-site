# Interactive design revision

User-requested revision after the initial upgrade.

- Removed founder section/component and studio navigation; Process is now linked instead.
- Removed geographic limits from site copy, metadata, structured data and machine-readable summary. Client locations visible inside original app recordings describe those clients, not Royz's service area.
- Muted, inline, looping automatic video playback in hero, selected work and case-study pages. Videos pause offscreen/in background, preserve explicit pauses, and respect reduced-motion preferences. Browser-rejected autoplay exposes native controls.
- Oversized editorial hero, three dimensional app screens, pointer-responsive perspective, scroll-linked opening composition, orbit lines, depth-effects pause control, scroll progress and entrance motion.
- Redesigned project gallery with accented atmospheric stages, giant project numbering, animated switches, keyboard tabs and previous/next controls.
- Existing custom app preview, pricing, calendar, routes, backend delivery and safeguards retained.

## Reference

Public Instagram carousel inspected in an isolated browser:
https://www.instagram.com/p/DdSvdLuEaC2/

@danielsnows' FigmaForMotion carousel shows oversized type behind sculptural focal objects, atmospheric depth, and high-contrast compositions (including a red portal, fiery bird and metallic bee). These informed an original product-led composition using Royz's actual recordings; no paid templates or third-party visual assets copied.

Reviewed GSAP ScrollTrigger and matchMedia documentation and the Codrops tutorials index while researching implementation. This implementation uses native IntersectionObserver, requestAnimationFrame, Web Animations and CSS transforms/scroll timelines, without a new animation dependency or scroll hijacking.

## Verification

Production build and typecheck passed. All 15 backend tests passed. Browser smoke checks passed on six routes at 320/390/768/1440 widths; keyboard menu/tabs, custom 404 and no runtime errors verified. Desktop/mobile screenshots are in docs/verification/motion-*.png.

The earlier Lighthouse numbers in UPGRADE-2026-09-21.md describe the previous manual-play version and do not measure this autoplay revision. Lead delivery still requires the previously documented Supabase/Resend activation. Deployment remains a Vercel preview, not production.

Final autoplay browser checks passed at desktop 1440 and mobile 390: all three hero videos play concurrently; actual pointer pause/resume controls work; portfolio switching starts the selected walkthrough; case-study videos autoplay; offscreen pause/resume and sticky explicit pause work; reduced-motion playback remains manual. Phone layers were flattened to correct transformed hit areas while preserving visual depth.
