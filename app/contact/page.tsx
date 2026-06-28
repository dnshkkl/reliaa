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

      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <span className="text-sm uppercase tracking-[0.3em] text-clay">
              Contact
            </span>
            <h1 className="mt-4 font-serif text-5xl text-ink">
              Let&apos;s talk
            </h1>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-espresso/80">
              Visit our showroom or send us a message about any piece or project.
              We&apos;d love to help you find the right furniture for your space.
            </p>

            <div className="mt-10 space-y-6 text-espresso/80">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-clay">
                  Showroom
                </h3>
                <p className="mt-2 leading-relaxed">
                  Reliaa Showroom
                  <br />
                  123 Design Avenue
                  <br />
                  Your City, 00000
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-clay">
                  Reach us
                </h3>
                <p className="mt-2 leading-relaxed">
                  <a href="tel:+10000000000" className="hover:text-clay">
                    +1 (000) 000-0000
                  </a>
                  <br />
                  <a href="mailto:hello@reliaa.com" className="hover:text-clay">
                    hello@reliaa.com
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
