"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const leftLinks = [
  { href: "/", label: "Home" },
  { href: "/collection", label: "Collection" },
];

const rightLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

const allLinks = [...leftLinks, ...rightLinks];

function IcSearch() {
  return (
    <svg className="h-[21px] w-[21px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="M16.5 16.5l4 4" />
    </svg>
  );
}

function IcBag() {
  return (
    <svg className="h-[21px] w-[21px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function IcHamburger() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IcClose() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ReliaaLogo({ mobile }: { mobile?: boolean }) {
  // logo.png: 1426×1504 — chair in top ~50%, so render at 2× height and clip
  const wH = mobile ? 46 : 62;   // wordmark height
  const iH = mobile ? 26 : 34;   // icon container height (slightly taller for visual balance)
  const iImgH = iH * 2;          // render logo.png at 2× so container clips to chair only
  const iW = Math.round(iImgH * (1426 / 1504) * 0.8); // visible width (centre 80%)

  return (
    <span className="flex items-center gap-0">
      {/* Chair icon — clipped to top half (chair only) */}
      <span className="relative block flex-shrink-0 overflow-hidden" style={{ width: iW, height: iH }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt=""
          aria-hidden="true"
          style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", height: iImgH, width: "auto" }}
        />
      </span>

      {/* Wordmark */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/reliaa-wordmark.png"
        alt="Reliaa — Innovation With Style"
        style={{ height: wH, width: "auto", display: "block", marginLeft: "-12px" }}
      />
    </span>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    return href === pathname || (href !== "/" && pathname.startsWith(href));
  }

  const navLinkClass = (href: string) =>
    `text-xs font-medium tracking-[0.15em] uppercase transition-colors hover:text-clay ${
      isActive(href) ? "text-clay" : "text-espresso/60"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white">
      {/* ── Main bar — 3-column grid ─────────────────────────── */}
      <div
        className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-5 md:px-10"
        style={{ height: "clamp(72px, 9vw, 96px)" }}
      >
        {/* LEFT: hamburger (mobile) | nav links (desktop) */}
        <div className="flex items-center gap-7">
          <nav className="hidden md:flex items-center gap-7">
            {leftLinks.map(({ href, label }) => (
              <Link key={href} href={href} className={navLinkClass(href)}>
                {label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center text-espresso/70 hover:text-clay md:hidden"
          >
            {open ? <IcClose /> : <IcHamburger />}
          </button>
        </div>

        {/* CENTER: Geeken-style icon + wordmark logo */}
        <Link href="/" aria-label="Reliaa — Home" className="flex justify-center px-4 md:px-6">
          {/* Desktop logo */}
          <span className="hidden md:flex">
            <ReliaaLogo />
          </span>
          {/* Mobile logo */}
          <span className="flex md:hidden">
            <ReliaaLogo mobile />
          </span>
        </Link>

        {/* RIGHT: nav links (desktop) + icons */}
        <div className="flex items-center justify-end gap-5 md:gap-6">
          <nav className="hidden md:flex items-center gap-7">
            {rightLinks.map(({ href, label }) => (
              <Link key={href} href={href} className={navLinkClass(href)}>
                {label}
              </Link>
            ))}
          </nav>
          <span className="hidden h-4 w-px bg-neutral-200 md:block" />
          <Link
            href="/collection"
            aria-label="Browse collection"
            className="flex h-10 w-10 items-center justify-center text-espresso/60 transition-colors hover:text-clay"
          >
            <IcSearch />
          </Link>
          <Link
            href="/contact"
            aria-label="Enquire"
            className="flex h-10 w-10 items-center justify-center text-espresso/60 transition-colors hover:text-clay"
          >
            <IcBag />
          </Link>
        </div>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────── */}
      {open && (
        <nav className="border-t border-neutral-100 bg-white px-5 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-0.5">
            {allLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-3 text-sm tracking-wide transition-colors hover:bg-neutral-50 hover:text-clay ${
                  isActive(href) ? "text-clay" : "text-espresso/70"
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="mt-4 border-t border-neutral-100 pt-4">
              <Link
                href="/collection"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-clay px-5 py-3 text-center text-sm tracking-wider text-white transition-colors hover:bg-espresso"
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
