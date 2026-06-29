"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/collection", label: "Collection" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-sand/70 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2 md:px-6 md:py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Reliaa"
            width={56}
            height={72}
            className="h-14 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          {links.map((link) => {
            const active =
              link.href === pathname ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide transition-colors hover:text-clay ${
                  active ? "text-clay" : "text-espresso"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/collection"
            className="rounded-full bg-clay px-5 py-2 text-sm text-white transition-colors hover:bg-espresso"
          >
            View Collection
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-sand md:hidden"
        >
          <span className="text-base leading-none">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="border-t border-sand/70 bg-cream px-5 pb-5 pt-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => {
              const active =
                link.href === pathname ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-sand/40 hover:text-clay ${
                    active ? "text-clay" : "text-espresso"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-3 border-t border-sand/60 pt-3">
              <Link
                href="/collection"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-clay px-5 py-2.5 text-center text-sm text-white hover:bg-espresso"
              >
                View Collection
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
