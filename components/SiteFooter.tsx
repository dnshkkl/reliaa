import Link from "next/link";
import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-sand/70 bg-espresso text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-2 md:gap-10 md:px-6 md:py-16 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Image
            src="/logo.png"
            alt="Reliaa"
            width={100}
            height={130}
            className="h-24 w-auto object-contain brightness-0 invert"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
            Premium furniture manufacturer crafting quality pieces since 2000.
            Founded by Mohd Sajid, Unnao, Uttar Pradesh.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-clay">
            Visit Us
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-cream/80">
            214 Karmi Bijlamau
            <br />
            Kanpur Lucknow Highway
            <br />
            Next to Avon Dhaba
            <br />
            Unnao – 209862, U.P.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-clay">
            Get in Touch
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li>
              <a href="tel:+919235031737" className="hover:text-clay">
                +91 92350 31737
              </a>
            </li>
            <li>
              <a href="tel:+918318734783" className="hover:text-clay">
                +91 83187 34783
              </a>
            </li>
            <li>
              <a href="mailto:reliaafurniture@gmail.com" className="hover:text-clay">
                reliaafurniture@gmail.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-clay">
            Company
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li><Link href="/about" className="hover:text-clay">About Us</Link></li>
            <li><Link href="/collection" className="hover:text-clay">Collection</Link></li>
            <li><Link href="/projects" className="hover:text-clay">Projects</Link></li>
            <li><Link href="/contact" className="hover:text-clay">Contact</Link></li>
            <li className="pt-2">
              <Link href="/privacy-policy" className="hover:text-clay">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-clay">Terms &amp; Conditions</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 px-5 py-4 md:px-6 md:py-6">
        <p className="mx-auto max-w-6xl text-xs text-cream/50">
          © {new Date().getFullYear()} Reliaa Furniture. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
