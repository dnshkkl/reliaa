import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CollectionGallery from "@/components/CollectionGallery";
import { getCategories, getMainCategories, getProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; main?: string }>;
}) {
  const [{ category, main }, mainCategories, allCategories, products] =
    await Promise.all([
      searchParams,
      getMainCategories(),
      getCategories(),
      getProducts(),
    ]);

  // If a main category slug is given, filter sub-categories to just that main
  const activeMain = main
    ? mainCategories.find((mc) => mc.slug === main)
    : null;

  const categories = activeMain
    ? allCategories.filter((c) => c.mainCategoryId === activeMain.id)
    : allCategories;

  const initialCategory =
    category && categories.some((c) => c.slug === category) ? category : "all";

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-10 md:px-6 md:py-16">
        <header className="mb-8 max-w-2xl md:mb-12">
          {/* Breadcrumb when filtered by main category */}
          {activeMain && (
            <nav className="mb-3 flex items-center gap-2 text-sm text-espresso/60">
              <Link href="/collection" className="hover:text-clay">
                All Categories
              </Link>
              <span>/</span>
              <span className="text-ink">{activeMain.name}</span>
            </nav>
          )}
          <span className="text-xs uppercase tracking-[0.3em] text-clay sm:text-sm">
            The Collection
          </span>
          <h1 className="mt-3 font-serif text-3xl text-ink sm:text-4xl md:mt-4 md:text-5xl">
            {activeMain ? activeMain.name : "Explore our furniture"}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-espresso/80 md:mt-4 md:text-lg">
            {activeMain?.description ||
              "Browse the full range of pieces in our showroom. Select a category to narrow your view, and tap any piece to see it up close."}
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
