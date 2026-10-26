import Image from "next/image";
import Link from "next/link";
import { portfolio } from "@/config/portfolio";

export function ProjectCard({ project }: { project: typeof portfolio[number] }) {
  return <Link href={`/work/${project.slug}`} className="group block overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-body">
    <div className="relative flex h-[330px] items-start justify-center overflow-hidden pt-8 sm:h-[400px]" style={{ background: `linear-gradient(145deg, ${project.accent}35, #101114 80%)` }}>
      <Image src={project.poster} alt={`${project.client} app home screen`} width={260} height={563} className="w-[205px] rounded-[30px] border border-white/15 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 sm:w-[245px]" />
    </div><div className="p-6 sm:p-8"><div className="flex flex-wrap items-center justify-between gap-3"><p className="eyebrow">{project.category}</p><span aria-hidden="true" className="text-xl text-chalk">↗</span></div><h2 className="mt-3 text-2xl font-semibold tracking-tight text-chalk">{project.client}</h2><p className="mt-3 leading-relaxed text-body">{project.challenge}</p><p className="mt-5 text-sm text-muted">View project & walkthrough</p></div>
  </Link>;
}
