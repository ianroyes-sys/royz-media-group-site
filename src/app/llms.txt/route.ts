import { pricing, site } from "@/config/site";

export const dynamic = "force-static";

export function GET() {
  const offers = pricing
    .map(
      (offer) =>
        `- ${offer.name}: ${offer.price} ${offer.priceNote}; upkeep ${offer.retainer}`,
    )
    .join("\n");

  const body = `# ${site.name}

> ${site.tagline}

${site.name} designs and builds custom, App Store-ready iOS apps for churches, clinics, coaches, personal brands, and organizations. Projects include design, development, TestFlight delivery, App Store submission, and optional post-launch maintenance.

## Public offers

${offers}

## Key links

- Website: https://${site.domain}/
- Machine-readable pricing: https://${site.domain}/pricing.md
- Booking: https://cal.com/${site.calLink}
- AgentProof: https://agentproof.${site.domain}/
- Teaming Radar: https://radar.${site.domain}/
- CaptureCoach: https://capture.${site.domain}/

## Boundaries

- Pricing shown is public guidance; final scope is quoted in writing.
- Royz Media Group LLC is an independent company and is not affiliated with the U.S. government.
- Customer-sensitive, classified, CUI, export-controlled, and proprietary proposal information must not be submitted to public demos.
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
