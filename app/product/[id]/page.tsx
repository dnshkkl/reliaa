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

      <main className="mx-auto max-w-6xl px-6 py-12">
        <nav className="mb-8 text-sm text-espresso/60">
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

        <div className="grid gap-10 md:grid-cols-2">
          <ImageGallery images={product.images} alt={product.name} />

          <div className="flex flex-col justify-center">
            {category && (
              <span className="text-sm uppercase tracking-[0.3em] text-clay">
                {category.name}
              </span>
            )}
            <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">
              {product.name}
            </h1>
            {product.description && (
              <p className="mt-6 whitespace-pre-line leading-relaxed text-espresso/80">
                {product.description}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={`/contact?subject=${encodeURIComponent(product.name)}`}
                className="rounded-full bg-ink px-7 py-3 text-sm text-cream transition-colors hover:bg-espresso"
              >
                Enquire about this piece
              </Link>
              <Link
                href="/collection"
                className="rounded-full border border-ink/20 px-7 py-3 text-sm text-ink transition-colors hover:border-ink"
              >
                Back to collection
              </Link>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-serif text-2xl text-ink">You may also like</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                  <div className="p-5">
                    <h3 className="font-serif text-xl text-ink">{p.name}</h3>
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
