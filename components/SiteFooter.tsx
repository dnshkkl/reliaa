import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-sand/70 bg-espresso text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-2 md:gap-10 md:px-6 md:py-16 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-baseline gap-1">
            <span className="font-script text-3xl">Reliaa</span>
            <span className="h-1.5 w-1.5 rounded-full bg-clay" />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
            Contemporary furniture, thoughtfully curated. Visit our showroom to
            experience the collection in person.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-clay">
            Visit Us
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-cream/80">
            Reliaa Showroom
            <br />
            123 Design Avenue
            <br />
            Your City, 00000
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-clay">
            Get in Touch
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li>
              <a href="tel:+10000000000" className="hover:text-clay">
                +1 (000) 000-0000
              </a>
            </li>
            <li>
              <a href="mailto:hello@reliaa.com" className="hover:text-clay">
                hello@reliaa.com
              </a>
            </li>
            <li className="pt-2">
              <Link href="/collection" className="hover:text-clay">
                Browse the collection →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 px-5 py-4 md:px-6 md:py-6">
        <p className="mx-auto max-w-6xl text-xs text-cream/50">
          © {new Date().getFullYear()} Reliaa. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
