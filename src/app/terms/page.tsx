"use client";
import Navbar from "@/components/home/Navbar";
import SectionHeader from "@/components/shared/SectionHeader";
// import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeader
              eyebrow="Legal"
              title="Terms &amp; Conditions"
              subtitle="Effective Date: May 1, 2025"
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-grey/10">
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">
                  Introduction
                </h2>
                <p className="text-grey leading-relaxed mb-4">
                  Welcome to The Drive Hub. By accessing or using our website,
                  mobile application, or services, you agree to comply with and
                  be bound by these Terms &amp; Conditions. If you do not agree,
                  you must not use the Platform. These Terms form a binding
                  agreement between you (&quot;User&quot; or
                  &quot;Customer&quot;) and The Drive Hub Portal Co. (&quot;The
                  Drive Hub,&quot; &quot;we&quot;, &quot;our&quot;).
                </p>
              </section>

              {/* Services */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">
                  Nature and Scope of Services
                </h2>
                <p className="text-grey leading-relaxed mb-4">
                  The Drive Hub is a technology aggregator connecting Users to
                  Vendors. We are not a rental company, vehicle owner, or party
                  to rental contracts. Our role is limited to hosting listings,
                  forwarding booking requests, enabling digital signatures, and
                  providing payment links.
                </p>
              </section>

              {/* Booking Flow */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">
                  Booking Flow
                </h2>
                <ul className="list-disc list-inside text-grey space-y-2 mb-4">
                  <li>Vehicle selection from Vendor listings.</li>
                  <li>
                    Submission of required documents (Emirates ID, license,
                    passport).
                  </li>
                  <li>Digital signature of Vendor&apos;s rental agreement.</li>
                  <li>Vendor reviews request and accepts/declines.</li>
                  <li>Secure payment link issued upon approval.</li>
                  <li>Security deposit pre-authorization applied.</li>
                  <li>Booking confirmed only after payment + deposit hold.</li>
                </ul>
              </section>

              {/* Legal Relationship */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">
                  Legal Relationship
                </h2>
                <p className="text-grey leading-relaxed mb-4">
                  The Drive Hub is not a party to the rental contract. All
                  liabilities and obligations are solely between the User and
                  Vendor.
                </p>
              </section>

              {/* User Obligations */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">
                  User Obligations
                </h2>
                <ul className="list-disc list-inside text-grey space-y-2 mb-4">
                  <li>You must be legally permitted to drive in the UAE.</li>
                  <li>All submitted documents must be authentic and valid.</li>
                  <li>
                    You are responsible for fines, damages, and lawful use of
                    vehicles.
                  </li>
                  <li>Unauthorized drivers are prohibited.</li>
                </ul>
              </section>

              {/* Payments & Security Deposits */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">
                  Payments &amp; Security Deposits
                </h2>
                <p className="text-grey leading-relaxed mb-4">
                  Payments are processed via third-party gateways, with deposits
                  held temporarily for fines, damages, or violations. Disputes
                  must be resolved directly with the Vendor.
                </p>
              </section>

              {/* Cancellations & Refunds */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">
                  Cancellation &amp; Refunds
                </h2>
                <p className="text-grey leading-relaxed mb-4">
                  Policies are Vendor-specific. Refunds (if applicable) are
                  handled by the Vendor. No-shows may forfeit deposits or rental
                  fees.
                </p>
              </section>

              {/* Liability & Governing Law */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">
                  Indemnity, Liability, Force Majeure &amp; Governing Law
                </h2>
                <p className="text-grey leading-relaxed mb-4">
                  Users indemnify The Drive Hub against all claims. We are not
                  liable for indirect damages or Vendor disputes. These Terms
                  are governed by UAE law under Dubai courts.
                </p>
              </section>

              {/* Vendors */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">
                  For Vendors
                </h2>
                <ul className="list-disc list-inside text-grey space-y-2 mb-4">
                  <li>
                    Vendors must hold valid UAE trade licenses and insurance.
                  </li>
                  <li>
                    Vendors are responsible for vehicle condition, legality, and
                    contracts.
                  </li>
                  <li>All listings must be accurate and updated regularly.</li>
                  <li>
                    Deposit handling, deductions, and disputes remain
                    Vendor&apos;s responsibility.
                  </li>
                  <li>
                    Drive Hub may suspend Vendors for repeated complaints or
                    violations.
                  </li>
                </ul>
              </section>

              {/* Advertisers */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-dark-base mb-4">
                  For Advertisers
                </h2>
                <ul className="list-disc list-inside text-grey space-y-2 mb-4">
                  <li>
                    Advertisers must comply with UAE Media Council laws and
                    truthful marketing.
                  </li>
                  <li>
                    Prohibited: misleading offers, illegal rentals, counterfeit
                    licenses, political or explicit content.
                  </li>
                  <li>
                    All campaigns are prepaid and non-refundable unless
                    otherwise agreed.
                  </li>
                  <li>
                    Advertisers indemnify Drive Hub against IP or regulatory
                    claims.
                  </li>
                  <li>
                    Disputes fall under UAE law, Dubai courts jurisdiction.
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
