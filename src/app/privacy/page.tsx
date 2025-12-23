"use client";
import Navbar from "@/components/home/Navbar";
import SectionHeader from "@/components/shared/SectionHeader";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeader
              eyebrow="Legal"
              title="Privacy Policy"
              subtitle="Effective Date: May 1, 2025"
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-grey/10">
            <div className="prose prose-lg max-w-none">

              {/* Introduction */}
              <section className="mb-8">
                <p className="text-grey leading-relaxed mb-4">
                  The Drive Hub Portal Co. (&quot;The Drive Hub&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to safeguarding the privacy and protection of every User, Vendor, and Advertiser who engages with our services. This Privacy Policy outlines how we collect, use, disclose, store, and protect your personal information when you use our website, mobile application, and other services (collectively, the &quot;Platform&quot;). By accessing or using the Platform, you consent to the data practices described in this Privacy Policy, in addition to the Terms &amp; Conditions and any other applicable legal agreements.
                </p>
              </section>

              {/* Information We Collect */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">1. Information We Collect</h2>
                <ul className="list-disc list-inside text-grey space-y-2 mb-4">
                  <li>Personal Identity Information: full name, email address, phone number, nationality, residency status.</li>
                  <li>Government-Issued Documentation: Emirates ID, Passport copy, UAE driving license, or valid international driving permits.</li>
                  <li>Booking-Related Documentation: digitally signed rental agreements, vehicle requests, timestamps, and booking history.</li>
                  <li>Payment Information: payment card details (processed via third-party gateways; full card data is not stored).</li>
                  <li>Technical Data: IP address, browser type, session logs, device identifiers, geolocation (if allowed).</li>
                  <li>Interaction Data: clicks, searches, preferences, chat inquiries, or messages to Vendors.</li>
                  <li>Collected via forms, uploads, email, cookies, APIs, and third-party analytics tools.</li>
                </ul>
              </section>

              {/* Purpose of Data Collection */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">2. Purpose of Data Collection</h2>
                <ul className="list-disc list-inside text-grey space-y-2 mb-4">
                  <li>To facilitate bookings with selected Vendors</li>
                  <li>To verify eligibility and validate documents</li>
                  <li>To allow Vendors to review rental requests and documents</li>
                  <li>To generate and issue payment links, booking confirmations, and deposit holds</li>
                  <li>To track the lifecycle of bookings and notify approvals, rejections, or cancellations</li>
                  <li>To ensure compliance with UAE transport and rental laws</li>
                  <li>To contact Users for feedback, platform improvements, or promotions (if consented)</li>
                  <li>To prevent fraud, resolve disputes, and manage risk</li>
                </ul>
              </section>

              {/* Sharing of Documents */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">3. Sharing of Documents and Personal Data with Vendors</h2>
                <p className="text-grey leading-relaxed mb-4">
                  The Drive Hub is a neutral intermediary. We forward uploaded documents and digitally signed agreements only to the Vendor you actively request a booking from, including:
                </p>
                <ul className="list-disc list-inside text-grey space-y-2 mb-4">
                  <li>Emirates ID, driving license, passport copies</li>
                  <li>Signed rental contract (uploaded by the Vendor)</li>
                  <li>Booking timestamp and communication log</li>
                </ul>
                <p className="text-grey leading-relaxed mb-4">
                  We do not share documents with other Vendors, partners, or external platforms unless legally required. Documents are retained temporarily and securely deleted after completion of the rental cycle or expiration of regulatory record-keeping periods.
                </p>
              </section>

              {/* Cookies and Tracking */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">4. Cookies and Tracking Technologies</h2>
                <p className="text-grey leading-relaxed mb-4">
                  We use cookies and other session-based trackers to enhance navigation, store preferences, analyze usage, and display relevant promotions. You may block cookies via browser settings, but this may limit Platform functionality.
                </p>
              </section>

              {/* Disclosure to Third Parties */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">5. Disclosure to Third Parties</h2>
                <p className="text-grey leading-relaxed mb-4">
                  We do not sell, trade, or lease personal information. Data may be disclosed to:
                </p>
                <ul className="list-disc list-inside text-grey space-y-2 mb-4">
                  <li>Rental Vendors for booking processing</li>
                  <li>Payment Gateways for secure transactions</li>
                  <li>Legal Authorities upon request</li>
                  <li>IT and Cloud Providers under strict security contracts</li>
                  <li>Advisors (legal, financial, technical) for audits or disputes</li>
                </ul>
              </section>

              {/* Data Security Measures */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">6. Data Security Measures</h2>
                <p className="text-grey leading-relaxed mb-4">
                  We employ encryption, restricted access, vulnerability patching, secure hosting, and verification measures. Users should also take precautions, as no online system is 100% secure.
                </p>
              </section>

              {/* Data Retention */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">7. Data Retention Duration</h2>
                <p className="text-grey leading-relaxed mb-4">
                  Your data is retained only as long as necessary:
                </p>
                <ul className="list-disc list-inside text-grey space-y-2 mb-4">
                  <li>While your account is active or under a pending booking</li>
                  <li>For record-keeping/legal reporting per UAE law</li>
                  <li>Up to [insert number] months after a transaction, unless deletion is requested or a dispute is ongoing</li>
                </ul>
              </section>

              {/* User Rights */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">8. Your Rights and Choices</h2>
                <p className="text-grey leading-relaxed mb-4">
                  You may access, update, or delete your data, withdraw consent, or complain to UAE authorities. Contact us at <a href="mailto:privacy@thedrivehub.com" className="text-blue-600">privacy@thedrivehub.com</a>.
                </p>
              </section>

              {/* International Transfers */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">9. International Transfers</h2>
                <p className="text-grey leading-relaxed mb-4">
                  Data may be processed outside the UAE with contractual safeguards in place to ensure equivalent protection.
                </p>
              </section>

              {/* Minors */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">10. Minors and Age Restriction</h2>
                <p className="text-grey leading-relaxed mb-4">
                  Our Platform is for users 18+. We do not knowingly collect data from minors. Please notify us if this occurs.
                </p>
              </section>

              {/* Policy Updates */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">11. Policy Updates and Notifications</h2>
                <p className="text-grey leading-relaxed mb-4">
                  We may update this Policy. Material changes will be notified via banners, email (if subscribed), and updated effective dates.
                </p>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="text-2xl font-bold text-dark-base mb-4">12. Governing Law and Jurisdiction</h2>
                <p className="text-grey leading-relaxed mb-4">
                  This Policy is governed by UAE law. Disputes shall be resolved in the courts of Dubai.
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
