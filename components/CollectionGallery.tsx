"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Category, Product } from "@/lib/types";

export default function CollectionGallery({
  categories,
  products,
  initialCategory = "all",
}: {
  categories: Category[];
  products: Product[];
  initialCategory?: string;
}) {
  const [active, setActive] = useState(initialCategory);

  const filtered = useMemo(() => {
    if (active === "all") return products;
    const cat = categories.find((c) => c.slug === active);
    if (!cat) return products;
    return products.filter((p) => p.categoryId === cat.id);
  }, [active, products, categories]);

  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? "";

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <FilterChip
          label="All"
          active={active === "all"}
          onClick={() => setActive("all")}
        />
        {categories.map((c) => (
          <FilterChip
            key={c.id}
            label={c.name}
            active={active === c.slug}
            onClick={() => setActive(c.slug)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-espresso/60">
          No pieces in this category yet. Please check back soon.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="group overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-sand/60 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {p.images.length > 1 && (
                  <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-2 py-0.5 text-xs text-cream">
                    {p.images.length} photos
                  </span>
                )}
              </div>
              <div className="p-5">
                <span className="text-xs uppercase tracking-widest text-clay">
                  {categoryName(p.categoryId)}
                </span>
                <h3 className="mt-1 font-serif text-xl text-ink">{p.name}</h3>
                {p.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-espresso/70">
                    {p.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-5 py-2 text-sm transition-colors ${
        active
          ? "bg-ink text-cream"
          : "bg-white text-espresso ring-1 ring-sand hover:bg-sand/40"
      }`}
    >
      {label}
    </button>
  );
}
