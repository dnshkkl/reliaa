import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ImageGallery from "@/components/ImageGallery";
import { getProject } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-5 py-8 md:px-6 md:py-12">
        <nav className="mb-6 text-sm text-espresso/60 md:mb-8">
          <Link href="/projects" className="hover:text-clay">
            Projects
          </Link>
        </nav>

        <header className="mb-7 max-w-2xl md:mb-10">
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-clay">
            {project.type && <span>{project.type}</span>}
            {project.type && project.location && (
              <span className="text-espresso/30">•</span>
            )}
            {project.location && <span>{project.location}</span>}
          </div>
          <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl md:mt-3 lg:text-5xl">
            {project.title}
          </h1>
          {project.description && (
            <p className="mt-4 whitespace-pre-line leading-relaxed text-espresso/80 md:mt-6">
              {project.description}
            </p>
          )}
        </header>

        <ImageGallery images={project.images} alt={project.title} />

        <div className="mt-10 md:mt-12">
          <Link
            href="/contact"
            className="rounded-full bg-clay px-7 py-3 text-sm text-white transition-colors hover:bg-espresso"
          >
            Talk to us about your space
          </Link>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
