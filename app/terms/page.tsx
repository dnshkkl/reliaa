import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Terms & Conditions — Reliaa Furniture",
};

function Section({ num, title, children }: { num?: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-serif text-xl text-ink md:text-2xl">
        {num ? `${num}. ${title}` : title}
      </h2>
      <div className="mt-3 text-sm leading-relaxed text-espresso/80 md:text-base">{children}</div>
    </section>
  );
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-1 pl-4">
      {items.map((item) => (
        <li key={item} className="list-disc">{item}</li>
      ))}
    </ul>
  );
}

export default function TermsPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-20">
        <span className="text-xs uppercase tracking-[0.3em] text-clay">Legal</span>
        <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">Terms &amp; Conditions</h1>
        <p className="mt-3 text-sm text-espresso/60">Effective Date: January 4, 2001</p>

        <p className="mt-6 text-base leading-relaxed text-espresso/80">
          These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to and use of the website{" "}
          <a href="https://www.reliaa.in" className="text-clay hover:underline">www.reliaa.in</a>{" "}
          and all products and services offered by Reliaa Furniture (&quot;Reliaa&quot;, &quot;we&quot;,
          &quot;our&quot;, or &quot;us&quot;).
        </p>
        <p className="mt-3 text-base leading-relaxed text-espresso/80">
          By accessing or using our website, requesting a quotation, placing an order, or using any
          of our services, you acknowledge that you have read, understood, and agreed to be bound by
          these Terms. If you do not agree with these Terms, you must discontinue use of our website
          and services immediately.
        </p>

        <Section num="1" title="Company Information">
          <address className="not-italic space-y-1">
            <p className="font-semibold text-ink">Reliaa Furniture</p>
            <p>Founded by Mohd Sajid — Manufacturer &amp; Supplier of Premium Furniture</p>
            <p className="mt-2">
              Factory Address: 216A &amp; 216B Karmi Bijlamau, Kanpur Lucknow Highway, Behind Avon Dhaba,
              Unnao – 209862
            </p>
            <p>
              Website:{" "}
              <a href="https://www.reliaa.in" className="text-clay hover:underline">www.reliaa.in</a>
            </p>
            <p>
              Email:{" "}
              <a href="mailto:reliaafurniture@gmail.com" className="text-clay hover:underline">
                reliaafurniture@gmail.com
              </a>
            </p>
            <p>
              Phone:{" "}
              <a href="tel:+919235031737" className="text-clay hover:underline">+91 92350 31737</a>
              {", "}
              <a href="tel:+918400862222" className="text-clay hover:underline">+91 84008 62222</a>
            </p>
          </address>
        </Section>

        <Section num="2" title="Products and Services">
          <p>Reliaa Furniture manufactures and supplies premium-quality furniture, including but not limited to:</p>
          <Ul items={[
            "Banquet Furniture", "Restaurant Furniture", "Hotel Furniture", "Outdoor Furniture",
            "Living Room Furniture", "Office Furniture", "Custom-Made Furniture", "Event Furniture",
            "Tables", "Chairs", "Sofas", "Stage Platforms", "MS Truss Solutions", "Benches and Stools",
          ]} />
          <p className="mt-3">Product availability may change without prior notice.</p>
        </Section>

        <Section num="3" title="Product Images and Descriptions">
          <p>
            Product photographs, illustrations, and descriptions displayed on our website are
            provided for general informational and illustrative purposes only.
          </p>
          <p className="mt-3">
            Actual product color, fabric, polish, wood grain, texture, finish, dimensions, and
            appearance may vary slightly due to lighting conditions, screen resolution, material
            characteristics, or manufacturing process. Such variations shall not be considered
            defects.
          </p>
        </Section>

        <Section num="4" title="Pricing">
          <p>All prices are subject to change without prior notice.</p>
          <p className="mt-3">Prices displayed on the website may exclude the following, unless expressly stated otherwise:</p>
          <Ul items={[
            "Transportation charges",
            "Installation charges",
            "GST, where applicable",
            "Packaging charges",
            "Customization charges",
          ]} />
          <p className="mt-3">Final quotations will be shared before order confirmation.</p>
        </Section>

        <Section num="5" title="Orders and Order Confirmation">
          <p>Orders shall be deemed confirmed only upon satisfaction of all of the following conditions:</p>
          <ol className="mt-3 space-y-1 pl-4 list-decimal">
            <li>Quotation approval by the customer;</li>
            <li>Advance payment, where applicable; and</li>
            <li>Written confirmation by Reliaa Furniture.</li>
          </ol>
          <p className="mt-3">
            We reserve the right to refuse, suspend, or cancel any order in the event of pricing
            errors, stock limitations, incorrect information, payment issues, or any unforeseen
            circumstances.
          </p>
        </Section>

        <Section num="6" title="Custom Furniture">
          <p>Customized furniture is manufactured strictly in accordance with customer specifications and approved requirements.</p>
          <p className="mt-3">Once production has commenced:</p>
          <Ul items={[
            "Orders cannot be cancelled.",
            "Design changes may not be accepted.",
            "Advance payments are generally non-refundable unless otherwise agreed in writing by Reliaa Furniture.",
          ]} />
        </Section>

        <Section num="7" title="Payment Terms">
          <p>Payments may be accepted through the following methods:</p>
          <Ul items={[
            "Bank Transfer",
            "UPI",
            "Online Payment",
            "Cheque, subject to clearance",
            "Other approved payment methods",
          ]} />
          <p className="mt-3">Certain orders may require advance payment before production begins.</p>
        </Section>

        <Section num="8" title="Delivery">
          <p>Estimated delivery timelines are provided for reference only and are not guaranteed.</p>
          <p className="mt-3">Delivery may be delayed due to circumstances including, but not limited to:</p>
          <Ul items={[
            "Material availability",
            "Transportation issues",
            "Natural disasters",
            "Government restrictions",
            "Force majeure events",
            "Unforeseen manufacturing delays",
          ]} />
          <p className="mt-3">
            Reliaa Furniture shall not be liable for reasonable delivery delays caused by
            circumstances beyond our control.
          </p>
        </Section>

        <Section num="9" title="Shipping, Installation & Risk Transfer">
          <p>
            Reliaa Furniture will arrange dispatch and delivery of the goods based on the agreed
            order terms, delivery location, and product type. Unless otherwise agreed in writing,
            transportation and installation charges shall be borne by the customer.
          </p>
          <p className="mt-3">
            The customer is responsible for ensuring that the delivery location is accessible, safe,
            and ready to receive the goods.
          </p>
          <p className="mt-3">
            Ownership and risk of the goods shall transfer to the customer upon delivery at the
            agreed location and acceptance by the customer or their authorized representative. If
            the customer arranges pickup or nominates a third-party transporter, risk transfers once
            the goods are handed over to such transporter.
          </p>
          <p className="mt-3">
            After ownership and risk have transferred, Reliaa Furniture shall not be responsible
            for any loss, damage, theft, or delay occurring during transit, unloading, or
            post-delivery handling.
          </p>
        </Section>

        <Section num="10" title="Inspection and Reporting of Issues">
          <p>Customers are advised to inspect products immediately upon delivery.</p>
          <p className="mt-3">
            Any visible damage, shortage, or manufacturing issue must be reported within{" "}
            <strong>48 hours of delivery</strong>. Claims submitted after this period may not be
            accepted.
          </p>
        </Section>

        <Section num="11" title="Warranty">
          <p>Where applicable, warranty coverage is limited to manufacturing defects only.</p>
          <p className="mt-3">Warranty does not cover:</p>
          <Ul items={[
            "Normal wear and tear", "Fabric damage", "Mishandling", "Water damage",
            "Fire damage", "Chemical exposure", "Improper use", "Unauthorized repairs",
            "Accidental damage",
          ]} />
          <p className="mt-3">Warranty terms may vary depending on the product.</p>
        </Section>

        <Section num="12" title="Intellectual Property Rights">
          <p>
            All content on this website — including the logo, brand name, images, videos, graphics,
            product descriptions, catalogues, designs, and text — is the exclusive property of
            Reliaa Furniture and is protected under applicable intellectual property laws.
          </p>
          <p className="mt-3">
            Unauthorized copying, reproduction, distribution, modification, or commercial use of
            any content is strictly prohibited.
          </p>
        </Section>

        <Section num="13" title="User Responsibilities">
          <p>Users agree not to:</p>
          <Ul items={[
            "Misuse the website",
            "Upload harmful software or malicious code",
            "Attempt unauthorized access",
            "Violate applicable laws",
            "Infringe intellectual property rights",
            "Use the website for fraudulent purposes",
          ]} />
        </Section>

        <Section num="14" title="Third-Party Links">
          <p>
            Our website may contain links to third-party websites for convenience. Reliaa Furniture
            is not responsible for the content, privacy practices, accuracy, or services of any
            external websites. Access to third-party websites is at your own risk.
          </p>
        </Section>

        <Section num="15" title="Limitation of Liability">
          <p>To the fullest extent permitted by law, Reliaa Furniture shall not be liable for:</p>
          <Ul items={[
            "Indirect losses or consequential damages",
            "Loss of business or profits",
            "Delays beyond our control",
            "Technical interruptions or website downtime",
          ]} />
          <p className="mt-3">
            Our maximum liability, if any, shall not exceed the value of the product purchased
            from us.
          </p>
        </Section>

        <Section num="16" title="Indemnification">
          <p>
            You agree to indemnify, defend, and hold harmless Reliaa Furniture, its directors,
            employees, representatives, and affiliates from and against any claims, damages,
            liabilities, losses, or expenses arising out of your misuse of the website, violation
            of these Terms, breach of applicable law, or infringement of any third-party rights.
          </p>
        </Section>

        <Section num="17" title="Privacy">
          <p>
            Your use of this website is also governed by our{" "}
            <a href="/privacy-policy" className="text-clay hover:underline">Privacy Policy</a>.
            By using our website, you consent to the collection and use of information as described
            in that policy.
          </p>
        </Section>

        <Section num="18" title="Changes to These Terms">
          <p>
            Reliaa Furniture reserves the right to modify, update, or replace these Terms &amp;
            Conditions at any time without prior notice. Any changes will become effective
            immediately upon publication on this website. Continued use of the website after changes
            are posted constitutes acceptance of the updated Terms.
          </p>
        </Section>

        <Section num="19" title="Governing Law and Jurisdiction">
          <p>
            These Terms &amp; Conditions shall be governed by and construed in accordance with the
            laws of India. Any disputes arising out of or in connection with these Terms shall be
            subject to the exclusive jurisdiction of the competent courts located in{" "}
            <strong>Kanpur Nagar, Uttar Pradesh</strong>.
          </p>
        </Section>

        <Section num="20" title="Contact Us">
          <p>If you have any questions regarding these Terms &amp; Conditions, please contact us:</p>
          <address className="mt-4 not-italic space-y-1">
            <p className="font-semibold text-ink">Reliaa Furniture</p>
            <p>
              Email:{" "}
              <a href="mailto:reliaafurniture@gmail.com" className="text-clay hover:underline">
                reliaafurniture@gmail.com
              </a>
            </p>
            <p>
              Phone:{" "}
              <a href="tel:+919235031737" className="text-clay hover:underline">+91 92350 31737</a>
              {", "}
              <a href="tel:+918400862222" className="text-clay hover:underline">+91 84008 62222</a>
            </p>
            <p>
              Website:{" "}
              <a href="https://www.reliaa.in" className="text-clay hover:underline">www.reliaa.in</a>
            </p>
          </address>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}
