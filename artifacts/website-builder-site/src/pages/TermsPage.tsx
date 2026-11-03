import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { useSEO } from "@/hooks/useSEO";
import { fireEvent } from "@/lib/analytics";
import { EmailLink } from "@/components/EmailLink";

export default function TermsPage() {
  useSEO({
    title: "Terms of Service | GulfCDD — Gulf Coast Digital Designs",
    description: "Terms of service for Gulf Coast Digital Designs, LLC. Read our service agreement, payment terms, and cancellation policy.",
    canonical: "https://www.gulfcdd.com/terms",
    noindex: true,
  });
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4 leading-tight">
            Terms of Service
          </h1>
          <p className="text-muted-foreground mb-2 text-sm">Effective Date: August 1, 2025</p>
          <p className="text-muted-foreground mb-12 text-sm">Last Updated: August 2026</p>
          <p className="mb-8 text-muted-foreground leading-relaxed">
            Before you hire us, read these terms alongside your written project agreement.
            They explain payments, ownership, cancellations, and each side's responsibilities.
            If you have a question, ask before approving the work. This introduction doesn't replace the terms below.
          </p>

          <div className="prose max-w-none space-y-10 text-muted-foreground leading-relaxed">

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>These Terms of Service ("Terms") constitute a legally binding agreement between you ("Client," "you," or "your") and Gulf Coast Digital Designs, LLC ("GulfCDD," "we," "us," or "our"), a Mississippi limited liability company, governing your access to and use of our website design, development, hosting, maintenance, and related services (collectively, the "Services").</p>
              <p className="mt-3">By engaging our Services, submitting a contact form, signing a project agreement, making a payment, or otherwise indicating your acceptance, you agree to be bound by these Terms. If you are entering into these Terms on behalf of a company or other legal entity, you represent that you have the authority to bind that entity. If you do not agree to these Terms, do not use our Services.</p>
              <p className="mt-3">GulfCDD's Services are custom professional and business-to-business services. They are not consumer goods offered for sale to the general public in a retail context, and nothing in these Terms shall be construed to create a consumer-goods transaction subject to the Mississippi Consumer Protection Act (Miss. Code Ann. § 75-24-1 et seq.) in a manner inconsistent with the professional and commercial nature of the Services. GulfCDD does not engage in unfair or deceptive trade practices and complies with all applicable provisions of the Mississippi Consumer Protection Act.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">2. Services Description</h2>
              <p>GulfCDD provides custom website design, development, hosting, maintenance, and digital services to businesses and individuals. The specific scope of services, deliverables, timeline, and pricing for each project are agreed upon in writing prior to the commencement of work through a project agreement, proposal, or email confirmation (collectively, the "Project Agreement").</p>
              <p className="mt-3">We reserve the right to modify, suspend, or discontinue any aspect of our Services at any time with reasonable notice. We will not be liable to you or any third party for any modification, suspension, or discontinuation of Services where we have provided reasonable prior notice.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibient text-foreground mb-3">3. Eligibility</h2>
              <p>You must be at least 18 years of age and have the legal capacity to enter into a binding contract to use our Services. By engaging our Services, you represent and warrant that you meet these requirements. If you are entering into these Terms on behalf of a business, you warrant that you are authorized to bind that business to these Terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">4. Fees, Payment, and Billing</h2>
              <p>All fees are as quoted in the applicable Project Agreement. Fees are denominated in U.S. dollars and are subject to applicable taxes.</p>
              <p className="mt-3"><strong>One-Time Build Fees:</strong> Build fees are due as specified in the Project Agreement. Unless otherwise stated, a deposit may be required before work begins, with the remaining balance due upon project completion prior to launch.</p>
              <p className="mt-3"><strong>Monthly Recurring Fees:</strong> Hosting, maintenance, and care plan fees are billed on a recurring monthly basis on or around the same calendar date each month. By enrolling in a recurring plan, you authorize us to charge your payment method on file each billing cycle until you cancel in accordance with Section 5.</p>
              <p className="mt-3"><strong>Payment Processing:</strong> All payments are processed through Stripe, Inc. You authorize us to charge your designated payment method for all applicable fees. You agree to provide accurate and current payment information and to update it promptly if it changes.</p>
              <p className="mt-3"><strong>Late Payments:</strong> If a payment fails, we will notify you promptly and allow a 7-day grace period to update your payment method. If payment is not received within the grace period, we reserve the right to suspend services without further notice until your account is made current. Overdue balances accrue interest at the legal rate of eight percent (8%) per annum under Miss. Code Ann. § 75-17-1 from the date payment was first due until paid in full.</p>
              <p className="mt-3"><strong>Disputed Charges and Chargebacks:</strong> If you believe a charge is in error, you must notify us in writing at <EmailLink className="text-accent hover:underline">aultman@gulfcoastdigitaldesign.com</EmailLink> within 30 days of the charge date, and we will investigate and work in good faith to resolve the dispute. Initiating a chargeback or payment reversal through your bank or card issuer without first contacting GulfCDD and exhausting our internal dispute process constitutes a material breach of these Terms. In the event of an unauthorized chargeback, GulfCDD reserves the right to (a) immediately suspend all Services; (b) recover the reversed amount together with any chargeback fees assessed against us; (c) pursue collection of all amounts owed, including reasonable attorneys' fees and collection costs; and (d) charge interest on the outstanding balance at the rate of 8% per annum pursuant to Miss. Code Ann. § 75-17-1 from the date the chargeback was initiated.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">5. Cancellation, Refund, and Liquidated Damages</h2>
              <p><strong>Monthly Plans — No Contracts. Cancel Anytime.</strong> Monthly hosting, maintenance, and care plans have no contracts or minimum commitment. You may cancel anytime by contacting <EmailLink className="text-accent hover:underline">aultman@gulfcoastdigitaldesign.com</EmailLink>. No advance notice is required. Cancellation stops future renewals, and service continues through the end of the billing period already paid for. No refunds are issued for partial months. One-time build projects follow the separate terms below.</p>
              <p className="mt-3"><strong>Build Projects — Cancellation Before Work Commences:</strong> If you cancel a project before work has commenced, any deposit paid will be refunded in full within 10 business days.</p>
              <p className="mt-3"><strong>Build Projects — Cancellation After Work Has Commenced:</strong> If you cancel a project after work has commenced, you will be billed for all work completed to that point at our standard hourly rate. In addition, because early cancellation after significant work has commenced causes GulfCDD to incur losses that are difficult to calculate precisely (including but not limited to reserved capacity, partially completed custom work with diminished resale value, and third-party costs incurred on your behalf), the parties agree that a liquidated damages amount equal to twenty-five percent (25%) of the remaining unpaid contract value at the time of cancellation is a reasonable estimate of GulfCDD's anticipated losses and is not a penalty. This liquidated damages amount is due and payable upon cancellation. Any deposit balance remaining after application of hourly charges and liquidated damages will be refunded within 10 business days. No refunds are issued for completed build work that has been approved and launched.</p>
              <p className="mt-3"><strong>Non-Refundable Items:</strong> Domain registration fees, third-party software licenses purchased on your behalf, and fees paid to external service providers are non-refundable.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">6. Electronic Signatures and Records (Mississippi UETA)</h2>
              <p>GulfCDD conducts business electronically. Pursuant to the Mississippi Uniform Electronic Transactions Act (Miss. Code Ann. § 75-12-1 et seq.) ("Mississippi UETA"), the parties agree that:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
                <li>Electronic signatures on Project Agreements, proposals, acceptance-click confirmations, and any amendments are legally valid and binding to the same extent as handwritten signatures.</li>
                <li>Electronic records, including emails, portal-based acceptances, and digitally signed documents, satisfy any requirement that an agreement be "in writing" under applicable law.</li>
                <li>Your act of clicking "Accept," "Agree," "Submit," or similar confirmation buttons, or of making a payment following receipt of a proposal, constitutes your electronic signature and your binding acceptance of the terms presented at that time.</li>
                <li>You consent to receive records, notices, and disclosures related to the Services electronically. You may withdraw this consent at any time by contacting us in writing, but doing so may affect your ability to use our Services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">7. Intellectual Property and Ownership</h2>
              <p><strong>Client Content:</strong> You retain all ownership rights to content you provide to us, including text, images, logos, trademarks, and other materials ("Client Content"). You grant us a limited, non-exclusive license to use Client Content solely for the purpose of performing the Services.</p>
              <p className="mt-3"><strong>Deliverables:</strong> Upon receipt of full payment for a project, you will own all custom design elements and content created specifically for your project. Ownership transfers only upon payment in full.</p>
              <p className="mt-3"><strong>Third-Party Components:</strong> Our work may incorporate open-source software, licensed fonts, stock photography, plugins, or other third-party materials. Your use of such components is subject to their respective licenses, and we make no warranty regarding your rights to use those components beyond what is provided by their respective licenses.</p>
              <p className="mt-3"><strong>GulfCDD Property:</strong> We retain ownership of all pre-existing tools, frameworks, templates, code libraries, and proprietary methodologies used in delivering the Services. Nothing in these Terms transfers any rights in our underlying intellectual property.</p>
              <p className="mt-3"><strong>Portfolio Rights:</strong> Unless you request otherwise in writing, we reserve the right to display your completed website as part of our portfolio and to reference you as a client for marketing purposes.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">8. Client Responsibilities and Acceptable Use</h2>
              <p>You agree to:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
                <li>Provide accurate, current, and complete information about your business and project</li>
                <li>Respond to requests for feedback, approvals, and content in a timely manner</li>
                <li>Ensure that all content you provide does not infringe on any third-party intellectual property rights, violate any applicable law, or constitute false or misleading advertising</li>
                <li>Keep your payment and contact information current</li>
                <li>Not use any website or service we create for you for unlawful, harmful, abusive, or fraudulent purposes</li>
                <li>Not attempt to gain unauthorized access to our systems or those of our service providers</li>
              </ul>
              <p className="mt-3">We reserve the right to refuse, suspend, or terminate services if we determine, in our sole discretion, that your use of our Services violates any applicable law or these Terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">9. Turnaround Times and Delivery</h2>
              <p>Estimated turnaround times are provided in good faith and are not guarantees. Project timelines depend on the scope of work, client responsiveness, and the timely delivery of required materials. We are not liable for delays caused by your failure to provide necessary information, approvals, or content in a timely manner. Time-sensitive projects may be accommodated with advance notice and are subject to additional fees.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">10. Third-Party Services</h2>
              <p>Our Services may involve or recommend the use of third-party services, platforms, and tools (such as hosting providers, domain registrars, Google Analytics, Stripe, and others). We are not responsible for the availability, accuracy, or reliability of any third-party services. Your use of third-party services is governed solely by the terms and policies of those third parties. We make no warranties or representations regarding any third-party services and disclaim all liability arising from your use of them.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">11. DISCLAIMER OF WARRANTIES</h2>
              <p className="uppercase font-semibold">THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, GULFCDD EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.</p>
              <p className="mt-3 uppercase font-semibold">GULFCDD DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. GULFCDD DOES NOT WARRANT THAT ANY WEBSITE WE CREATE WILL ACHIEVE ANY PARTICULAR SEARCH ENGINE RANKING, BUSINESS RESULT, OR LEVEL OF TRAFFIC.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">12. LIMITATION OF LIABILITY</h2>
              <p className="uppercase font-semibold">TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL GULFCDD, ITS OWNERS, OFFICERS, EMPLOYEES, CONTRACTORS, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, LOSS OF REVENUE, LOSS OF DATA, LOSS OF GOODWILL, OR BUSINESS INTERRUPTION, ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICES, EVEN IF GULFCDD HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
              <p className="mt-3 uppercase font-semibold">IN ANY EVENT, GULFCDD'S TOTAL CUMULATIVE LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICES SHALL NOT EXCEED THE TOTAL FEES YOU PAID TO GULFCDD IN THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM.</p>
              <p className="mt-3">Some jurisdictions do not allow the limitation or exclusion of liability for incidental or consequential damages, so the above limitation may not apply to you in full.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">13. Indemnification</h2>
              <p>You agree to indemnify, defend, and hold harmless GulfCDD and its owners, officers, employees, contractors, and agents from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or related to: (a) your use of the Services; (b) your breach of these Terms; (c) any Client Content you provide; (d) your violation of any applicable law or regulation; or (e) any claim that your Client Content infringes the intellectual property or other rights of any third party.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">14. Force Majeure</h2>
              <p>GulfCDD shall not be liable for any delay or failure to perform our obligations under these Terms to the extent such delay or failure is caused by circumstances beyond our reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, pandemic, governmental actions, power failures, internet outages, or failures of third-party service providers.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">15. Governing Law, Venue, and Dispute Resolution</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of the State of Mississippi, without regard to its conflict of law provisions.</p>
              <p className="mt-3"><strong>Venue and Personal Jurisdiction:</strong> For any matter not subject to arbitration under this Section, the parties consent to the exclusive personal jurisdiction and venue of the state courts of Jackson County, Mississippi, or the United States District Court for the Southern District of Mississippi. You irrevocably waive any objection to such venue, including any objection based on inconvenient forum.</p>
              <p className="mt-3"><strong>Arbitration:</strong> Any dispute, claim, or controversy arising out of or relating to these Terms or the Services that cannot be resolved informally shall be submitted to binding arbitration administered by the American Arbitration Association under its Consumer Arbitration Rules, except that either party may seek injunctive or other equitable relief in any court of competent jurisdiction to prevent irreparable harm pending the outcome of arbitration. The arbitration shall take place in Jackson County, Mississippi. Each party shall bear its own costs and attorneys' fees in arbitration unless the arbitrator finds the claim frivolous or brought in bad faith.</p>
              <p className="mt-3"><strong>Class Action and Jury Trial Waiver:</strong> TO THE FULLEST EXTENT PERMITTED BY LAW, YOU WAIVE ANY RIGHT TO A JURY TRIAL AND ANY RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT, CLASS-WIDE ARBITRATION, OR ANY OTHER REPRESENTATIVE PROCEEDING. ALL DISPUTES MUST BE BROUGHT IN YOUR INDIVIDUAL CAPACITY ONLY.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">16. Termination</h2>
              <p>Either party may terminate the Services for any reason with reasonable written notice. We may terminate or suspend your access to the Services immediately, without prior notice, if you breach these Terms or if we are required to do so by law.</p>
              <p className="mt-3">Upon termination, all rights and licenses granted to you will immediately cease. Provisions of these Terms that by their nature should survive termination will survive, including but not limited to Sections 7, 11, 12, 13, 15, and 17.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">17. General Provisions</h2>
              <p><strong>Entire Agreement:</strong> These Terms, together with any applicable Project Agreement and our Privacy Policy, constitute the entire agreement between you and GulfCDD regarding the Services and supersede all prior agreements and understandings, whether written or oral.</p>
              <p className="mt-3"><strong>Written Amendments Required (Statute of Frauds):</strong> Any modification, amendment, or waiver of these Terms or any Project Agreement must be made in writing and signed by an authorized representative of GulfCDD. Pursuant to Miss. Code Ann. § 15-3-1 and applicable Mississippi Statute of Frauds principles, oral modifications to any agreement for services with a value exceeding $500 are not enforceable. No course of dealing, course of performance, or trade usage shall modify these Terms unless reduced to a signed writing.</p>
              <p className="mt-3"><strong>Non-Disparagement:</strong> Each party agrees not to make, publish, or communicate to any third party any false, misleading, or disparaging statements about the other party, its products, services, employees, or business practices. This mutual non-disparagement obligation survives the termination of these Terms for a period of two (2) years. Nothing in this clause prevents either party from making truthful statements required by law or in connection with a legal proceeding.</p>
              <p className="mt-3"><strong>Severability:</strong> If any provision of these Terms is found to be invalid or unenforceable, that provision will be modified to the minimum extent necessary to make it enforceable, and the remaining provisions will remain in full force and effect.</p>
              <p className="mt-3"><strong>Waiver:</strong> Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
              <p className="mt-3"><strong>Assignment:</strong> You may not assign or transfer these Terms or any rights hereunder without our prior written consent. We may assign these Terms without restriction.</p>
              <p className="mt-3"><strong>Amendments:</strong> We reserve the right to update these Terms at any time. We will provide notice of material changes by posting the updated Terms on our website and updating the "Last Updated" date. Continued use of our Services after such changes constitutes acceptance of the updated Terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">18. Contact Us</h2>
              <p>For questions, concerns, or legal notices regarding these Terms, please contact us:</p>
              <div className="mt-3 space-y-1">
                <p><strong>Gulf Coast Digital Designs, LLC</strong></p>
                <p>Mississippi Gulf Coast</p>
                <p>Email: <EmailLink className="text-accent hover:underline">aultman@gulfcoastdigitaldesign.com</EmailLink></p>
                <p>Phone: <a href="tel:2282787782" className="text-accent hover:underline" onClick={() => fireEvent("phone_call", { location: "terms_page" })}>(228) 278-7782</a></p>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
