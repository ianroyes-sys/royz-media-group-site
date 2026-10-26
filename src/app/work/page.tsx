import type { Metadata } from "next";
import { ContentPage, ProjectCTA } from "@/components/ContentPage";
import { ProjectCard } from "@/components/ProjectCard";
import { portfolio } from "@/config/portfolio";

export const metadata: Metadata = { title: "Selected app projects", description: "Explore Royz Media Group app designs for churches, coaches, production companies, and creators, with real recorded walkthroughs.", alternates: { canonical: "/work" }, openGraph: { title: "Selected app projects · Royz Media Group", description: "Distinct identities. Real screens. Explore the work.", url: "/work", images: ["/opengraph-image"] } };
export default function WorkPage() {
  return <ContentPage><section className="shell"><p className="eyebrow">Selected work / 01—05</p><h1 className="display mt-5 max-w-3xl text-[clamp(44px,7vw,86px)]">Different people.<br />Distinct identities.</h1><p className="lede mt-7 max-w-2xl">Explore the design decisions and recorded builds behind five app projects. Each starts with a different audience and a different reason to open the app.</p><div className="mt-12 grid gap-6 md:grid-cols-2">{portfolio.map(project => <ProjectCard key={project.slug} project={project} />)}</div></section><ProjectCTA /></ContentPage>;
}
