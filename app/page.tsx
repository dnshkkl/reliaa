import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HeroSlideshow from "@/components/HeroSlideshow";
import Reveal from "@/components/Reveal";
import { getCategories, getProducts, getProjects } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, products, projects] = await Promise.all([
    getCategories(),
    getProducts(),
    getProjects(),
  ]);

  const featured = [...products]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);

  const heroImages = featured
    .map((p) => p.images[0])
    .filter(Boolean)
    .slice(0, 5);

  const latestProjects = [...projects]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 2);

  const countFor = (categoryId: string) =>
    products.filter((p) => p.categoryId === categoryId).length;

  return (
    <>
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-12 md:gap-12 md:px-6 md:py-20 lg:grid-cols-2 lg:py-28">
            <div className="animate-fade-up">
              <span className="text-xs uppercase tracking-[0.3em] text-clay sm:text-sm">
                Contemporary Furniture
              </span>
              <h1 className="mt-4 font-serif text-4xl leading-[1.05] text-ink sm:text-5xl md:text-5xl lg:text-6xl">
                Pieces that make a house feel like home.
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-espresso/80 sm:text-lg">
                Reliaa curates a collection of sofas, chairs and furniture
                designed around clean lines, natural materials and quiet
                comfort.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/collection"
                  className="rounded-full bg-ink px-6 py-2.5 text-sm text-cream transition-colors hover:bg-espresso sm:px-7 sm:py-3"
                >
                  Explore the Collection
                </Link>
                <Link
                  href="/projects"
                  className="rounded-full border border-ink/20 px-6 py-2.5 text-sm text-ink transition-colors hover:border-ink sm:px-7 sm:py-3"
                >
                  View Projects
                </Link>
              </div>
            </div>

            <div className="animate-fade-up [animation-delay:120ms]">
              <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-sand sm:aspect-[4/3] lg:aspect-[4/5] lg:rounded-[2rem]">
                <HeroSlideshow images={heroImages} />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="bg-white py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-5 md:px-6">
            <Reveal>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-clay sm:text-sm">
                    Explore
                  </span>
                  <h2 className="mt-2 font-serif text-3xl text-ink md:mt-3 md:text-4xl">
                    Our Categories
                  </h2>
                </div>
                <Link
                  href="/collection"
                  className="hidden text-sm text-espresso hover:text-clay md:block"
                >
                  View all →
                </Link>
              </div>
            </Reveal>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-12 md:gap-6 lg:grid-cols-3">
              {categories.map((cat, i) => (
                <Reveal key={cat.id} delay={i * 90}>
                  <Link
                    href={`/collection?category=${cat.slug}`}
                    className="group block h-full rounded-2xl border border-sand/70 bg-cream p-5 transition-all hover:-translate-y-1 hover:border-clay hover:shadow-lg sm:p-6 md:p-8"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-xl text-ink sm:text-2xl">
                        {cat.name}
                      </h3>
                      <span className="text-sm text-espresso/50">
                        {countFor(cat.id)}{" "}
                        {countFor(cat.id) === 1 ? "piece" : "pieces"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-espresso/70 md:mt-3">
                      {cat.description}
                    </p>
                    <span className="mt-4 inline-block text-sm text-clay opacity-0 transition-opacity group-hover:opacity-100 md:mt-6">
                      Explore {cat.name} →
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Featured */}
        {featured.length > 0 && (
          <section className="py-14 md:py-20">
            <div className="mx-auto max-w-6xl px-5 md:px-6">
              <Reveal>
                <span className="text-xs uppercase tracking-[0.3em] text-clay sm:text-sm">
                  Latest
                </span>
                <h2 className="mt-2 font-serif text-3xl text-ink md:mt-3 md:text-4xl">
                  New in the Collection
                </h2>
              </Reveal>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 md:mt-12 md:gap-6 lg:grid-cols-3">
                {featured.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 90}>
                    <Link
                      href={`/product/${p.id}`}
                      className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-sand/60 transition-all hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-sand">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4 sm:p-5">
                        <h3 className="font-serif text-lg text-ink sm:text-xl">{p.name}</h3>
                        {p.description && (
                          <p className="mt-2 line-clamp-2 text-sm text-espresso/70">
                            {p.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>

              <div className="mt-10 text-center md:mt-12">
                <Link
                  href="/collection"
                  className="rounded-full bg-ink px-7 py-3 text-sm text-cream hover:bg-espresso"
                >
                  See the Full Collection
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Projects teaser */}
        {latestProjects.length > 0 && (
          <section className="bg-white py-14 md:py-20">
            <div className="mx-auto max-w-6xl px-5 md:px-6">
              <Reveal>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-[0.3em] text-clay sm:text-sm">
                      Projects
                    </span>
                    <h2 className="mt-2 font-serif text-3xl text-ink md:mt-3 md:text-4xl">
                      Our pieces, in place
                    </h2>
                  </div>
                  <Link
                    href="/projects"
                    className="hidden text-sm text-espresso hover:text-clay md:block"
                  >
                    All projects →
                  </Link>
                </div>
              </Reveal>

              <div className="mt-8 grid gap-5 md:mt-12 md:grid-cols-2 md:gap-8">
                {latestProjects.map((project, i) => (
                  <Reveal key={project.id} delay={i * 100}>
                    <Link
                      href={`/projects/${project.id}`}
                      className="group block overflow-hidden rounded-2xl shadow-sm ring-1 ring-sand/60 transition-all hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="aspect-[16/10] overflow-hidden bg-sand">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="bg-cream p-5 md:p-6">
                        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-clay">
                          {project.type && <span>{project.type}</span>}
                          {project.type && project.location && (
                            <span className="text-espresso/30">•</span>
                          )}
                          {project.location && <span>{project.location}</span>}
                        </div>
                        <h3 className="mt-2 font-serif text-xl text-ink sm:text-2xl">
                          {project.title}
                        </h3>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>

              <div className="mt-8 text-center md:hidden">
                <Link
                  href="/projects"
                  className="text-sm text-espresso hover:text-clay"
                >
                  All projects →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Story / banner */}
        <section className="bg-espresso py-14 text-cream md:py-20">
          <div className="mx-auto max-w-4xl px-5 text-center md:px-6">
            <Reveal>
              <span className="text-xs uppercase tracking-[0.3em] text-clay sm:text-sm">
                The Reliaa Approach
              </span>
              <p className="mt-5 font-serif text-2xl leading-snug sm:text-3xl md:text-4xl">
                Every piece in our showroom is chosen for craftsmanship, comfort
                and a design that lasts well beyond trends.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-block rounded-full border border-cream/30 px-7 py-3 text-sm transition-colors hover:border-cream"
              >
                Visit Our Showroom
              </Link>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
