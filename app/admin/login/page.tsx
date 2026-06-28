"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Login failed.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-baseline justify-center gap-1">
          <span className="font-script text-4xl text-ink">
            Reliaa
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-clay" />
        </Link>

        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-sand/60">
          <h1 className="font-serif text-2xl text-ink">Admin Sign In</h1>
          <p className="mt-1 text-sm text-espresso/60">
            Manage your furniture collection.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-espresso">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                className="mt-1 w-full rounded-lg border border-sand bg-cream px-3 py-2.5 text-ink outline-none focus:border-clay"
              />
            </div>
            <div>
              <label className="text-sm text-espresso">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="mt-1 w-full rounded-lg border border-sand bg-cream px-3 py-2.5 text-ink outline-none focus:border-clay"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-clay py-2.5 text-white transition-colors hover:bg-espresso disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <Link
          href="/"
          className="mt-6 block text-center text-sm text-espresso/60 hover:text-clay"
        >
          ← Back to website
        </Link>
      </div>
    </main>
  );
}
