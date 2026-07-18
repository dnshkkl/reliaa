import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Privacy Policy — Reliaa Furniture",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-serif text-xl text-ink md:text-2xl">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-espresso/80 md:text-base">{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-20">
        <span className="text-xs uppercase tracking-[0.3em] text-clay">Legal</span>
        <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-espresso/60">Effective Date: January 4, 2001</p>

        <p className="mt-6 text-base leading-relaxed text-espresso/80">
          At Reliaa Furniture, we value your trust and are committed to protecting your personal
          information. This Privacy Policy explains how we collect, use, disclose, store, and
          safeguard your information when you visit{" "}
          <a href="https://www.reliaa.in" className="text-clay hover:underline">
            www.reliaa.in
          </a>
          , contact us, request a quotation, place an order, or otherwise interact with our
          business.
        </p>
        <p className="mt-3 text-base leading-relaxed text-espresso/80">
          By using our website or services, you agree to the terms of this Privacy Policy.
        </p>

        <Section title="Information We Collect">
          <p>We may collect the following categories of information:</p>
          <ul className="mt-3 space-y-1 pl-4">
            {[
              "Full Name",
              "Phone Number",
              "Email Address",
              "Company or Business Name (if applicable)",
              "Billing and Shipping Address",
              "Product enquiries and quotation requests",
              "Order and purchase information",
              "Payment details (processed securely through trusted payment providers)",
              "IP Address",
              "Browser type and device information",
              "Cookies and website usage data",
              "Any other information voluntarily provided by you",
            ].map((item) => (
              <li key={item} className="list-disc">{item}</li>
            ))}
          </ul>
        </Section>

        <Section title="How We Use Your Information">
          <p>Your information may be used to:</p>
          <ul className="mt-3 space-y-1 pl-4">
            {[
              "Respond to enquiries and quotation requests.",
              "Process, manufacture, and deliver your orders.",
              "Provide customer support and after-sales service.",
              "Improve our website, products, and customer experience.",
              "Send order updates and service-related communications.",
              "Share promotional offers, newsletters, or marketing communications where legally permitted.",
              "Detect and prevent fraud or unauthorized activities.",
              "Comply with applicable legal and regulatory requirements.",
            ].map((item) => (
              <li key={item} className="list-disc">{item}</li>
            ))}
          </ul>
        </Section>

        <Section title="Legal Basis for Processing">
          <p>Where required by applicable law, we process your personal information based on:</p>
          <ul className="mt-3 space-y-1 pl-4">
            {[
              "Your consent.",
              "Performance of a contract.",
              "Compliance with legal obligations.",
              "Our legitimate business interests, provided your rights are not overridden.",
            ].map((item) => (
              <li key={item} className="list-disc">{item}</li>
            ))}
          </ul>
        </Section>

        <Section title="Cookies and Analytics">
          <p>Our website uses cookies and similar technologies to:</p>
          <ul className="mt-3 space-y-1 pl-4">
            {[
              "Remember your preferences.",
              "Improve website functionality.",
              "Measure website performance.",
              "Understand visitor behaviour through analytics.",
            ].map((item) => (
              <li key={item} className="list-disc">{item}</li>
            ))}
          </ul>
          <p className="mt-3">
            You may disable cookies through your browser settings; however, some features of the
            website may not function properly.
          </p>
        </Section>

        <Section title="Sharing of Information">
          <p>We do not sell, rent, or trade your personal information.</p>
          <p className="mt-3">Your information may be shared only with:</p>
          <ul className="mt-3 space-y-1 pl-4">
            {[
              "Logistics and delivery partners.",
              "Secure payment gateway providers.",
              "IT and website service providers.",
              "Marketing or communication service providers acting on our behalf.",
              "Government authorities or law enforcement agencies where legally required.",
            ].map((item) => (
              <li key={item} className="list-disc">{item}</li>
            ))}
          </ul>
          <p className="mt-3">
            All such parties are expected to maintain appropriate confidentiality and security
            standards.
          </p>
        </Section>

        <Section title="Data Security">
          <p>
            We implement appropriate administrative, technical, and physical safeguards to protect
            your personal information from unauthorized access, disclosure, alteration, or
            destruction.
          </p>
          <p className="mt-3">
            While we strive to use commercially acceptable security measures, no method of
            electronic transmission or storage is completely secure.
          </p>
        </Section>

        <Section title="Data Retention">
          <p>We retain personal information only for as long as necessary to:</p>
          <ul className="mt-3 space-y-1 pl-4">
            {[
              "Complete your transactions.",
              "Provide customer support.",
              "Meet legal and regulatory obligations.",
              "Resolve disputes.",
              "Enforce our agreements.",
            ].map((item) => (
              <li key={item} className="list-disc">{item}</li>
            ))}
          </ul>
          <p className="mt-3">
            After the retention period, information is securely deleted or anonymized where
            appropriate.
          </p>
        </Section>

        <Section title="Your Rights">
          <p>Subject to applicable law, you may have the right to:</p>
          <ul className="mt-3 space-y-1 pl-4">
            {[
              "Access your personal information.",
              "Correct inaccurate or incomplete information.",
              "Request deletion of your personal information.",
              "Withdraw consent where processing is based on consent.",
              "Object to certain processing activities.",
              "Request details regarding how your information is used.",
            ].map((item) => (
              <li key={item} className="list-disc">{item}</li>
            ))}
          </ul>
          <p className="mt-3">
            To exercise these rights, please contact us using the details below.
          </p>
        </Section>

        <Section title="Children's Privacy">
          <p>
            Our website and services are intended for adults and businesses. We do not knowingly
            collect personal information from children. If such information is identified, we will
            take reasonable steps to delete it promptly.
          </p>
        </Section>

        <Section title="Third-Party Websites">
          <p>
            Our website may contain links to third-party websites. We are not responsible for their
            privacy practices or content. We encourage users to review the privacy policies of those
            websites before providing personal information.
          </p>
        </Section>

        <Section title="International Data Transfers">
          <p>
            If your information is processed or stored outside your country, we will take reasonable
            measures to ensure that it receives an appropriate level of protection in accordance
            with applicable laws.
          </p>
        </Section>

        <Section title="Updates to This Privacy Policy">
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our business
            practices or legal requirements. The revised version will be posted on this page along
            with the updated effective date.
          </p>
        </Section>

        <Section title="Contact Us">
          <p>
            If you have any questions, requests, or concerns regarding this Privacy Policy or your
            personal information, please contact us:
          </p>
          <address className="mt-4 not-italic space-y-1">
            <p className="font-semibold text-ink">Reliaa Furniture</p>
            <p>216A &amp; 216B Karmi Bijlamau, Kanpur Lucknow Highway, Behind Avon Dhaba, Unnao – 209862, Uttar Pradesh, India</p>
            <p>
              Phone:{" "}
              <a href="tel:+919235031737" className="text-clay hover:underline">+91 92350 31737</a>
              {", "}
              <a href="tel:+918400862222" className="text-clay hover:underline">+91 84008 62222</a>
            </p>
            <p>
              Email:{" "}
              <a href="mailto:reliaafurniture@gmail.com" className="text-clay hover:underline">
                reliaafurniture@gmail.com
              </a>
            </p>
            <p>
              Website:{" "}
              <a href="https://www.reliaa.in" className="text-clay hover:underline">
                www.reliaa.in
              </a>
            </p>
          </address>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}
