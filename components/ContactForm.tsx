"use client";

import { useState } from "react";

export default function ContactForm({
  defaultSubject = "",
}: {
  defaultSubject?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Could not send your message.");
        return;
      }
      form.reset();
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-sand/60">
        <h3 className="font-serif text-2xl text-ink">Thank you</h3>
        <p className="mt-2 text-espresso/70">
          Your message has been sent. We&apos;ll be in touch soon.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 rounded-full border border-ink/20 px-6 py-2.5 text-sm text-ink hover:border-ink"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-sand/60 md:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input
            name="name"
            required
            className="w-full rounded-lg border border-sand bg-cream px-3 py-2.5 text-ink outline-none focus:border-clay"
          />
        </Field>
        <Field label="Email">
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-sand bg-cream px-3 py-2.5 text-ink outline-none focus:border-clay"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone (optional)">
          <input
            name="phone"
            className="w-full rounded-lg border border-sand bg-cream px-3 py-2.5 text-ink outline-none focus:border-clay"
          />
        </Field>
        <Field label="Regarding (optional)">
          <input
            name="subject"
            defaultValue={defaultSubject}
            placeholder="A piece, a project, a general question…"
            className="w-full rounded-lg border border-sand bg-cream px-3 py-2.5 text-ink outline-none focus:border-clay"
          />
        </Field>
      </div>

      <Field label="Message">
        <textarea
          name="message"
          rows={5}
          required
          className="w-full rounded-lg border border-sand bg-cream px-3 py-2.5 text-ink outline-none focus:border-clay"
        />
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-clay px-7 py-3 text-sm text-white transition-colors hover:bg-espresso disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send message"}
      </button>
    </form>
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
