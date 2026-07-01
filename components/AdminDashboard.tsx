"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Category, Message, Product, Project, Review } from "@/lib/types";

type Section = "products" | "projects" | "categories" | "banners" | "hero-slides" | "why-choose" | "achievements" | "reviews" | "inbox";

// ─── Icons ───────────────────────────────────────────────────────────────────

function IcBox() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
  );
}
function IcPhoto() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M4 16l4-4a3 3 0 014.24 0L16 16m-2-2l1.59-1.59a3 3 0 014.24 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
function IcTag() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M7 7h.01M7 3h5c.53 0 1.04.21 1.41.59l7 7a2 2 0 010 2.82l-7 7a2 2 0 01-2.82 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}
function IcMail() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
function IcExternal() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}
function IcLogout() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}
function IcBanner() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M3 15l5-5 4 4 3-3 5 4" />
    </svg>
  );
}
function IcMenu() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
function IcSlides() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" />
    </svg>
  );
}
function IcCheck() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
}
function IcStar() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

// ─── Root dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard({
  categories,
  products,
  projects,
  messages,
  heroSlides,
  whyChooseImageUrl,
  achievementSlides,
  reviews,
}: {
  categories: Category[];
  products: Product[];
  projects: Project[];
  messages: Message[];
  heroSlides: string[];
  whyChooseImageUrl: string;
  achievementSlides: string[];
  reviews: Review[];
}) {
  const router = useRouter();
  const [section, setSection] = useState<Section>("products");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const refresh = () => router.refresh();
  const unread = messages.filter((m) => !m.read).length;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const navItems: {
    id: Section;
    label: string;
    icon: React.ReactNode;
    count?: number;
    badge?: number;
  }[] = [
    { id: "products",    label: "Products",         icon: <IcBox />,    count: products.length   },
    { id: "projects",    label: "Projects",         icon: <IcPhoto />,  count: projects.length   },
    { id: "categories",  label: "Categories",       icon: <IcTag />,    count: categories.length },
    { id: "banners",     label: "Category Banners", icon: <IcBanner />, count: categories.filter(c => c.imageUrl).length },
    { id: "hero-slides", label: "Hero Slideshow",   icon: <IcSlides />, count: heroSlides.length },
    { id: "why-choose",   label: "Why Choose",      icon: <IcCheck />,  count: whyChooseImageUrl ? 1 : 0 },
    { id: "achievements", label: "Achievements",    icon: <IcSlides />, count: achievementSlides.length },
    { id: "reviews",      label: "Reviews",         icon: <IcStar />,   count: reviews.length    },
    { id: "inbox",       label: "Inbox",            icon: <IcMail />,   badge: unread            },
  ];

  function NavBtn({ item }: { item: (typeof navItems)[0] }) {
    const active = section === item.id;
    return (
      <button
        onClick={() => { setSection(item.id); setSidebarOpen(false); }}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
          active ? "bg-ink text-cream shadow-sm" : "text-espresso/70 hover:bg-sand/60 hover:text-ink"
        }`}
      >
        <span className={active ? "text-cream/80" : "text-espresso/40"}>{item.icon}</span>
        <span className="flex-1 text-left font-medium">{item.label}</span>
        {item.count !== undefined && (
          <span className={`tabular-nums text-xs ${active ? "text-cream/50" : "text-espresso/40"}`}>
            {item.count}
          </span>
        )}
        {item.badge ? (
          <span className="rounded-full bg-clay px-1.5 py-0.5 text-xs font-medium text-white">
            {item.badge}
          </span>
        ) : null}
      </button>
    );
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex-shrink-0 border-b border-sand/70 px-5 py-4">
        <Image src="/logo.png" alt="Reliaa" width={72} height={93} className="h-16 w-auto object-contain" />
        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-espresso/40">Admin Panel</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map((item) => <NavBtn key={item.id} item={item} />)}
      </nav>
      <div className="flex-shrink-0 border-t border-sand/70 p-3 space-y-0.5">
        <Link href="/" target="_blank"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-espresso/70 transition-colors hover:bg-sand/60 hover:text-ink">
          <span className="text-espresso/40"><IcExternal /></span>
          View site
        </Link>
        <button onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50">
          <IcLogout />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f1ec]">
      <aside className="hidden w-60 flex-shrink-0 flex-col border-r border-sand/70 bg-white lg:flex">
        {sidebarContent}
      </aside>

      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-ink/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sand/70 bg-white shadow-2xl lg:hidden">
            {sidebarContent}
          </aside>
        </>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex flex-shrink-0 items-center justify-between border-b border-sand/70 bg-white px-4 py-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-sand text-espresso">
            <IcMenu />
          </button>
          <Image src="/logo.png" alt="Reliaa" width={44} height={57} className="h-10 w-auto object-contain" />
          <Link href="/" target="_blank" className="text-espresso/50 hover:text-clay"><IcExternal /></Link>
        </header>

        <main className="flex-1 overflow-hidden">
          {section === "products" && (
            <ProductsSection categories={categories} products={products} onChange={refresh} />
          )}
          {section === "projects" && (
            <ProjectsSection projects={projects} onChange={refresh} />
          )}
          {section === "categories" && (
            <CategoriesSection categories={categories} products={products} onChange={refresh} />
          )}
          {section === "banners" && (
            <BannersSection categories={categories} onChange={refresh} />
          )}
          {section === "hero-slides" && (
            <HeroSlidesSection slides={heroSlides} onChange={refresh} />
          )}
          {section === "why-choose" && (
            <WhyChooseSection imageUrl={whyChooseImageUrl} onChange={refresh} />
          )}
          {section === "achievements" && (
            <AchievementsSection slides={achievementSlides} onChange={refresh} />
          )}
          {section === "reviews" && (
            <ReviewsSection reviews={reviews} onChange={refresh} />
          )}
          {section === "inbox" && (
            <InboxSection messages={messages} onChange={refresh} />
          )}
        </main>
      </div>
    </div>
  );
}

// ─── Products section ─────────────────────────────────────────────────────────

function ProductsSection({
  categories,
  products,
  onChange,
}: {
  categories: Category[];
  products: Product[];
  onChange: () => void;
}) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

  async function remove(id: string) {
    if (!confirm("Remove this product?")) return;
    setDeleting(id);
    try { await fetch(`/api/products/${id}`, { method: "DELETE" }); onChange(); }
    finally { setDeleting(null); }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-sand/60 bg-white px-6 py-4">
        <h1 className="font-serif text-xl text-ink">Products</h1>
        <p className="mt-0.5 text-xs text-espresso/50">
          {products.length} {products.length === 1 ? "piece" : "pieces"} in your collection
        </p>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Left: Add / Edit form */}
        <div className="flex-shrink-0 overflow-y-auto border-b border-sand/60 bg-white p-5 lg:w-72 lg:border-b-0 lg:border-r xl:w-80 lg:p-6">
          <ProductForm
            key={editing?.id ?? "new"}
            categories={categories}
            editing={editing}
            onDone={() => { setEditing(null); onChange(); }}
            onCancel={() => setEditing(null)}
          />
        </div>

        {/* Right: Product grid */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-6">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-espresso/50">
            Collection ({products.length})
          </h2>
          {products.length === 0 ? (
            <EmptyState label="No products yet" />
          ) : (
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
              {products.map((p) => (
                <div key={p.id}
                  className={`overflow-hidden rounded-xl bg-white shadow-sm ring-1 transition-all ${
                    editing?.id === p.id ? "ring-clay shadow-md" : "ring-sand/60"
                  }`}>
                  <div className="relative aspect-[4/3] bg-sand">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                    {p.images.length > 1 && (
                      <span className="absolute right-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 text-xs text-cream">
                        {p.images.length}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] uppercase tracking-widest text-clay">{categoryName(p.categoryId)}</p>
                    <p className="mt-0.5 truncate text-sm font-medium text-ink">{p.name}</p>
                    <div className="mt-2 flex gap-3 text-xs">
                      <button onClick={() => setEditing(p)}
                        className="font-medium text-espresso hover:text-clay">
                        Edit
                      </button>
                      <button onClick={() => remove(p.id)} disabled={deleting === p.id}
                        className="text-red-500 hover:underline disabled:opacity-40">
                        {deleting === p.id ? "Removing…" : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductForm({
  categories,
  editing,
  onDone,
  onCancel,
}: {
  categories: Category[];
  editing: Product | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = !!editing;

  const [keepImages, setKeepImages] = useState<string[]>(editing?.images ?? []);
  const [addedUrls, setAddedUrls] = useState<string[]>([]);
  const [addedPreviews, setAddedPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setError("");
    setUploading(true);
    for (const file of files) {
      const preview = URL.createObjectURL(file);
      try {
        const fd = new FormData();
        fd.append("image", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) {
          setError(((await res.json().catch(() => ({}))).error) || "Upload failed.");
          setUploading(false);
          return;
        }
        const { url } = await res.json();
        setAddedUrls((prev) => [...prev, url]);
        setAddedPreviews((prev) => [...prev, preview]);
      } catch {
        setError("Upload failed. Please try again.");
        setUploading(false);
        return;
      }
    }
    setUploading(false);
  }

  function removeExisting(url: string) {
    setKeepImages((prev) => prev.filter((u) => u !== url));
  }

  function removeAdded(index: number) {
    setAddedUrls((prev) => prev.filter((_, i) => i !== index));
    setAddedPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setSuccess(""); setBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
      if (isEdit) keepImages.forEach((url) => fd.append("keepImages", url));
      addedUrls.forEach((url) => fd.append("addedUrl", url));

      if (keepImages.length + addedUrls.length === 0) {
        setError("At least one image is required.");
        setBusy(false);
        return;
      }

      const url = isEdit ? `/api/products/${editing!.id}` : "/api/products";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, { method, body: fd });
      if (!res.ok) {
        setError((await res.json().catch(() => ({}))).error || "Could not save.");
        return;
      }
      formRef.current?.reset();
      setAddedUrls([]);
      setAddedPreviews([]);
      setSuccess(isEdit ? "Changes saved." : "Product added.");
      onDone();
    } catch { setError("Something went wrong."); }
    finally { setBusy(false); }
  }

  if (categories.length === 0) {
    return (
      <div>
        <SectionLabel>Add product</SectionLabel>
        <p className="mt-2 text-sm text-espresso/60">Add a category first before adding products.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <SectionLabel>{isEdit ? "Edit product" : "Add product"}</SectionLabel>
        {isEdit && (
          <button onClick={onCancel} className="text-xs text-espresso/50 hover:text-clay">
            ✕ Cancel
          </button>
        )}
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-3.5">
        <Field label="Category">
          <select name="categoryId" required defaultValue={editing?.categoryId ?? ""}
            key={editing?.id ?? "new"} className="input">
            {!editing && <option value="" disabled>Choose…</option>}
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Product name">
          <input name="name" required defaultValue={editing?.name ?? ""}
            key={editing?.id ?? "new"}
            placeholder="e.g. Aria 3-Seater Sofa" className="input" />
        </Field>
        <Field label="Description">
          <textarea name="description" rows={3} defaultValue={editing?.description ?? ""}
            key={editing?.id ?? "new"}
            placeholder="Materials, dimensions, finish…"
            className="input resize-none" />
        </Field>

        {/* Image management */}
        <Field label="Images">
          <div className="space-y-2">
            {/* Existing images with remove buttons */}
            {keepImages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {keepImages.map((src) => (
                  <div key={src} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-16 w-20 rounded-lg object-cover ring-1 ring-sand" />
                    <button
                      type="button"
                      onClick={() => removeExisting(src)}
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow"
                      title="Remove"
                    >
                      <span className="text-[10px] leading-none">✕</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Newly uploaded image previews */}
            {addedPreviews.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {addedPreviews.map((src, i) => (
                  <div key={src} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-16 w-20 rounded-lg object-cover ring-1 ring-clay/60" />
                    <button
                      type="button"
                      onClick={() => removeAdded(i)}
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow"
                      title="Remove"
                    >
                      <span className="text-[10px] leading-none">✕</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload zone */}
            <label className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-4 text-center transition-colors ${uploading ? "border-clay bg-clay/5 cursor-not-allowed" : "border-sand bg-[#f5f1ec] hover:border-clay"}`}>
              <span className="text-xs text-espresso/50">
                {uploading ? "Uploading…" : keepImages.length + addedPreviews.length > 0 ? "Add more images" : "Click to choose image(s)"}
              </span>
              <span className="mt-0.5 text-[10px] text-espresso/40">JPG, PNG, WebP · 8 MB max · up to 10</span>
              <input type="file" accept="image/*" multiple onChange={onFileChange} disabled={uploading} className="hidden" />
            </label>
          </div>
        </Field>

        {error   && <p className="text-xs text-red-600">{error}</p>}
        {success && <p className="text-xs text-green-700">{success}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={busy || uploading}
            className="flex-1 rounded-lg bg-clay py-2.5 text-sm text-white transition-colors hover:bg-espresso disabled:opacity-60">
            {uploading ? "Uploading…" : busy ? "Saving…" : isEdit ? "Save changes" : "Add to collection"}
          </button>
          {isEdit && (
            <button type="button" onClick={onCancel}
              className="rounded-lg border border-sand px-4 py-2.5 text-sm text-espresso hover:bg-sand/40">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// ─── Projects section ─────────────────────────────────────────────────────────

function ProjectsSection({
  projects,
  onChange,
}: {
  projects: Project[];
  onChange: () => void;
}) {
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function remove(id: string) {
    if (!confirm("Remove this project?")) return;
    setDeleting(id);
    try { await fetch(`/api/projects/${id}`, { method: "DELETE" }); onChange(); }
    finally { setDeleting(null); }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-sand/60 bg-white px-6 py-4">
        <h1 className="font-serif text-xl text-ink">Projects</h1>
        <p className="mt-0.5 text-xs text-espresso/50">
          {projects.length} {projects.length === 1 ? "project" : "projects"} published
        </p>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        <div className="flex-shrink-0 overflow-y-auto border-b border-sand/60 bg-white p-5 lg:w-72 lg:border-b-0 lg:border-r xl:w-80 lg:p-6">
          <ProjectForm
            key={editing?.id ?? "new"}
            editing={editing}
            onDone={() => { setEditing(null); onChange(); }}
            onCancel={() => setEditing(null)}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-5 lg:p-6">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-espresso/50">
            Published ({projects.length})
          </h2>
          {projects.length === 0 ? (
            <EmptyState label="No projects yet" />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {projects.map((p) => (
                <div key={p.id}
                  className={`overflow-hidden rounded-xl bg-white shadow-sm ring-1 transition-all ${
                    editing?.id === p.id ? "ring-clay shadow-md" : "ring-sand/60"
                  }`}>
                  <div className="relative aspect-[16/9] bg-sand">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
                    {p.images.length > 1 && (
                      <span className="absolute right-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 text-xs text-cream">
                        {p.images.length}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] uppercase tracking-widest text-clay">
                      {[p.type, p.location].filter(Boolean).join(" • ") || "Project"}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium text-ink">{p.title}</p>
                    <div className="mt-2 flex gap-3 text-xs">
                      <button onClick={() => setEditing(p)}
                        className="font-medium text-espresso hover:text-clay">
                        Edit
                      </button>
                      <button onClick={() => remove(p.id)} disabled={deleting === p.id}
                        className="text-red-500 hover:underline disabled:opacity-40">
                        {deleting === p.id ? "Removing…" : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectForm({
  editing,
  onDone,
  onCancel,
}: {
  editing: Project | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = !!editing;

  const [keepImages, setKeepImages] = useState<string[]>(editing?.images ?? []);
  const [addedUrls, setAddedUrls] = useState<string[]>([]);
  const [addedPreviews, setAddedPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setError("");
    setUploading(true);
    for (const file of files) {
      const preview = URL.createObjectURL(file);
      try {
        const fd = new FormData();
        fd.append("image", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) {
          setError(((await res.json().catch(() => ({}))).error) || "Upload failed.");
          setUploading(false);
          return;
        }
        const { url } = await res.json();
        setAddedUrls((prev) => [...prev, url]);
        setAddedPreviews((prev) => [...prev, preview]);
      } catch {
        setError("Upload failed. Please try again.");
        setUploading(false);
        return;
      }
    }
    setUploading(false);
  }

  function removeExisting(url: string) {
    setKeepImages((prev) => prev.filter((u) => u !== url));
  }

  function removeAdded(index: number) {
    setAddedUrls((prev) => prev.filter((_, i) => i !== index));
    setAddedPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setSuccess(""); setBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
      if (isEdit) keepImages.forEach((url) => fd.append("keepImages", url));
      addedUrls.forEach((url) => fd.append("addedUrl", url));

      if (keepImages.length + addedUrls.length === 0) {
        setError("At least one image is required.");
        setBusy(false);
        return;
      }

      const url = isEdit ? `/api/projects/${editing!.id}` : "/api/projects";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, { method, body: fd });
      if (!res.ok) {
        setError((await res.json().catch(() => ({}))).error || "Could not save.");
        return;
      }
      formRef.current?.reset();
      setAddedUrls([]);
      setAddedPreviews([]);
      setSuccess(isEdit ? "Changes saved." : "Project published.");
      onDone();
    } catch { setError("Something went wrong."); }
    finally { setBusy(false); }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <SectionLabel>{isEdit ? "Edit project" : "Add project"}</SectionLabel>
        {isEdit && (
          <button onClick={onCancel} className="text-xs text-espresso/50 hover:text-clay">
            ✕ Cancel
          </button>
        )}
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-3.5">
        <Field label="Title">
          <input name="title" required defaultValue={editing?.title ?? ""}
            key={editing?.id ?? "new"}
            placeholder="e.g. Hillside Apartment" className="input" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Location">
            <input name="location" defaultValue={editing?.location ?? ""}
              key={editing?.id ?? "new"}
              placeholder="e.g. Istanbul" className="input" />
          </Field>
          <Field label="Type">
            <input name="type" defaultValue={editing?.type ?? ""}
              key={editing?.id ?? "new"}
              placeholder="e.g. Residential" className="input" />
          </Field>
        </div>
        <Field label="Description">
          <textarea name="description" rows={3} defaultValue={editing?.description ?? ""}
            key={editing?.id ?? "new"}
            placeholder="A note about the space and pieces used."
            className="input resize-none" />
        </Field>

        <Field label="Images">
          <div className="space-y-2">
            {keepImages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {keepImages.map((src) => (
                  <div key={src} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-16 w-24 rounded-lg object-cover ring-1 ring-sand" />
                    <button type="button" onClick={() => removeExisting(src)}
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow">
                      <span className="text-[10px] leading-none">✕</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
            {addedPreviews.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {addedPreviews.map((src, i) => (
                  <div key={src} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-16 w-24 rounded-lg object-cover ring-1 ring-clay/60" />
                    <button type="button" onClick={() => removeAdded(i)}
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow">
                      <span className="text-[10px] leading-none">✕</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-4 text-center transition-colors ${uploading ? "border-clay bg-clay/5 cursor-not-allowed" : "border-sand bg-[#f5f1ec] hover:border-clay"}`}>
              <span className="text-xs text-espresso/50">
                {uploading ? "Uploading…" : keepImages.length + addedPreviews.length > 0 ? "Add more images" : "Click to choose image(s)"}
              </span>
              <span className="mt-0.5 text-[10px] text-espresso/40">JPG, PNG, WebP · 8 MB max · up to 10</span>
              <input type="file" accept="image/*" multiple onChange={onFileChange} disabled={uploading} className="hidden" />
            </label>
          </div>
        </Field>

        {error   && <p className="text-xs text-red-600">{error}</p>}
        {success && <p className="text-xs text-green-700">{success}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={busy || uploading}
            className="flex-1 rounded-lg bg-clay py-2.5 text-sm text-white transition-colors hover:bg-espresso disabled:opacity-60">
            {uploading ? "Uploading…" : busy ? "Saving…" : isEdit ? "Save changes" : "Publish project"}
          </button>
          {isEdit && (
            <button type="button" onClick={onCancel}
              className="rounded-lg border border-sand px-4 py-2.5 text-sm text-espresso hover:bg-sand/40">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// ─── Categories section ───────────────────────────────────────────────────────

function CategoriesSection({
  categories,
  products,
  onChange,
}: {
  categories: Category[];
  products: Product[];
  onChange: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [saving, setSaving] = useState(false);

  async function addCategory(e: React.FormEvent) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) { setError((await res.json().catch(() => ({}))).error || "Could not add."); return; }
      setName(""); setDescription(""); onChange();
    } finally { setBusy(false); }
  }

  function startEdit(c: Category) {
    setEditingId(c.id);
    setEditName(c.name ?? "");
    setEditDesc(c.description ?? "");
  }

  async function saveEdit(id: string) {
    setSaving(true);
    try {
      await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, description: editDesc }),
      });
      setEditingId(null);
      onChange();
    } finally { setSaving(false); }
  }

  async function remove(c: Category) {
    const count = products.filter((p) => p.categoryId === c.id).length;
    const msg = count > 0
      ? `Delete "${c.name}"? This will also remove ${count} product${count === 1 ? "" : "s"}.`
      : `Delete "${c.name}"?`;
    if (!confirm(msg)) return;
    await fetch(`/api/categories/${c.id}`, { method: "DELETE" });
    onChange();
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-sand/60 bg-white px-6 py-4">
        <h1 className="font-serif text-xl text-ink">Categories</h1>
        <p className="mt-0.5 text-xs text-espresso/50">Organise how your collection is grouped on the website</p>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Left: Add form */}
        <div className="flex-shrink-0 overflow-y-auto border-b border-sand/60 bg-white p-5 lg:w-72 lg:border-b-0 lg:border-r xl:w-80 lg:p-6">
          <SectionLabel>New category</SectionLabel>
          <form onSubmit={addCategory} className="mt-4 space-y-3.5">
            <Field label="Name">
              <input value={name} onChange={(e) => setName(e.target.value)}
                required placeholder="e.g. Tables" className="input" />
            </Field>
            <Field label="Description">
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                rows={3} placeholder="Short description shown on homepage."
                className="input resize-none" />
            </Field>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button type="submit" disabled={busy}
              className="w-full rounded-lg bg-clay py-2.5 text-sm text-white transition-colors hover:bg-espresso disabled:opacity-60">
              {busy ? "Adding…" : "Add category"}
            </button>
          </form>
        </div>

        {/* Right: Category list with inline edit */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-6">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-espresso/50">
            All categories ({categories.length})
          </h2>
          {categories.length === 0 ? (
            <EmptyState label="No categories yet" />
          ) : (
            <div className="space-y-2">
              {categories.map((c) => {
                const count = products.filter((p) => p.categoryId === c.id).length;
                const isEditing = editingId === c.id;

                return (
                  <div key={c.id}
                    className={`rounded-xl bg-white p-4 shadow-sm ring-1 transition-all ${
                      isEditing ? "ring-clay" : "ring-sand/60"
                    }`}>
                    {isEditing ? (
                      <div className="space-y-2">
                        <div>
                          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-espresso/50">Name</label>
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="input text-sm"
                            placeholder="Category name"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-espresso/50">Description</label>
                          <textarea
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            rows={3}
                            className="input text-sm resize-none"
                            placeholder="Short description shown on homepage"
                          />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => saveEdit(c.id)}
                            disabled={saving || !editName.trim()}
                            className="rounded-lg bg-clay px-4 py-1.5 text-xs text-white hover:bg-espresso disabled:opacity-50">
                            {saving ? "Saving…" : "Save"}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="rounded-lg border border-sand px-4 py-1.5 text-xs text-espresso hover:bg-sand/40">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink">{c.name}</p>
                          {c.description && (
                            <p className="mt-0.5 truncate text-xs text-espresso/50">{c.description}</p>
                          )}
                          <p className="mt-1 text-xs text-espresso/40">
                            {count} {count === 1 ? "product" : "products"}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-3 text-xs">
                          <button onClick={() => startEdit(c)}
                            className="font-medium text-espresso hover:text-clay">
                            Edit
                          </button>
                          <button onClick={() => remove(c)}
                            className="text-red-500 hover:underline">
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Category Banners section ────────────────────────────────────────────────

function BannersSection({
  categories,
  onChange,
}: {
  categories: Category[];
  onChange: () => void;
}) {
  const withImage = categories.filter((c) => c.imageUrl).length;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-sand/60 bg-white px-6 py-4">
        <h1 className="font-serif text-xl text-ink">Category Banners</h1>
        <p className="mt-0.5 text-xs text-espresso/50">
          Upload a background image for each category card shown on the homepage.
          Text is overlaid automatically. {withImage}/{categories.length} set.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 lg:p-6">
        {categories.length === 0 ? (
          <EmptyState label="No categories yet — add some in the Categories tab first." />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((cat) => (
              <BannerCard key={cat.id} category={cat} onChange={onChange} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BannerCard({
  category,
  onChange,
}: {
  category: Category;
  onChange: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`/api/categories/${category.id}/image`, {
        method: "POST",
        body: fd,
      });
      if (res.ok) onChange();
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleRemove() {
    if (!confirm(`Remove banner image for "${category.name}"?`)) return;
    setRemoving(true);
    try {
      await fetch(`/api/categories/${category.id}/image`, { method: "DELETE" });
      onChange();
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-sand/60">
      {/* Preview */}
      <div className="relative aspect-[16/9] bg-sand">
        {category.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={category.imageUrl}
            alt={category.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1">
            <span className="text-2xl opacity-20">🖼</span>
            <span className="text-xs text-espresso/40">No banner set</span>
          </div>
        )}

        {/* Text overlay preview */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/65 via-black/10 to-transparent p-4">
          <p className="font-serif text-lg font-semibold text-white drop-shadow">
            {category.name}
          </p>
          {category.description && (
            <p className="mt-0.5 line-clamp-1 text-xs text-white/70">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 p-3">
        <label className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg py-2 text-xs font-medium text-white transition-colors ${
          uploading ? "bg-clay/60" : "bg-clay hover:bg-espresso"
        }`}>
          {uploading ? "Uploading…" : category.imageUrl ? "Change image" : "Upload image"}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {category.imageUrl && (
          <button
            onClick={handleRemove}
            disabled={removing}
            className="rounded-lg border border-sand px-3 py-2 text-xs text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            {removing ? "…" : "Remove"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Hero Slides section ──────────────────────────────────────────────────────

function HeroSlidesSection({
  slides,
  onChange,
}: {
  slides: string[];
  onChange: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/hero-slides", { method: "POST", body: fd });
      if (!res.ok) {
        setError(((await res.json().catch(() => ({}))).error) || "Upload failed.");
      } else {
        onChange();
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleRemove(url: string) {
    if (!confirm("Remove this slide?")) return;
    await fetch("/api/hero-slides", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    onChange();
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-sand/60 bg-white px-6 py-4">
        <h1 className="font-serif text-xl text-ink">Hero Slideshow</h1>
        <p className="mt-0.5 text-xs text-espresso/50">
          Images that appear in the full-width slideshow at the top of the homepage.
          {slides.length === 0 && " When empty, product images are used as fallback."}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 lg:p-6">
        {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-xs text-red-600">{error}</p>}

        {slides.length === 0 ? (
          <EmptyState label="No slides uploaded yet. Upload images below to populate the hero slideshow." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {slides.map((url, i) => (
              <div key={url} className="group relative overflow-hidden rounded-2xl bg-sand shadow-sm ring-1 ring-sand/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Slide ${i + 1}`} className="aspect-[16/9] w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
                  <button
                    onClick={() => handleRemove(url)}
                    className="scale-75 rounded-full bg-red-500 px-4 py-2 text-xs font-medium text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
                <div className="absolute left-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white">
                  Slide {i + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        <label className={`mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed py-5 text-sm transition-colors ${
          uploading ? "border-clay bg-clay/5 text-clay" : "border-sand bg-white text-espresso/60 hover:border-clay hover:text-clay"
        }`}>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4v16m8-8H4" />
          </svg>
          {uploading ? "Uploading…" : "Add slide image"}
          <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
        </label>
        <p className="mt-2 text-center text-[10px] text-espresso/40">JPG, PNG, WebP · 8 MB max · landscape images work best</p>
      </div>
    </div>
  );
}

// ─── Why Choose section ───────────────────────────────────────────────────────

function WhyChooseSection({
  imageUrl,
  onChange,
}: {
  imageUrl: string;
  onChange: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/why-choose/image", { method: "POST", body: fd });
      if (!res.ok) {
        setError(((await res.json().catch(() => ({}))).error) || "Upload failed.");
      } else {
        onChange();
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleRemove() {
    if (!confirm("Remove the Why Choose background image?")) return;
    setRemoving(true);
    try {
      await fetch("/api/why-choose/image", { method: "DELETE" });
      onChange();
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-sand/60 bg-white px-6 py-4">
        <h1 className="font-serif text-xl text-ink">Why Choose Reliaa</h1>
        <p className="mt-0.5 text-xs text-espresso/50">
          Background image for the &ldquo;Why Choose Reliaa&rdquo; section on the homepage.
          If no image is set, a dark background is used automatically.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 lg:p-6">
        {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-xs text-red-600">{error}</p>}

        {/* Preview */}
        <div className="relative overflow-hidden rounded-2xl bg-ink shadow-sm" style={{ minHeight: 200 }}>
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="Why Choose background" className="h-full w-full object-cover" style={{ minHeight: 200 }} />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/70 px-6 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-clay">Our Promise</p>
            <p className="mt-2 font-serif text-xl text-white">Why Choose Reliaa</p>
            <p className="mt-2 text-xs text-white/60">Background preview — feature bullets appear below in the live section.</p>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <label className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white transition-colors ${
            uploading ? "bg-clay/60" : "bg-clay hover:bg-espresso"
          }`}>
            {uploading ? "Uploading…" : imageUrl ? "Change image" : "Upload image"}
            <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
          </label>
          {imageUrl && (
            <button
              onClick={handleRemove}
              disabled={removing}
              className="rounded-xl border border-sand px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              {removing ? "…" : "Remove"}
            </button>
          )}
        </div>
        <p className="mt-2 text-center text-[10px] text-espresso/40">JPG, PNG, WebP · 8 MB max · wide/landscape images work best</p>

        {/* Static feature preview */}
        <div className="mt-6 rounded-2xl border border-sand/70 bg-white p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-espresso/40">Feature points shown on homepage</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Quality Craftsmanship",
              "Timeless Design",
              "Natural Materials",
              "Expert Guidance",
            ].map((point) => (
              <div key={point} className="flex items-center gap-2 text-sm text-espresso/70">
                <svg className="h-4 w-4 flex-shrink-0 text-clay" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {point}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Achievements section ─────────────────────────────────────────────────────

function AchievementsSection({
  slides,
  onChange,
}: {
  slides: string[];
  onChange: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/achievement-slides", { method: "POST", body: fd });
      if (!res.ok) {
        setError(((await res.json().catch(() => ({}))).error) || "Upload failed.");
      } else {
        onChange();
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleRemove(url: string) {
    if (!confirm("Remove this achievement image?")) return;
    await fetch("/api/achievement-slides", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    onChange();
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-sand/60 bg-white px-6 py-4">
        <h1 className="font-serif text-xl text-ink">Our Achievements</h1>
        <p className="mt-0.5 text-xs text-espresso/50">
          Images shown in the &ldquo;Our Achievements&rdquo; slideshow on the homepage, right below the Categories section.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 lg:p-6">
        {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-xs text-red-600">{error}</p>}

        {slides.length === 0 ? (
          <EmptyState label="No achievement images yet. Upload images below to show this section on the homepage." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {slides.map((url, i) => (
              <div key={url} className="group relative overflow-hidden rounded-2xl bg-sand shadow-sm ring-1 ring-sand/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Achievement ${i + 1}`} className="aspect-[4/3] w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
                  <button
                    onClick={() => handleRemove(url)}
                    className="scale-75 rounded-full bg-red-500 px-4 py-2 text-xs font-medium text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
                <div className="absolute left-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white">
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        <label className={`mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed py-5 text-sm transition-colors ${
          uploading ? "border-clay bg-clay/5 text-clay" : "border-sand bg-white text-espresso/60 hover:border-clay hover:text-clay"
        }`}>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4v16m8-8H4" />
          </svg>
          {uploading ? "Uploading…" : "Add achievement image"}
          <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
        </label>
        <p className="mt-2 text-center text-[10px] text-espresso/40">JPG, PNG, WebP · 8 MB max</p>
      </div>
    </div>
  );
}

// ─── Reviews section ──────────────────────────────────────────────────────────

function ReviewsSection({
  reviews,
  onChange,
}: {
  reviews: Review[];
  onChange: () => void;
}) {
  const [editing, setEditing] = useState<Review | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [clientName, setClientName] = useState("");
  const [role, setRole] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  function startEdit(r: Review) {
    setEditing(r);
    setClientName(r.clientName);
    setRole(r.role);
    setText(r.text);
    setRating(r.rating);
    setError("");
  }

  function cancelEdit() {
    setEditing(null);
    setClientName(""); setRole(""); setText(""); setRating(5);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const body = { clientName, role, text, rating };
      const url = editing ? `/api/reviews/${editing.id}` : "/api/reviews";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        setError(((await res.json().catch(() => ({}))).error) || "Could not save.");
        return;
      }
      setClientName(""); setRole(""); setText(""); setRating(5);
      setEditing(null);
      onChange();
    } catch { setError("Something went wrong."); }
    finally { setBusy(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    if (editing?.id === id) cancelEdit();
    onChange();
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-sand/60 bg-white px-6 py-4">
        <h1 className="font-serif text-xl text-ink">Client Reviews</h1>
        <p className="mt-0.5 text-xs text-espresso/50">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"} · shown in the &ldquo;What Our Clients Say&rdquo; section on the homepage.
        </p>
      </div>

      <div className="flex h-full min-h-0 flex-1 flex-col lg:flex-row">
        {/* Form panel */}
        <div className="flex-shrink-0 overflow-y-auto border-b border-sand/60 p-5 lg:w-80 lg:border-b-0 lg:border-r lg:p-6 xl:w-96">
          <SectionLabel>{editing ? "Edit review" : "Add review"}</SectionLabel>
          {editing && (
            <button onClick={cancelEdit} className="mt-1 text-xs text-espresso/50 hover:text-clay">✕ Cancel edit</button>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <Field label="Client name">
              <input
                className="input"
                placeholder="e.g. Sarah Johnson"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </Field>
            <Field label="Role / title (optional)">
              <input
                className="input"
                placeholder="e.g. Interior Designer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </Field>
            <Field label="Review text">
              <textarea
                className="input resize-none"
                rows={4}
                placeholder="What did they say about Reliaa?"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </Field>
            <Field label="Star rating">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="transition-transform hover:scale-110"
                  >
                    <svg
                      className={`h-6 w-6 ${s <= rating ? "text-clay" : "text-sand"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
                <span className="ml-2 self-center text-xs text-espresso/50">{rating}/5</span>
              </div>
            </Field>

            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-clay py-2.5 text-sm text-white transition-colors hover:bg-espresso disabled:opacity-60"
            >
              {busy ? "Saving…" : editing ? "Save changes" : "Add review"}
            </button>
          </form>
        </div>

        {/* Reviews list */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-6">
          {reviews.length === 0 ? (
            <EmptyState label="No reviews yet — add your first one." />
          ) : (
            <div className="space-y-4">
              {[...reviews]
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                .map((r) => (
                  <div
                    key={r.id}
                    className={`rounded-2xl p-5 shadow-sm ring-1 transition-all ${
                      editing?.id === r.id ? "ring-clay/60 bg-clay/5" : "ring-sand/60 bg-white"
                    }`}
                  >
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <svg key={s} className={`h-3.5 w-3.5 ${s < r.rating ? "text-clay" : "text-sand"}`}
                          fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-espresso/80 line-clamp-3">&ldquo;{r.text}&rdquo;</p>
                    <div className="mt-3 flex items-center justify-between border-t border-sand/60 pt-3">
                      <div>
                        <p className="text-sm font-medium text-ink">{r.clientName}</p>
                        {r.role && <p className="text-xs text-espresso/50">{r.role}</p>}
                      </div>
                      <div className="flex gap-3 text-xs">
                        <button onClick={() => startEdit(r)} className="font-medium text-espresso hover:text-clay">Edit</button>
                        <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:underline">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Inbox section ────────────────────────────────────────────────────────────

function InboxSection({
  messages,
  onChange,
}: {
  messages: Message[];
  onChange: () => void;
}) {
  const sorted = [...messages].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const unread = sorted.filter((m) => !m.read).length;

  async function toggleRead(m: Message) {
    await fetch(`/api/messages/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !m.read }),
    });
    onChange();
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    onChange();
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-sand/60 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-xl text-ink">Inbox</h1>
          {unread > 0 && (
            <span className="rounded-full bg-clay px-2 py-0.5 text-xs font-medium text-white">
              {unread} new
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-espresso/50">
          {sorted.length} {sorted.length === 1 ? "enquiry" : "enquiries"} received
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 lg:p-6">
        {sorted.length === 0 ? (
          <EmptyState label="No messages yet" />
        ) : (
          <div className="mx-auto max-w-3xl space-y-3">
            {sorted.map((m) => (
              <div key={m.id}
                className={`rounded-2xl p-5 shadow-sm ring-1 ${
                  m.read ? "bg-white ring-sand/60" : "bg-clay/5 ring-clay/30"
                }`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-ink">
                      {m.name}
                      {!m.read && (
                        <span className="ml-2 rounded-full bg-clay px-2 py-0.5 text-xs font-medium text-white">new</span>
                      )}
                    </p>
                    <p className="text-sm text-espresso/60">
                      <a href={`mailto:${m.email}`} className="hover:text-clay">{m.email}</a>
                      {m.phone && <span className="ml-2 text-espresso/40">· {m.phone}</span>}
                    </p>
                  </div>
                  <time className="text-xs text-espresso/40">{new Date(m.createdAt).toLocaleString()}</time>
                </div>
                {m.subject && (
                  <p className="mt-3 text-xs uppercase tracking-widest text-clay">Re: {m.subject}</p>
                )}
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-espresso/80">{m.message}</p>
                <div className="mt-4 flex gap-4 border-t border-sand/60 pt-3 text-xs">
                  <button onClick={() => toggleRead(m)} className="text-espresso/60 hover:text-clay">
                    {m.read ? "Mark unread" : "Mark read"}
                  </button>
                  <a href={`mailto:${m.email}`} className="text-espresso/60 hover:text-clay">Reply by email</a>
                  <button onClick={() => remove(m.id)} className="ml-auto text-red-400 hover:text-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shared components ────────────────────────────────────────────────────────

function ImagePicker({
  name, previews, onChange, hint,
}: {
  name: string;
  previews: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
}) {
  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-sand bg-[#f5f1ec] py-4 text-center transition-colors hover:border-clay">
        <span className="text-xs text-espresso/50">{hint ?? "Click to choose image(s)"}</span>
        <span className="mt-0.5 text-[10px] text-espresso/40">JPG, PNG, WebP · 8 MB max · up to 10</span>
        <input type="file" name={name} accept="image/*" multiple onChange={onChange} className="hidden" />
      </label>
      {previews.length > 0 && (
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {previews.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="aspect-square w-full rounded-md object-cover ring-1 ring-sand" />
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-espresso/50">{label}</label>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-espresso/50">{children}</p>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex h-40 items-center justify-center rounded-2xl border-2 border-dashed border-sand">
      <p className="text-sm text-espresso/40">{label}</p>
    </div>
  );
}
