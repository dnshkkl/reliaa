import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HeroSlideshow from "@/components/HeroSlideshow";
import Reveal from "@/components/Reveal";
import {
  getAchievementSlides,
  getCategories,
  getHeroSlides,
  getProducts,
  getProjects,
  getReviews,
  getWhyChooseImageUrl,
} from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, products, projects, heroSlides, whyChooseImageUrl, achievementSlides, reviews] =
    await Promise.all([
      getCategories(),
      getProducts(),
      getProjects(),
      getHeroSlides(),
      getWhyChooseImageUrl(),
      getAchievementSlides(),
      getReviews(),
    ]);

  const featured = [...products]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);

  // Fall back to product images when no hero slides uploaded yet
  const slideshowImages =
    heroSlides.length > 0
      ? heroSlides
      : featured.map((p) => p.images[0]).filter(Boolean).slice(0, 5);

  const latestProjects = [...projects]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 2);

  const countFor = (categoryId: string) =>
    products.filter((p) => p.categoryId === categoryId).length;

  return (
    <>
      <SiteHeader />

      <main>
        {/* ── 1. Hero Slideshow ─────────────────────────────────────────── */}
        <section className="relative h-[75vh] min-h-[480px] overflow-hidden">
          <HeroSlideshow images={slideshowImages} />
          {/* CTA buttons — bottom right only */}
          <div className="absolute bottom-6 right-6 flex flex-wrap justify-end gap-3 sm:bottom-8 sm:right-8">
            <Link
              href="/collection"
              className="rounded-full bg-white/90 px-5 py-2.5 text-sm font-medium text-ink shadow backdrop-blur-sm transition-colors hover:bg-white"
            >
              Explore the Collection
            </Link>
            <Link
              href="/projects"
              className="rounded-full border border-white/70 bg-white/10 px-5 py-2.5 text-sm text-white shadow backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              View Projects
            </Link>
          </div>
        </section>

        {/* ── 2. Why Choose Reliaa Furniture ───────────────────────────── */}
        <section className="relative overflow-hidden py-14 md:py-20">
          {/* Background: uploaded image with dark overlay, or solid warm gradient */}
          {whyChooseImageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={whyChooseImageUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-espresso/80" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-espresso via-[#3d1a06] to-ink" />
          )}

          <div className="relative mx-auto max-w-5xl px-5 md:px-6">
            {/* Heading */}
            <Reveal>
              <h2 className="text-center font-serif text-3xl text-white md:text-4xl lg:text-5xl">
                Why Choose <span className="font-bold">Reliaa Furniture?</span>
              </h2>
            </Reveal>

            {/* Points grid */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 md:gap-5">
              {[
                { title: "Trusted Since 2000", body: "Over 25 years of experience in delivering quality furniture and event solutions." },
                { title: "Wide Product Range", body: "Chairs, sofas, tables, stools, banquet furniture, and event truss — all under one roof." },
                { title: "Premium Quality", body: "Built with durable materials for long-lasting performance and elegant design." },
                { title: "Custom Solutions", body: "Furniture tailored to match your venue, event, or business requirements." },
                { title: "Competitive Pricing", body: "Factory-direct value without compromising on quality." },
                { title: "Trusted by Professionals", body: "Preferred by hotels, resorts, banquet halls, marriage lawns, restaurants, and event managers." },
                { title: "Reliable Service", body: "On-time delivery, responsive support, and customer satisfaction are our priority." },
              ].map((point, i) => (
                <Reveal key={point.title} delay={i * 60}>
                  <div className="flex items-start gap-4">
                    {/* Checkmark */}
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center">
                      <svg className="h-5 w-5 text-clay" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <p className="text-sm leading-relaxed text-white/90 md:text-base">
                      <span className="font-bold text-white">{point.title}</span>
                      {" – "}
                      {point.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Tagline */}
            <Reveal>
              <p className="mt-10 text-center text-sm font-semibold tracking-wide text-white md:mt-12 md:text-base">
                Reliaa Furniture – Quality You Can Trust. Comfort You Can Feel.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── 3. Categories ────────────────────────────────────────────── */}
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
                  {cat.imageUrl ? (
                    <Link
                      href={`/collection?category=${cat.slug}`}
                      className="group relative block h-full min-h-[180px] overflow-hidden rounded-2xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="relative flex h-full flex-col justify-end p-5 sm:p-6 md:p-8">
                        <div className="flex items-end justify-between">
                          <h3 className="font-serif text-xl text-white sm:text-2xl">
                            {cat.name}
                          </h3>
                          <span className="text-sm text-white/60">
                            {countFor(cat.id)}{" "}
                            {countFor(cat.id) === 1 ? "piece" : "pieces"}
                          </span>
                        </div>
                        {cat.description && (
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            {cat.description}
                          </p>
                        )}
                        <span className="mt-4 inline-block text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
                          Explore {cat.name} →
                        </span>
                      </div>
                    </Link>
                  ) : (
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
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. Achievements ──────────────────────────────────────────── */}
        {achievementSlides.length > 0 && (
          <section className="py-14 md:py-20">
            <div className="mx-auto max-w-6xl px-5 md:px-6">
              <Reveal>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-[0.3em] text-clay sm:text-sm">
                      Milestones
                    </span>
                    <h2 className="mt-2 font-serif text-3xl text-ink md:mt-3 md:text-4xl">
                      Our Achievements
                    </h2>
                  </div>
                </div>
              </Reveal>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-10 md:gap-5 lg:grid-cols-3">
                {achievementSlides.map((url, i) => (
                  <Reveal key={url} delay={(i % 3) * 80}>
                    <div className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-sand/60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Achievement ${i + 1}`}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 5. Client Reviews ────────────────────────────────────────── */}
        {reviews.length > 0 && (
          <section className="py-14 md:py-20">
            <div className="mx-auto max-w-6xl px-5 md:px-6">
              <Reveal>
                <div className="text-center">
                  <span className="text-xs uppercase tracking-[0.3em] text-clay sm:text-sm">
                    Testimonials
                  </span>
                  <h2 className="mt-2 font-serif text-3xl text-ink md:mt-3 md:text-4xl">
                    What Our Clients Say
                  </h2>
                </div>
              </Reveal>

              <div className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
                {reviews.map((review, i) => (
                  <Reveal key={review.id} delay={(i % 3) * 80}>
                    <div className="flex h-full flex-col rounded-2xl border border-sand/70 bg-white p-6 shadow-sm md:p-7">
                      {/* Stars */}
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <svg
                            key={s}
                            className={`h-4 w-4 ${s < review.rating ? "text-clay" : "text-sand"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      {/* Quote */}
                      <p className="mt-4 flex-1 text-sm leading-relaxed text-espresso/80">
                        &ldquo;{review.text}&rdquo;
                      </p>
                      {/* Client */}
                      <div className="mt-5 border-t border-sand/60 pt-4">
                        <p className="font-serif text-base text-ink">{review.clientName}</p>
                        {review.role && (
                          <p className="mt-0.5 text-xs text-espresso/50">{review.role}</p>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 5. Featured products ─────────────────────────────────────── */}
        {featured.length > 0 && (
          <section className={`py-14 md:py-20 ${reviews.length > 0 ? "bg-white" : ""}`}>
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
                  className="rounded-full bg-clay px-7 py-3 text-sm text-white hover:bg-espresso"
                >
                  See the Full Collection
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── 6. Projects teaser ───────────────────────────────────────── */}
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
                <Link href="/projects" className="text-sm text-espresso hover:text-clay">
                  All projects →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── 7. Story banner ──────────────────────────────────────────── */}
        <section className="bg-ink py-14 text-cream md:py-20">
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
