import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import { getProjects } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = [...(await getProjects())].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-10 md:px-6 md:py-16">
        <header className="mb-8 max-w-2xl md:mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-clay sm:text-sm">
            Projects
          </span>
          <h1 className="mt-3 font-serif text-3xl text-ink sm:text-4xl md:mt-4 md:text-5xl">
            Our pieces, in place
          </h1>
          <p className="mt-3 text-base leading-relaxed text-espresso/80 md:mt-4 md:text-lg">
            A look at Reliaa furniture styled in real homes and spaces — for a
            sense of how each piece lives in a room.
          </p>
        </header>

        {projects.length === 0 ? (
          <p className="text-espresso/60">Projects are coming soon.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:gap-8">
            {projects.map((project, i) => (
              <Reveal key={project.id} delay={(i % 2) * 100}>
                <Link
                  href={`/projects/${project.id}`}
                  className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-sand/60 transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-sand">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 md:p-6">
                    <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-clay">
                      {project.type && <span>{project.type}</span>}
                      {project.type && project.location && (
                        <span className="text-espresso/30">•</span>
                      )}
                      {project.location && <span>{project.location}</span>}
                    </div>
                    <h2 className="mt-2 font-serif text-xl text-ink sm:text-2xl">
                      {project.title}
                    </h2>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
