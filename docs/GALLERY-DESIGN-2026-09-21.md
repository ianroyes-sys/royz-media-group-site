# Gallery-inspired design pass

## Research

Inspected the screenshot's nine gallery URLs. Eight rendered in an isolated browser; Saaspo returned Cloudflare's challenge in-browser, while its publicly indexed page could be read with the web tool. No login, subscriptions, paid assets, or third-party templates were used.

- https://www.a1.gallery/website/control-2026 — strong typographic hierarchy and varied compositions; carried into the change of pace between dark product scenes and light process section.
- https://bentogrids.com/ — reviewed Chroma's exploded layers, Novu's notification cards, and Sync's varied branding tiles. Informed original interactive Royz capabilities tiles.
- https://novu.co/inbox/ — looked more closely at embedded product demonstrations; informed a locally simulated notification interaction.
- https://supahero.io/hero/anubi and https://supahero.io/hero/better-stack — sculptural focal objects and atmospheric depth. Informed the user-controlled phone showroom with lighting and arrangement controls.
- https://www.navbar.gallery/navbar/clonix — full-screen navigation references; informed the floating navigation and mobile menu.
- https://unsection.com/ — modular section pacing and contrast; informed a distinct editorial process section.
- https://www.footer.design/ and https://www.footer.design/sites/the-design-society — monumental type and an expressive page ending; informed the blue Royz footer.
- https://404s.design/ — intentional error-page compositions; informed a branded orbital 404 with navigation.
- https://posts.design/ — graphic scale, product-centered artwork, and concentrated color. Informed the brand identity tile and color-blocked composition.
- https://saaspo.com/ — directory text reviewed; challenge blocked visual inspection. No visual conclusions attributed to it.

Agent-reach Jina backend also attempted Bento Grids, but its image-led content returned little text. Isolated browser screenshots provided the visual evidence. Gallery assets were studied, not copied into the project.

## Direction and implementation

Palette: midnight #0b0c0e, royal #2e52ff, slate #1a1d24, chalk #e4e8ef, periwinkle #96a8ff. Existing Arimo/Helvetica body and display retained for brand consistency; editorial Georgia italic used sparingly in the closing invitation and 404; system mono for compact labels.

The signature is a studio visitors can operate: spread/straight phone arrangements, cobalt/silver/violet studio lighting, brand palette changes, example notification trigger/reset, and watch/listen/connect content samples. Controls have real local state, with no implied external notification or live data. Existing app preview, booking, pricing and backend behavior remain intact.

Also implemented floating navigation, accessible full-screen mobile menu, irregular capabilities bento, expandable light-background process timeline, oversized blue footer, and illustrated 404. No new dependencies.

## Verification

- Production build and TypeScript pass.
- scripts/verify-design.cjs: new controls and no overflow at 320/390/768/1440 widths; no runtime errors.
- scripts/verify-autoplay.cjs: three-phone hero autoplay, pointer pause/resume, portfolio switches, case-study autoplay, offscreen/background policy, explicit pause preservation, reduced-motion manual playback.
- scripts/verify-site.cjs: six routes, four viewport widths, keyboard menu/tabs, deferred calendar, custom 404.
- Separate mobile navigation check: focus enters Close, Tab/Shift+Tab wrap, Escape restores focus and scroll, background inert restored.
- Desktop/mobile screenshots visually inspected and saved under docs/verification/gallery-pass.

This pass does not activate the previously unavailable database/email delivery. Publish as a preview; production activation is separate. Earlier Lighthouse scores describe earlier versions, not this revision.
