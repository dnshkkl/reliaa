import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CollectionGallery from "@/components/CollectionGallery";
import { getCategories, getProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [{ category }, categories, products] = await Promise.all([
    searchParams,
    getCategories(),
    getProducts(),
  ]);

  const initialCategory =
    category && categories.some((c) => c.slug === category) ? category : "all";

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-12 max-w-2xl">
          <span className="text-sm uppercase tracking-[0.3em] text-clay">
            The Collection
          </span>
          <h1 className="mt-4 font-serif text-5xl text-ink">
            Explore our furniture
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-espresso/80">
            Browse the full range of pieces in our showroom. Select a category
            to narrow your view, and tap any piece to see it up close.
          </p>
        </header>

        <CollectionGallery
          categories={categories}
          products={products}
          initialCategory={initialCategory}
        />
      </main>

      <SiteFooter />
    </>
  );
}
