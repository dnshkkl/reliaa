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

      <main className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-12 max-w-2xl">
          <span className="text-sm uppercase tracking-[0.3em] text-clay">
            Projects
          </span>
          <h1 className="mt-4 font-serif text-5xl text-ink">
            Our pieces, in place
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-espresso/80">
            A look at Reliaa furniture styled in real homes and spaces — for a
            sense of how each piece lives in a room.
          </p>
        </header>

        {projects.length === 0 ? (
          <p className="text-espresso/60">Projects are coming soon.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
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
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-clay">
                      {project.type && <span>{project.type}</span>}
                      {project.type && project.location && (
                        <span className="text-espresso/30">•</span>
                      )}
                      {project.location && <span>{project.location}</span>}
                    </div>
                    <h2 className="mt-2 font-serif text-2xl text-ink">
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
