import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ImageGallery from "@/components/ImageGallery";
import { getCategories, getProduct, getProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, products] = await Promise.all([
    getProduct(id),
    getCategories(),
    getProducts(),
  ]);

  if (!product) notFound();

  const category = categories.find((c) => c.id === product.categoryId);
  const related = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 3);

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-8 md:px-6 md:py-12">
        <nav className="mb-6 text-sm text-espresso/60 md:mb-8">
          <Link href="/collection" className="hover:text-clay">
            Collection
          </Link>
          {category && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={`/collection?category=${category.slug}`}
                className="hover:text-clay"
              >
                {category.name}
              </Link>
            </>
          )}
        </nav>

        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          <ImageGallery images={product.images} alt={product.name} />

          <div className="flex flex-col justify-center">
            {category && (
              <span className="text-xs uppercase tracking-[0.3em] text-clay sm:text-sm">
                {category.name}
              </span>
            )}
            <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl md:mt-3 lg:text-5xl">
              {product.name}
            </h1>
            {product.description && (
              <p className="mt-4 whitespace-pre-line leading-relaxed text-espresso/80 md:mt-6">
                {product.description}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
              <Link
                href={`/contact?subject=${encodeURIComponent(product.name)}`}
                className="rounded-full bg-ink px-6 py-2.5 text-sm text-cream transition-colors hover:bg-espresso"
              >
                Enquire about this piece
              </Link>
              <Link
                href="/collection"
                className="rounded-full border border-ink/20 px-6 py-2.5 text-sm text-ink transition-colors hover:border-ink"
              >
                Back to collection
              </Link>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-14 md:mt-20">
            <h2 className="font-serif text-xl text-ink sm:text-2xl">You may also like</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 md:mt-6 md:gap-6 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-sand/60 transition-all hover:-translate-y-1 hover:shadow-xl"
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
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
