"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Category, Message, Product, Project } from "@/lib/types";

type Section = "products" | "projects" | "categories" | "inbox";

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
function IcMenu() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

// ─── Root dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard({
  categories,
  products,
  projects,
  messages,
}: {
  categories: Category[];
  products: Product[];
  projects: Project[];
  messages: Message[];
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
    { id: "products",   label: "Products",   icon: <IcBox />,   count: products.length   },
    { id: "projects",   label: "Projects",   icon: <IcPhoto />, count: projects.length   },
    { id: "categories", label: "Categories", icon: <IcTag />,   count: categories.length },
    { id: "inbox",      label: "Inbox",      icon: <IcMail />,  badge: unread            },
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
  const [previews, setPreviews] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Reset previews when switching between add/edit
  const isEdit = !!editing;

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPreviews(Array.from(e.target.files ?? []).map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setSuccess(""); setBusy(true);
    try {
      const url = isEdit ? `/api/products/${editing!.id}` : "/api/products";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, { method, body: new FormData(e.currentTarget) });
      if (!res.ok) {
        setError((await res.json().catch(() => ({}))).error || "Could not save.");
        return;
      }
      formRef.current?.reset();
      setPreviews([]);
      if (isEdit) {
        setSuccess("Changes saved.");
      } else {
        setSuccess("Product added.");
      }
      onDone();
    } catch { setError("Something went wrong."); }
    finally { setBusy(false); }
  }

  if (categories.length === 0) {
    return (
      <div>
        <SectionLabel>Add product</SectionLabel>
        <p className="text-sm text-espresso/60">Add a category first before adding products.</p>
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

      {isEdit && (
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {editing!.images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="h-14 w-16 flex-shrink-0 rounded-lg object-cover ring-1 ring-sand" />
          ))}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-3.5">
        <Field label="Category">
          <select name="categoryId" required defaultValue={editing?.categoryId ?? ""}
            key={editing?.id ?? "new"}
            className="input">
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
        <Field label={isEdit ? "Replace images (optional)" : "Images"}>
          <ImagePicker name="images" previews={previews} onChange={onFileChange}
            hint={isEdit ? "Upload new images to replace existing ones" : undefined} />
        </Field>
        {error   && <p className="text-xs text-red-600">{error}</p>}
        {success && <p className="text-xs text-green-700">{success}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={busy}
            className="flex-1 rounded-lg bg-clay py-2.5 text-sm text-white transition-colors hover:bg-espresso disabled:opacity-60">
            {busy ? "Saving…" : isEdit ? "Save changes" : "Add to collection"}
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
  const [previews, setPreviews] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isEdit = !!editing;

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPreviews(Array.from(e.target.files ?? []).map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setSuccess(""); setBusy(true);
    try {
      const url = isEdit ? `/api/projects/${editing!.id}` : "/api/projects";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, { method, body: new FormData(e.currentTarget) });
      if (!res.ok) {
        setError((await res.json().catch(() => ({}))).error || "Could not save.");
        return;
      }
      formRef.current?.reset();
      setPreviews([]);
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

      {isEdit && (
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {editing!.images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="h-14 w-20 flex-shrink-0 rounded-lg object-cover ring-1 ring-sand" />
          ))}
        </div>
      )}

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
        <Field label={isEdit ? "Replace images (optional)" : "Images"}>
          <ImagePicker name="images" previews={previews} onChange={onFileChange}
            hint={isEdit ? "Upload new images to replace existing ones" : undefined} />
        </Field>
        {error   && <p className="text-xs text-red-600">{error}</p>}
        {success && <p className="text-xs text-green-700">{success}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={busy}
            className="flex-1 rounded-lg bg-clay py-2.5 text-sm text-white transition-colors hover:bg-espresso disabled:opacity-60">
            {busy ? "Saving…" : isEdit ? "Save changes" : "Publish project"}
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
    setEditName(c.name);
    setEditDesc(c.description);
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
              <input value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description shown on homepage." className="input" />
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
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="input text-sm"
                          placeholder="Category name"
                        />
                        <input
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="input text-sm"
                          placeholder="Description"
                        />
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
