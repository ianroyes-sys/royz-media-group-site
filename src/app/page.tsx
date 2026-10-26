import { inquiryConfigurationReady } from "@/lib/server/readiness";
import { Booking } from "@/components/Booking";
import { FAQ } from "@/components/FAQ";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Previewer } from "@/components/Previewer";
import { Reveal } from "@/components/Reveal";
import { Capabilities, Process, Proof } from "@/components/Sections";
import { Work } from "@/components/Work";
import { cases, faqs, pricing, site } from "@/config/site";

/** Rich results for the FAQ + the business itself. */
function StructuredData() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: site.name,
      description:
        "Custom iOS app design and development for churches, clinics, coaches, and personal brands.",
      url: `https://${site.domain}`,
      email: site.email,
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: "1500",
        offerCount: pricing.length,
      },
      makesOffer: cases.map((c) => ({
        "@type": "Offer",
        itemOffered: { "@type": "SoftwareApplication", name: `${c.client} app` },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function Page() {
  return (
    <>
      <StructuredData />
      <Reveal />
      <Nav />
      <main id="main-content">
        <Hero />
        <Proof />
        <Work />
        <Previewer />
        <Capabilities />
        <Process />
        <Pricing />
        <FAQ />
        <Booking inquiriesAvailable={inquiryConfigurationReady()} />
      </main>
      <Footer />
    </>
  );
}
