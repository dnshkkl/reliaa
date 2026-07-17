import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "About Us — Reliaa Furniture",
  description:
    "Crafting quality furniture since 2000. Founded by Mohd Sajid, Reliaa Furniture is a trusted Indian manufacturer for commercial, hospitality, and residential spaces.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-5 py-12 md:px-6 md:py-20">
        <span className="text-xs uppercase tracking-[0.3em] text-clay">About Us</span>
        <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">
          Crafting Quality Furniture Since 2000
        </h1>

        <div className="prose prose-neutral mt-10 max-w-none text-espresso/80">
          <p className="text-base leading-relaxed md:text-lg">
            Founded by <strong>Mohd Sajid</strong>, Reliaa Furniture is a trusted Indian furniture
            manufacturer dedicated to delivering premium-quality furniture for commercial,
            hospitality, event, and residential spaces. With over two decades of manufacturing
            excellence, we have built a reputation for superior craftsmanship, innovative designs,
            and reliable customer service.
          </p>
          <p className="mt-4 text-base leading-relaxed">
            Operating from our state-of-the-art manufacturing facility in Kanpur Nagar, Uttar
            Pradesh, spread across <strong>50,000+ sq. ft.</strong>, we combine skilled workmanship
            with modern manufacturing techniques to create furniture that is durable, functional,
            and visually appealing.
          </p>
          <p className="mt-4 text-base leading-relaxed">
            Our extensive product range includes banquet sofas, restaurant sofas, outdoor sofas,
            living room sofas, banquet chairs, dining chairs, office chairs, outdoor chairs, center
            tables, dining tables, stools, benches, stage platforms, takhats, and MS truss
            solutions. Every product is designed to meet the highest standards of quality while
            offering customization to suit our customers&apos; unique requirements.
          </p>
          <p className="mt-4 text-base leading-relaxed">
            Over the years, Reliaa Furniture has proudly served hotels, banquet halls, restaurants,
            resorts, event organizers, wedding venues, institutions, and businesses across India.
            Our commitment to quality, timely delivery, and customer satisfaction has made us a
            preferred manufacturing partner for projects of every scale.
          </p>
          <p className="mt-4 text-base leading-relaxed">
            At Reliaa Furniture, we don&apos;t just manufacture furniture — we create long-lasting
            solutions that enhance comfort, style, and functionality. Our mission is to become one
            of India&apos;s most trusted furniture brands by continuously innovating, maintaining
            uncompromising quality, and building lasting relationships with our customers.
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-sand/40 p-7">
            <h2 className="font-serif text-2xl text-ink">Our Vision</h2>
            <p className="mt-3 text-sm leading-relaxed text-espresso/80">
              To become India&apos;s leading furniture manufacturing brand by delivering innovative,
              durable, and aesthetically designed furniture that transforms commercial and
              residential spaces.
            </p>
          </div>
          <div className="rounded-2xl bg-sand/40 p-7">
            <h2 className="font-serif text-2xl text-ink">Our Mission</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-espresso/80">
              <li>• Deliver premium-quality furniture with exceptional craftsmanship.</li>
              <li>• Provide customized solutions to meet every customer&apos;s requirements.</li>
              <li>• Ensure timely manufacturing and nationwide delivery.</li>
              <li>• Build long-term relationships through trust, quality, and excellent service.</li>
              <li>• Continuously innovate to exceed industry standards and customer expectations.</li>
            </ul>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-14">
          <h2 className="font-serif text-3xl text-ink">Why Choose Reliaa Furniture?</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Established", value: "2000" },
              { label: "Founder", value: "Mohd Sajid" },
              { label: "Facility", value: "50,000+ sq. ft." },
              { label: "Reach", value: "Pan India" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border border-sand bg-white p-5 text-center shadow-sm">
                <p className="font-serif text-2xl text-clay">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-espresso/60">{label}</p>
              </div>
            ))}
          </div>
          <ul className="mt-6 grid gap-3 text-sm text-espresso/80 sm:grid-cols-2">
            {[
              "Premium-quality materials and craftsmanship",
              "Customized furniture solutions",
              "Modern manufacturing techniques",
              "Trusted by businesses across India",
              "Reliable delivery and dedicated customer support",
              "Founded by Mohd Sajid",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 text-clay">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
