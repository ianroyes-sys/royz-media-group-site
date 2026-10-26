import type { Metadata, Viewport } from "next";
import { Arimo } from "next/font/google";
import { site } from "@/config/site";
import "./globals.css";
import { Analytics } from "@/components/Analytics";

/**
 * The brand font is Helvetica Neue, which Apple devices already have — and
 * that's most of this audience. Arimo is metrically compatible and self-hosted,
 * so Windows and Android get the same layout instead of falling back to Arial.
 */
const grotesk = Arimo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

const description =
  "Royz Media Group builds App Store–ready iOS apps for churches, clinics, coaches, and personal brands. Custom-designed, shipped in weeks. Book a free 15-minute consultation.";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  alternates: {
    canonical: "/",
  },
  title: {
    default: `${site.name} — Custom iOS apps for your community and brand`,
    template: `%s · ${site.name}`,
  },
  description,
  keywords: [
    "iOS app development",
    "church app",
    "custom app design",
    "app for coaches",
    "App Store submission",
  ],
  openGraph: {
    title: `${site.name} — Your community. Your brand. Your own app.`,
    description,
    url: `https://${site.domain}`,
    siteName: site.name,
    type: "website",
    locale: "en_US",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Royz Media Group — custom iOS apps" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
    title: `${site.name}`,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0C0E",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={grotesk.variable} data-analytics={process.env.RMG_SUPABASE_URL && process.env.RMG_SUPABASE_SERVICE_ROLE_KEY && process.env.RMG_RATE_LIMIT_SECRET ? "enabled" : "disabled"}>
      <body><a href="#main-content" className="skip-link">Skip to content</a>{children}<Analytics /></body>
    </html>
  );
}
