import { pricing, pricingNotes, site } from "@/config/site";

export const dynamic = "force-static";

export function GET() {
  const offers = pricing
    .map(
      (offer) => `## ${offer.name}

- Build price: ${offer.price} ${offer.priceNote}
- Ongoing upkeep: ${offer.retainer}
- Summary: ${offer.body}
- Includes:
${offer.includes.map((item) => `  - ${item}`).join("\n")}`,
    )
    .join("\n\n");

  const body = `# Pricing — ${site.name}

Last updated: 2026-09-21

${offers}

## Commercial terms

${pricingNotes.map((note) => `- ${note}`).join("\n")}

## Contact

- Book: https://cal.com/${site.calLink}
- Website: https://${site.domain}/#book
`;

  return new Response(body, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
