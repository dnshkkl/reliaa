"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Category, Message, Product, Project } from "@/lib/types";

type Tab = "products" | "projects" | "categories" | "inbox";

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
  const [tab, setTab] = useState<Tab>("products");
  const refresh = () => router.refresh();
  const unread = messages.filter((m) => !m.read).length;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "products", label: `Products (${products.length})` },
    { id: "projects", label: `Projects (${projects.length})` },
    { id: "categories", label: `Categories (${categories.length})` },
    { id: "inbox", label: "Inbox", badge: unread },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-sand/70 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-6 md:py-4">
          <div className="flex items-baseline gap-2">
            <span className="font-script text-2xl text-ink">
              Reliaa
            </span>
            <span className="text-sm text-espresso/60">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden text-sm text-espresso hover:text-clay sm:block"
            >
              View site ↗
            </Link>
            <button
              onClick={logout}
              className="rounded-full bg-ink px-3 py-1.5 text-sm text-cream hover:bg-espresso sm:px-4"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Tabs — scrollable on mobile */}
        <div className="mx-auto max-w-6xl px-5 md:px-6">
          <nav className="-mb-px flex gap-0 overflow-x-auto scrollbar-none">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative shrink-0 whitespace-nowrap border-b-2 px-3 py-3 text-xs transition-colors sm:px-4 sm:text-sm ${
                  tab === t.id
                    ? "border-clay text-ink"
                    : "border-transparent text-espresso/60 hover:text-ink"
                }`}
              >
                {t.label}
                {t.badge ? (
                  <span className="ml-1.5 rounded-full bg-clay px-1.5 py-0.5 text-xs text-white">
                    {t.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-5 py-8 md:space-y-12 md:px-6 md:py-10">
        {tab === "products" && (
          <>
            <AddProductForm categories={categories} onDone={refresh} />
            <ManageProducts
              categories={categories}
              products={products}
              onChange={refresh}
            />
          </>
        )}

        {tab === "projects" && (
          <>
            <AddProjectForm onDone={refresh} />
            <ManageProjects projects={projects} onChange={refresh} />
          </>
        )}

        {tab === "categories" && (
          <ManageCategories
            categories={categories}
            products={products}
            onChange={refresh}
          />
        )}

        {tab === "inbox" && <Inbox messages={messages} onChange={refresh} />}
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Multi-image picker (shared)                                                */
/* -------------------------------------------------------------------------- */

function ImagePicker({
  name,
  previews,
  onChange,
}: {
  name: string;
  previews: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="flex min-h-[7rem] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-sand bg-cream p-4 text-center transition-colors hover:border-clay">
        <span className="text-sm text-espresso/60">
          Click to choose image(s)
        </span>
        <span className="text-xs text-espresso/50">
          JPG, PNG or WebP · up to 8 MB each · up to 10
        </span>
        <input
          type="file"
          name={name}
          accept="image/*"
          multiple
          onChange={onChange}
          className="hidden"
        />
      </label>
      {previews.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {previews.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={`Preview ${i + 1}`}
              className="aspect-square w-full rounded-lg object-cover ring-1 ring-sand"
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Add product                                                                */
/* -------------------------------------------------------------------------- */

function AddProductForm({
  categories,
  onDone,
}: {
  categories: Category[];
  onDone: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: new FormData(e.currentTarget),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Could not add product.");
        return;
      }
      formRef.current?.reset();
      setPreviews([]);
      setSuccess("Product added to the collection.");
      onDone();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (categories.length === 0) {
    return (
      <Section title="Add a product">
        <p className="text-sm text-espresso/70">
          Create a category in the Categories tab before adding products.
        </p>
      </Section>
    );
  }

  return (
    <Section
      title="Add a product"
      subtitle="Upload one or more images and assign the piece to a category."
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="grid gap-6 md:grid-cols-2"
      >
        <div className="space-y-4">
          <Field label="Category">
            <select
              name="categoryId"
              required
              defaultValue=""
              className="w-full rounded-lg border border-sand bg-cream px-3 py-2.5 text-ink outline-none focus:border-clay"
            >
              <option value="" disabled>
                Choose a category…
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Product name">
            <input
              name="name"
              required
              placeholder="e.g. Aria 3-Seater Sofa"
              className="w-full rounded-lg border border-sand bg-cream px-3 py-2.5 text-ink outline-none focus:border-clay"
            />
          </Field>

          <Field label="Description (optional)">
            <textarea
              name="description"
              rows={5}
              placeholder="Materials, dimensions, finish, or a short note."
              className="w-full rounded-lg border border-sand bg-cream px-3 py-2.5 text-ink outline-none focus:border-clay"
            />
          </Field>
        </div>

        <div className="space-y-4">
          <Field label="Product images">
            <ImagePicker
              name="images"
              previews={previews}
              onChange={onFileChange}
            />
          </Field>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-700">{success}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-ink py-2.5 text-cream transition-colors hover:bg-espresso disabled:opacity-60"
          >
            {busy ? "Uploading…" : "Add to collection"}
          </button>
        </div>
      </form>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Manage products                                                            */
/* -------------------------------------------------------------------------- */

function ManageProducts({
  categories,
  products,
  onChange,
}: {
  categories: Category[];
  products: Product[];
  onChange: () => void;
}) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? "—";

  async function remove(id: string) {
    if (!confirm("Remove this product from the collection?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      onChange();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <Section
      title="Current products"
      subtitle="Everything currently shown in your collection."
    >
      {products.length === 0 ? (
        <p className="text-sm text-espresso/70">No products yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="overflow-hidden rounded-xl bg-white ring-1 ring-sand/60"
            >
              <div className="relative aspect-[4/3] bg-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
                {p.images.length > 1 && (
                  <span className="absolute right-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 text-xs text-cream">
                    {p.images.length}
                  </span>
                )}
              </div>
              <div className="p-4">
                <span className="text-xs uppercase tracking-widest text-clay">
                  {categoryName(p.categoryId)}
                </span>
                <h3 className="mt-1 font-medium text-ink">{p.name}</h3>
                <button
                  onClick={() => remove(p.id)}
                  disabled={deleting === p.id}
                  className="mt-3 text-sm text-red-600 hover:underline disabled:opacity-50"
                >
                  {deleting === p.id ? "Removing…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Add project                                                                */
/* -------------------------------------------------------------------------- */

function AddProjectForm({ onDone }: { onDone: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        body: new FormData(e.currentTarget),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Could not add project.");
        return;
      }
      formRef.current?.reset();
      setPreviews([]);
      setSuccess("Project published.");
      onDone();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Section
      title="Add a project"
      subtitle="Showcase your furniture in a real space. Upload a set of photos."
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="grid gap-6 md:grid-cols-2"
      >
        <div className="space-y-4">
          <Field label="Project title">
            <input
              name="title"
              required
              placeholder="e.g. Hillside Apartment"
              className="w-full rounded-lg border border-sand bg-cream px-3 py-2.5 text-ink outline-none focus:border-clay"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Location (optional)">
              <input
                name="location"
                placeholder="e.g. Istanbul"
                className="w-full rounded-lg border border-sand bg-cream px-3 py-2.5 text-ink outline-none focus:border-clay"
              />
            </Field>
            <Field label="Type (optional)">
              <input
                name="type"
                placeholder="e.g. Residential"
                className="w-full rounded-lg border border-sand bg-cream px-3 py-2.5 text-ink outline-none focus:border-clay"
              />
            </Field>
          </div>
          <Field label="Description (optional)">
            <textarea
              name="description"
              rows={4}
              placeholder="A short note about the space and the pieces used."
              className="w-full rounded-lg border border-sand bg-cream px-3 py-2.5 text-ink outline-none focus:border-clay"
            />
          </Field>
        </div>

        <div className="space-y-4">
          <Field label="Project images">
            <ImagePicker
              name="images"
              previews={previews}
              onChange={onFileChange}
            />
          </Field>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-700">{success}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-ink py-2.5 text-cream transition-colors hover:bg-espresso disabled:opacity-60"
          >
            {busy ? "Uploading…" : "Publish project"}
          </button>
        </div>
      </form>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Manage projects                                                            */
/* -------------------------------------------------------------------------- */

function ManageProjects({
  projects,
  onChange,
}: {
  projects: Project[];
  onChange: () => void;
}) {
  const [deleting, setDeleting] = useState<string | null>(null);

  async function remove(id: string) {
    if (!confirm("Remove this project?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      onChange();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <Section title="Current projects">
      {projects.length === 0 ? (
        <p className="text-sm text-espresso/70">No projects yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="overflow-hidden rounded-xl bg-white ring-1 ring-sand/60"
            >
              <div className="relative aspect-[16/10] bg-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="h-full w-full object-cover"
                />
                {p.images.length > 1 && (
                  <span className="absolute right-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 text-xs text-cream">
                    {p.images.length}
                  </span>
                )}
              </div>
              <div className="p-4">
                <span className="text-xs uppercase tracking-widest text-clay">
                  {[p.type, p.location].filter(Boolean).join(" • ") || "Project"}
                </span>
                <h3 className="mt-1 font-medium text-ink">{p.title}</h3>
                <button
                  onClick={() => remove(p.id)}
                  disabled={deleting === p.id}
                  className="mt-3 text-sm text-red-600 hover:underline disabled:opacity-50"
                >
                  {deleting === p.id ? "Removing…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Manage categories                                                          */
/* -------------------------------------------------------------------------- */

function ManageCategories({
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

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Could not add category.");
        return;
      }
      setName("");
      setDescription("");
      onChange();
    } finally {
      setBusy(false);
    }
  }

  async function removeCategory(c: Category) {
    const count = products.filter((p) => p.categoryId === c.id).length;
    const message =
      count > 0
        ? `Delete "${c.name}"? This will also remove ${count} product${
            count === 1 ? "" : "s"
          } in it.`
        : `Delete "${c.name}"?`;
    if (!confirm(message)) return;
    await fetch(`/api/categories/${c.id}`, { method: "DELETE" });
    onChange();
  }

  async function rename(c: Category) {
    const newName = prompt("Category name:", c.name);
    if (newName === null) return;
    const newDesc =
      prompt("Category description:", c.description) ?? c.description;
    await fetch(`/api/categories/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, description: newDesc }),
    });
    onChange();
  }

  return (
    <Section
      title="Categories"
      subtitle="Organise your collection. Categories appear on the website."
    >
      <div className="grid gap-8 md:grid-cols-2">
        <form onSubmit={addCategory} className="space-y-4">
          <Field label="New category name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Tables"
              className="w-full rounded-lg border border-sand bg-cream px-3 py-2.5 text-ink outline-none focus:border-clay"
            />
          </Field>
          <Field label="Description (optional)">
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description shown on the homepage."
              className="w-full rounded-lg border border-sand bg-cream px-3 py-2.5 text-ink outline-none focus:border-clay"
            />
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-ink px-5 py-2.5 text-cream hover:bg-espresso disabled:opacity-60"
          >
            {busy ? "Adding…" : "Add category"}
          </button>
        </form>

        <div className="space-y-3">
          {categories.length === 0 ? (
            <p className="text-sm text-espresso/70">No categories yet.</p>
          ) : (
            categories.map((c) => {
              const count = products.filter(
                (p) => p.categoryId === c.id
              ).length;
              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-lg bg-white px-4 py-3 ring-1 ring-sand/60"
                >
                  <div>
                    <p className="font-medium text-ink">{c.name}</p>
                    <p className="text-xs text-espresso/60">
                      {count} {count === 1 ? "product" : "products"}
                    </p>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <button
                      onClick={() => rename(c)}
                      className="text-espresso hover:text-clay"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeCategory(c)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Inbox                                                                      */
/* -------------------------------------------------------------------------- */

function Inbox({
  messages,
  onChange,
}: {
  messages: Message[];
  onChange: () => void;
}) {
  const sorted = [...messages].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

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
    <Section
      title="Enquiries"
      subtitle="Messages sent through the contact form."
    >
      {sorted.length === 0 ? (
        <p className="text-sm text-espresso/70">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {sorted.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl p-5 ring-1 ${
                m.read
                  ? "bg-white ring-sand/60"
                  : "bg-clay/5 ring-clay/40"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-ink">
                    {m.name}
                    {!m.read && (
                      <span className="ml-2 rounded-full bg-clay px-2 py-0.5 text-xs text-white">
                        new
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-espresso/70">
                    <a href={`mailto:${m.email}`} className="hover:text-clay">
                      {m.email}
                    </a>
                    {m.phone && <span> · {m.phone}</span>}
                  </p>
                </div>
                <span className="text-xs text-espresso/50">
                  {new Date(m.createdAt).toLocaleString()}
                </span>
              </div>

              {m.subject && (
                <p className="mt-3 text-sm text-espresso/60">
                  Regarding: <span className="text-ink">{m.subject}</span>
                </p>
              )}
              <p className="mt-2 whitespace-pre-line text-espresso/90">
                {m.message}
              </p>

              <div className="mt-4 flex gap-4 text-sm">
                <button
                  onClick={() => toggleRead(m)}
                  className="text-espresso hover:text-clay"
                >
                  {m.read ? "Mark as unread" : "Mark as read"}
                </button>
                <button
                  onClick={() => remove(m.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Small shared bits                                                          */
/* -------------------------------------------------------------------------- */

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white/60 p-5 ring-1 ring-sand/60 md:p-8">
      <div className="mb-5 md:mb-6">
        <h2 className="font-serif text-xl text-ink md:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-espresso/60">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-espresso">{label}</label>
      {children}
    </div>
  );
}
