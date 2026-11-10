import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { useSEO } from "@/hooks/useSEO";
import { fireEvent } from "@/lib/analytics";
import { EmailLink } from "@/components/EmailLink";

export default function PrivacyPage() {
  useSEO({
    title: "Privacy Policy | GulfCDD — Gulf Coast Digital Designs",
    description: "Privacy policy for Gulf Coast Digital Designs, LLC. Learn how we collect, use, and protect your personal information.",
    canonical: "https://www.gulfcdd.com/privacy",
    noindex: true,
  });
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-2 text-sm">Effective Date: August 1, 2025</p>
          <p className="text-muted-foreground mb-12 text-sm">Last Updated: August 2026</p>
          <p className="mb-8 text-muted-foreground leading-relaxed">
            Wondering what happens to the details you send us? This policy explains what we collect,
            how we use it, which providers are involved, and how to ask about your information.
            If something isn't clear, email us using the contact details at the end.
          </p>

          <div className="prose max-w-none space-y-10 text-muted-foreground leading-relaxed">

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">1. Introduction</h2>
              <p>Gulf Coast Digital Designs, LLC ("GulfCDD," "we," "us," or "our") is a Mississippi limited liability company headquartered on the Mississippi Gulf Coast. We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains what information we collect, how we use it, with whom we share it, and what choices you have.</p>
              <p className="mt-3">This Policy applies to all information collected through our website located at gulfcdd.com and any related services, sales, marketing, or events (collectively, the "Services"). By accessing or using our Services, you acknowledge that you have read, understood, and agree to the practices described in this Privacy Policy.</p>
              <p className="mt-3">If you do not agree with the terms of this Privacy Policy, please do not use our Services.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">2. Information We Collect</h2>
              <p className="font-semibold text-foreground mt-4 mb-2">A. Information You Provide Directly</p>
              <p>We collect information you provide when you contact us, fill out a form, request a quote, purchase a service, or communicate with us. This may include:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
                <li>Full name and business name</li>
                <li>Email address and phone number</li>
                <li>Mailing or billing address</li>
                <li>Project details, service preferences, and budget information</li>
                <li>Messages, feedback, and correspondence</li>
              </ul>
              <p className="font-semibold text-foreground mt-4 mb-2">B. Payment Information</p>
              <p>All payment transactions are processed by Stripe, Inc., a third-party payment processor. We do not directly collect, store, or have access to your full credit card number, bank account details, or other sensitive payment data. Stripe is PCI-DSS compliant. You can review Stripe's privacy practices at stripe.com/privacy.</p>
              <p className="font-semibold text-foreground mt-4 mb-2">C. Information Collected Automatically</p>
              <p>When you visit our website, we and our service providers may automatically collect certain technical information, including:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
                <li>IP address and approximate geographic location</li>
                <li>Browser type, version, and operating system</li>
                <li>Pages visited, time spent on pages, and referring URLs</li>
                <li>Device identifiers and usage patterns</li>
              </ul>
              <p className="font-semibold text-foreground mt-4 mb-2">D. Cookies and Tracking Technologies</p>
              <p>We use cookies and similar technologies (such as web beacons and pixel tags) to operate our site, analyze traffic, and improve user experience. You can set your browser to refuse cookies, though some features of the site may not function properly as a result. We do not use third-party advertising cookies or cross-site tracking pixels for marketing purposes without your explicit consent.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
              <p>We use the information we collect for the following purposes:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
                <li>To respond to inquiries, provide quotes, and communicate with you about your project</li>
                <li>To deliver, manage, and improve our services</li>
                <li>To process payments and send billing and account-related communications</li>
                <li>To send you service updates, maintenance notices, or administrative messages</li>
                <li>To comply with applicable laws and legal obligations</li>
                <li>To detect, prevent, and address fraud, security incidents, or technical issues</li>
                <li>To analyze usage trends and improve our website and service offerings</li>
              </ul>
              <p className="mt-3">We will not use your information for any purpose that is incompatible with the purposes listed above without your consent.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">4. How We Share Your Information</h2>
              <p>We do not sell, rent, or trade your personal information to third parties for their marketing purposes. We may share your information only in the following circumstances:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
                <li><strong>Service Providers:</strong> We share information with trusted vendors and service providers (e.g., Stripe for payments, hosting providers, email delivery services) who assist us in operating our business. These parties are contractually obligated to keep your information confidential and use it only as directed by us.</li>
                <li><strong>Legal Compliance:</strong> We may disclose your information if required by law, court order, or governmental authority, or if we believe disclosure is necessary to protect the rights, property, or safety of GulfCDD, our clients, or others.</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction. We will notify you via email and/or a prominent notice on our website before your information becomes subject to a different privacy policy.</li>
                <li><strong>With Your Consent:</strong> We may share your information with other third parties when you give us explicit permission to do so.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">5. Data Retention</h2>
              <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Specifically:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
                <li>Contact and project information is retained for the duration of our business relationship plus up to 3 years after the last interaction</li>
                <li>Billing and transaction records are retained for a minimum of 7 years for tax and accounting purposes</li>
                <li>Website analytics data is retained in aggregated, anonymized form indefinitely</li>
              </ul>
              <p className="mt-3">If you request deletion of your information, we will delete or anonymize it within 30 days, except where we are required by law to retain it.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">6. Children's Privacy (COPPA)</h2>
              <p>Our Services are not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If we learn that we have collected personal information from a child under 13 without verification of parental consent, we will take steps to delete that information as quickly as possible. If you believe we may have collected information from or about a child under 13, please contact us immediately at aultman@gulfcoastdigitaldesign.com.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">7. Mississippi Privacy Rights and Data Breach Notification</h2>
              <p>GulfCDD is based in Mississippi and operates primarily under Mississippi law. Mississippi does not currently have a comprehensive consumer data privacy statute comparable to those enacted in California or Virginia. Nevertheless, GulfCDD voluntarily extends the following data rights to all clients and website visitors, regardless of their state of residence:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
                <li><strong>Right to Access:</strong> You may request a summary of the personal information we hold about you.</li>
                <li><strong>Right to Correction:</strong> You may request that we correct inaccurate or incomplete personal information.</li>
                <li><strong>Right to Deletion:</strong> You may request that we delete your personal information, subject to our legal retention obligations.</li>
                <li><strong>Right to Opt-Out of Marketing:</strong> You may opt out of marketing communications at any time by contacting us or using the unsubscribe link in any marketing email.</li>
              </ul>
              <p className="mt-3">To exercise any of these rights, contact us at <EmailLink className="text-accent hover:underline">aultman@gulfcoastdigitaldesign.com</EmailLink>. We will respond within 30 days.</p>
              <p className="mt-3"><strong>Data Breach Notification (Miss. Code Ann. § 75-24-29):</strong> In the event of a security breach involving the unauthorized acquisition of unencrypted personal information of Mississippi residents, GulfCDD will notify affected Mississippi residents as expeditiously as possible and within no more than 45 days of discovering the breach, consistent with the requirements of the Mississippi Security Breach Notification Law (Miss. Code Ann. § 75-24-29). Notification will be provided by email (where we have your email address on file) or by written notice. If the breach affects a large number of residents or if direct notification is not feasible, we may provide substitute notice through our website or statewide media, as permitted by law. We will also notify the Mississippi Attorney General's office as required.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">8. California Privacy Rights (CCPA / CPRA) — California Residents Only</h2>
              <p>This section applies only to residents of the State of California. If you are a California resident, you have the following rights under the California Consumer Privacy Act (CCPA), as amended by the California Privacy Rights Act (CPRA):</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
                <li><strong>Right to Know:</strong> You have the right to request that we disclose what personal information we have collected about you, the sources, the business purpose for collection, and the categories of third parties with whom we share it.</li>
                <li><strong>Right to Delete:</strong> You have the right to request deletion of personal information we have collected from you, subject to certain exceptions.</li>
                <li><strong>Right to Correct:</strong> You have the right to request that we correct inaccurate personal information we maintain about you.</li>
                <li><strong>Right to Opt-Out of Sale:</strong> We do not sell personal information. However, you may contact us to confirm your data has not been sold.</li>
                <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising any of your CCPA rights.</li>
              </ul>
              <p className="mt-3">To exercise your California privacy rights, please contact us at <EmailLink className="text-accent hover:underline">aultman@gulfcoastdigitaldesign.com</EmailLink>. We will respond to verified requests within 45 days.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">9. CAN-SPAM Compliance</h2>
              <p>We comply with the CAN-SPAM Act. Any commercial email we send will clearly identify GulfCDD as the sender, include a physical mailing address, and provide a clear and conspicuous unsubscribe mechanism. We honor opt-out requests within 10 business days. We do not use deceptive subject lines or headers.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">10. Data Security</h2>
              <p>We implement commercially reasonable administrative, technical, and physical safeguards to protect the personal information we collect against unauthorized access, disclosure, alteration, or destruction. These measures include SSL/TLS encryption for data in transit, access controls, and secure data storage practices.</p>
              <p className="mt-3">However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security. In the event of a data breach that affects your personal information, we will notify you in accordance with applicable law, including the Mississippi Security Breach Notification Law (Miss. Code Ann. § 75-24-29) where applicable.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">11. Third-Party Links</h2>
              <p>Our website may contain links to third-party websites, services, or applications that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites. We encourage you to review the privacy policies of any third-party sites you visit.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">12. Your Rights and Choices</h2>
              <p>Regardless of your location, you have the right to:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Withdraw consent where processing is based on consent</li>
                <li>Opt out of marketing communications at any time</li>
              </ul>
              <p className="mt-3">To exercise any of these rights, please email us at <EmailLink className="text-accent hover:underline">aultman@gulfcoastdigitaldesign.com</EmailLink>. We will respond within 30 days.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">13. Changes to This Privacy Policy</h2>
              <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will notify you by updating the "Last Updated" date at the top of this page and, where appropriate, by sending a notice to the email address on file. Your continued use of our Services after any changes constitutes your acceptance of the updated Privacy Policy.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">14. Contact Us</h2>
              <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
              <div className="mt-3 space-y-1">
                <p><strong>Gulf Coast Digital Designs, LLC</strong></p>
                <p>Mississippi Gulf Coast</p>
                <p>Email: <EmailLink className="text-accent hover:underline">aultman@gulfcoastdigitaldesign.com</EmailLink></p>
                <p>Phone: <a href="tel:2282787782" className="text-accent hover:underline" onClick={() => fireEvent("phone_call", { location: "privacy_page" })}>(228) 278-7782</a></p>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
