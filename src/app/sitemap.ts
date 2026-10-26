import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { portfolio } from "@/config/portfolio";
import { solutions } from "@/config/solutions";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/work", "/solutions", "/privacy", ...portfolio.map(p => `/work/${p.slug}`), ...solutions.map(s => `/solutions/${s.slug}`)].map(path => ({ url: `https://${site.domain}${path || "/"}`, lastModified: new Date("2026-09-21"), changeFrequency: "monthly", priority: path === "" ? 1 : path === "/privacy" ? 0.3 : 0.8 }));
}
