/**
 * Everything Ian needs to fill in or verify lives here.
 * Anything marked TODO is a placeholder and must be real before launch.
 */

export const site = {
  name: "Royz Media Group",
  domain: "royzmediagroup.com", // live, attached via Vercel
  tagline: "Your community. Your brand. Your own app.",

  // Public Cal.com booking link, "<username>/<event-slug>".
  // Live event: https://cal.com/ian-royes-lpueeg/secret ("Consultation Meeting")
  calLink: "ian-royes-lpueeg/secret",

  // True once calLink is a REAL, published Cal.com event (verified 200 on /embed).
  // If ever false the page shows a polished email card instead of the calendar.
  calConfigured: true,

  leadEndpoint: "/api/leads",

  // Custom-domain business inbox hosted by Zoho Mail.
  email: "contact@royzmediagroup.com",
  phone: "" as string, // optional — leave empty to hide

  social: {
    instagram: "" as string, // TODO
    linkedin: "" as string, // TODO
  },
} as const;

/**
 * Claims made to prospects — keep these defensible if the portfolio changes.
 */
export const stats = [
  { value: "20+", label: "Apps designed and built" },
  { value: "6", label: "Industries served" },
  { value: "2–4 wk", label: "Concept to TestFlight" },
  { value: "100%", label: "Built custom, never templated" },
] as const;

export type AppCase = {
  slug: string;
  client: string;
  meta: string;
  category: string;
  headline: string;
  blurb: string;
  designSystem: string;
  palette: string[];
  accent: string;
  features: string[];
  video: string;
  poster: string;
};

/**
 * The five apps with real screen recordings. Videos live in /public/apps.
 */
export const cases: AppCase[] = [
  {
    slug: "lighthouse",
    client: "Lighthouse Church",
    meta: "Church & community",
    category: "Faith",
    headline: "A church app that carries itself like a broadcast network.",
    blurb:
      "A recorded church-app build that brings live services, groups, sermons, and giving into one home screen, with a turquoise identity designed around the rhythm of a church week.",
    designSystem: "Beacon",
    palette: ["#34D3DC", "#1E4FD8", "#FF6A4D", "#0B1220"],
    accent: "#34D3DC",
    features: [
      "Live service streaming with a real-time on-air state",
      "Life Groups discovery and join flow",
      "Sermon archive pulled in automatically",
      "In-app giving",
      "Push notifications for service starts",
    ],
    video: "/apps/lighthouse.mp4",
    poster: "/apps/lighthouse.webp",
  },
  {
    slug: "guerrier",
    client: "Guerrier Inc.",
    meta: "Full-service production company",
    category: "Business",
    headline: "A production company that finally looks like its own reel.",
    blurb:
      "A production-company app that leads with footage, presents services clearly, and puts consultation booking alongside a categorized portfolio.",
    designSystem: "Signal",
    palette: ["#E11D2E", "#0A0A0B", "#F4F4F5", "#7A0D17"],
    accent: "#E11D2E",
    features: [
      "Full-bleed showreel landing",
      "Services broken out with clear scope",
      "Portfolio gallery by event type",
      "Free-consultation inquiry flow",
      "Direct-contact tab",
    ],
    video: "/apps/guerrier.mp4",
    poster: "/apps/guerrier.webp",
  },
  {
    slug: "lola",
    client: "Dr. Lola Moore Johnston",
    meta: "Pastor · Speaker · Author",
    category: "Personal brand",
    headline: "A movement, not a link in a bio.",
    blurb:
      "The Bloom Movement build organizes a six-module leadership curriculum alongside progress tracking, a guided journal, speaking inquiries, and a media library.",
    designSystem: "Petal",
    palette: ["#E6187C", "#FF5A36", "#F7D9E3", "#2A0A18"],
    accent: "#E6187C",
    features: [
      "Full Bloom Framework — six modules with progress tracking",
      "Speaking-engagement booking",
      "Media library",
      "Guided journal",
      "Community entry point",
    ],
    video: "/apps/lola.mp4",
    poster: "/apps/lola.webp",
  },
  {
    slug: "alexroyes",
    client: "Alex Royes",
    meta: "Leadership coach",
    category: "Coaching",
    headline: "Clear services. Transparent rates. One place to book.",
    blurb:
      "A coaching app that presents service tiers and rates before the discovery call, with booking access and a green-and-gold visual identity.",
    designSystem: "Velour",
    palette: ["#0F5741", "#C9A227", "#F0E9DC", "#08120E"],
    accent: "#C9A227",
    features: [
      "Cinematic landing film",
      "Fully transparent rates and fees",
      "Booking calendar",
      "Free 15-minute discovery call",
      "Church-consulting service tiers",
    ],
    video: "/apps/alexroyes.mp4",
    poster: "/apps/alexroyes.webp",
  },
  {
    slug: "ianroyz",
    client: "Ian Royz",
    meta: "A personal archive",
    category: "Creative",
    headline: "A body of work, shelved like a streaming service.",
    blurb:
      "The proof that we build for taste, not just for a brief. An editorial archive of films and episodes, typeset like a title sequence and paced like one too.",
    designSystem: "Daydream",
    palette: ["#E8C766", "#0B0B0C", "#F2EAD7", "#3A2E12"],
    accent: "#E8C766",
    features: [
      "Full-screen film archive",
      "Episodic series browsing",
      "Editorial typography system",
      "Video-first landing",
    ],
    video: "/apps/ianroyz.mp4",
    poster: "/apps/ianroyz.webp",
  },
];

export const capabilities = [
  {
    title: "iOS apps",
    body: "Native SwiftUI, built for the App Store. Not a website in a wrapper, not a no-code shell you rent forever.",
  },
  {
    title: "A design language of your own",
    body: "Every app we ship gets its own palette, type system, and motion. Nothing we make looks like anything else we make.",
  },
  {
    title: "Backend and data",
    body: "Accounts, content, giving, bookings, notifications. The parts nobody sees that decide whether the app survives.",
  },
  {
    title: "App Store submission",
    body: "Screenshots, listing copy, review responses, TestFlight. We hand you a live app, not a folder of code.",
  },
  {
    title: "Websites",
    body: "The same standard applied to the thing people find first. Fast, responsive, and built to book calls.",
  },
  {
    title: "After launch",
    body: "Updates, new features, and someone who picks up the phone when the App Store changes the rules again.",
  },
] as const;

export const process = [
  {
    step: "01",
    title: "The call",
    time: "15 minutes · free",
    body: "You tell us who you serve and what's not working. We tell you honestly whether an app fixes it. Sometimes the answer is no, and we'll say so on the call.",
  },
  {
    step: "02",
    title: "The design",
    time: "Week 1",
    body: "You see real screens with your name, your photos, your colors — not wireframes, not stock. If the direction is wrong, this is the cheap moment to find out.",
  },
  {
    step: "03",
    title: "The build",
    time: "Weeks 2–3",
    body: "We build the real thing and put it on your phone through TestFlight while it's still being made. You watch it come together instead of waiting on a reveal.",
  },
  {
    step: "04",
    title: "The launch",
    time: "After testing",
    body: "We prepare the listing, screenshots, and submission, then respond to review feedback. Apple determines approval and review timing.",
  },
] as const;

/**
 * Public pricing. Decided 2026-07-25 (see vault Decisions/Decision Log.md).
 * The $1,500 founding rate is capped at five churches. Decrement `foundingRemaining`
 * on every founding close. At 0 the page hides the founding paragraph on its own;
 * then change the church tier's `price` to "$2,500" and drop its `priceNote` to
 * "flat, quoted in writing" — two edits, both in this file.
 */
export const foundingRemaining = 5;

export const pricing = [
  {
    name: "Church app",
    price: "$1,500",
    priceNote: "founding rate — first five churches, then $2,500",
    retainer: "$99/mo",
    body: "Your congregation's own app: sermons, events, giving, and announcements, designed around your church rather than dropped into a template every other church also uses.",
    includes: [
      "A design made for your church — your name, colors, photography",
      "Sermon or media feed wired to what you already publish",
      "Events, announcements, and your existing giving link",
      "App Store submission, listing, and screenshots handled",
      "Quarterly content refresh and OS-compatibility updates",
    ],
    featured: true,
  },
  {
    name: "Brand app",
    price: "$4,000",
    priceNote: "from",
    retainer: "$149/mo",
    body: "One app for one name — a coach, a pastor, a creator, a practice. Heavier on design and identity, lighter on weekly content churn.",
    includes: [
      "A named design identity, not a re-skin",
      "Your content, video, or booking flow built in",
      "Push notifications and a custom home layout",
      "App Store submission and the whole review process",
      "Monthly content changes — you ask, we make them",
    ],
    featured: false,
  },
  {
    name: "Everything app",
    price: "$7,500",
    priceNote: "from",
    retainer: "$349/mo",
    body: "The bespoke build: multiple feeds, accounts, payments, custom interactions. For when the app is the business rather than a companion to it.",
    includes: [
      "Fully custom build, not adapted from anything",
      "Accounts, payments, or multi-source content as needed",
      "Priority turnaround and quarterly design reviews",
      "Content changes within the agreed maintenance scope",
      "Developer-account administration; third-party fees separate",
    ],
    featured: false,
  },
] as const;

/** Printed under the tiers. Every line is a fact, not a promise. */
export const pricingNotes = [
  "The build fee is one time and quoted flat, in writing, before anything starts.",
  "Optional upkeep is month to month. Cancel ongoing service without giving up your code, designs, or accounts.",
  "Apple developer membership, hosting, and other third-party charges are separate. We identify them in your written scope.",
  "Your app assets and accounts remain yours. After maintenance ends, you manage updates and third-party services or appoint another provider.",
] as const;

export const faqs = [
  {
    q: "What does an app actually cost?",
    a: "It's on the page — church apps are $1,500 for the first five founding churches and $2,500 after that, brand apps start at $4,000, and full custom builds start at $7,500. Upkeep runs $99–$349/month, month to month, cancel any time. Every project is quoted flat and in writing before anything starts, so what you're told on the call is what you're invoiced. Where you land depends on how much has to work behind the screen — the free 15 minutes is where we figure out which one you're actually asking for.",
  },
  {
    q: "How long until it's in the App Store?",
    a: "Typical focused builds reach TestFlight in two to four weeks once scope and assets are ready. Complex projects take longer. App Store review and approval are controlled by Apple, so a public launch date is not guaranteed.",
  },
  {
    q: "Do I need to understand any of the technical side?",
    a: "No. You bring the photos, the words, and the opinions. We handle Apple accounts, code signing, submission, and every other piece of it you should never have to think about.",
  },
  {
    q: "What about Android?",
    a: "We start with iOS because that's where the audience for this kind of work usually is, and shipping one excellent app beats shipping two mediocre ones. Android is available as a second phase once iOS is earning its keep.",
  },
  {
    q: "Who owns the app when it's finished?",
    a: "You do. The code, the designs, the App Store listing, the accounts — all of it, in your name. We don't hold your app hostage and there's no platform fee to keep it alive.",
  },
  {
    q: "What happens after launch?",
    a: "Your call. Some clients take the keys and run. Most keep us on for updates and new features. Either way you're not stranded, and you're not locked in.",
  },
] as const;
