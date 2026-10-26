import { cases } from "./site";

export type ProjectEvidence = {
  /** Add only after checking that this listing belongs to the project. */
  appStoreUrl?: string;
  testimonial?: {
    quote: string;
    name: string;
    role: string;
    /** The client has explicitly approved public use of this quote and attribution. */
    approved: true;
  };
  outcomes?: {
    label: string;
    value: string;
    period: string;
    /** A specific measurement source, e.g. client analytics report and date. */
    source: string;
    verified: true;
  }[];
};

/** Evidence is intentionally absent until supplied and verified; do not add placeholders. */
export const projectEvidence: Record<string, ProjectEvidence> = {};

export function verifiedAppStoreUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "apps.apple.com" || url.username || url.password || url.port || !/\/app\/(?:[^/]+\/)?id\d+\/?$/.test(url.pathname)) return undefined;
    url.hash = "";
    url.search = "";
    return url.toString();
  } catch { return undefined; }
}

const narratives: Record<string, { challenge: string; approach: string }> = {
  lighthouse: {
    challenge: "Make a church’s services, groups, sermons, and giving easy to find throughout the week.",
    approach: "The home screen brings the next service and community activity forward. A bright turquoise identity gives live content a clear visual priority, while dedicated paths separate watching, connecting, and giving.",
  },
  guerrier: {
    challenge: "Give a production business a place to show its work and guide interested viewers toward a consultation.",
    approach: "Lead with the footage. The red-and-black identity frames a showreel, then moves visitors into services, a categorized portfolio, and a direct inquiry path.",
  },
  lola: {
    challenge: "Organize a personal brand’s teaching, speaking, and community content into a coherent mobile experience.",
    approach: "The Bloom concept puts a six-module curriculum at the center. Progress, a guided journal, and a media library give visitors clear ways to return and continue.",
  },
  alexroyes: {
    challenge: "Make a coach’s services, rates, and booking options understandable before a discovery call.",
    approach: "A green-and-gold identity connects a cinematic introduction with clearly presented service tiers. Rates and discovery-call access sit alongside the coaching offer.",
  },
  ianroyz: {
    challenge: "Create a personal home for films and episodic work that rewards browsing beyond a single social post.",
    approach: "A video-first archive uses editorial typography, full-screen artwork, and series browsing to give each project its own space.",
  },
};

export const portfolio = cases.map((project) => {
  const evidence = projectEvidence[project.slug];
  const appStoreUrl = verifiedAppStoreUrl(evidence?.appStoreUrl);
  const testimonial = evidence?.testimonial?.approved && evidence.testimonial.quote.trim() && evidence.testimonial.name.trim() && evidence.testimonial.role.trim() ? evidence.testimonial : undefined;
  const outcomes = evidence?.outcomes?.filter(outcome => outcome.verified && outcome.value.trim() && outcome.label.trim() && outcome.period.trim() && outcome.source.trim()) ?? [];
  return {
    ...project,
    ...narratives[project.slug],
    appStoreUrl,
    testimonial,
    outcomes,
    releaseStatus: appStoreUrl ? "Public App Store listing" : "Recorded app demonstration",
    releaseNote: appStoreUrl ? "View the App Store listing for current availability and release details." : "Explore a recorded build below. A public App Store release is not confirmed on this site.",
  };
});
