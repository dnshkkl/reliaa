import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactForm from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const { subject } = await searchParams;

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-10 md:px-6 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-clay sm:text-sm">
              Contact
            </span>
            <h1 className="mt-3 font-serif text-4xl text-ink md:mt-4 md:text-5xl">
              Let&apos;s talk
            </h1>
            <p className="mt-3 max-w-md text-base leading-relaxed text-espresso/80 md:mt-4 md:text-lg">
              Visit our showroom or send us a message about any piece or project.
              We&apos;d love to help you find the right furniture for your space.
            </p>

            <div className="mt-8 space-y-5 text-espresso/80 md:mt-10 md:space-y-6">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-clay">
                  Factory Address
                </h3>
                <p className="mt-2 leading-relaxed">
                  216A &amp; 216B Karmi Bijlamau
                  <br />
                  Kanpur Lucknow Highway, Behind Avon Dhaba
                  <br />
                  Unnao – 209862, Uttar Pradesh, India
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-clay">
                  Office Address
                </h3>
                <p className="mt-2 leading-relaxed">
                  53 Sujat Ganj
                  <br />
                  Kanpur Nagar, U.P.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-clay">
                  Phone
                </h3>
                <p className="mt-2 leading-relaxed">
                  <a href="tel:+919235031737" className="hover:text-clay">
                    +91 92350 31737
                  </a>
                  <br />
                  <a href="tel:+918400862222" className="hover:text-clay">
                    +91 84008 62222
                  </a>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-clay">
                  Email
                </h3>
                <p className="mt-2">
                  <a href="mailto:reliaafurniture@gmail.com" className="hover:text-clay">
                    reliaafurniture@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          <ContactForm defaultSubject={subject ?? ""} />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
