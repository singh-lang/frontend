import { FileText, CreditCard, Plane, MapPin, Check } from "lucide-react";
import Section from "../shared/Section";
import SectionHeader from "../shared/SectionHeader";
import Link from "next/link";

export default function DocumentsRequired() {
  return (
    <Section className="bg-gradient-to-br from-off-white to-soft-grey/30">
      <SectionHeader
        title="Documents Required"
        subtitle="Simple requirements to get you on the road"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        {/* UAE Residents */}
        <div className="bg-white rounded-xl shadow-md border border-soft-grey/20 overflow-hidden">
          <div className="bg-gradient-to-r from-site-accent to-slate-teal p-4 md:p-5">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white leading-tight">
                For UAE Residents
              </h3>
            </div>
            <p className="text-white/80 text-xs md:text-sm">
              If you live and work in the UAE
            </p>
          </div>

          <div className="p-4 md:p-5 space-y-3">
            {/* Emirates ID Front */}
            <div className="flex items-start gap-3 p-3 md:p-4 bg-site-accent/5 rounded-lg border border-site-accent/20">
              <div className="w-9 h-9 rounded-lg bg-site-accent/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-site-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-semibold text-sm md:text-base text-dark-base">
                    Emirates ID (Front)
                  </h4>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-success/10 rounded-full">
                    <Check className="w-2.5 h-2.5 text-success" />
                    <span className="text-xs text-success font-semibold">
                      Required
                    </span>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-grey">
                  Front side of your valid UAE Emirates ID
                </p>
              </div>
            </div>

            {/* Emirates ID Back */}
            <div className="flex items-start gap-3 p-3 md:p-4 bg-site-accent/5 rounded-lg border border-site-accent/20">
              <div className="w-9 h-9 rounded-lg bg-site-accent/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-site-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-semibold text-sm md:text-base text-dark-base">
                    Emirates ID (Back)
                  </h4>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-success/10 rounded-full">
                    <Check className="w-2.5 h-2.5 text-success" />
                    <span className="text-xs text-success font-semibold">
                      Required
                    </span>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-grey">
                  Back side of your valid UAE Emirates ID
                </p>
              </div>
            </div>

            {/* Passport */}
            <div className="flex items-start gap-3 p-3 md:p-4 bg-site-accent/5 rounded-lg border border-site-accent/20">
              <div className="w-9 h-9 rounded-lg bg-site-accent/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-site-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-semibold text-sm md:text-base text-dark-base">
                    Passport
                  </h4>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-success/10 rounded-full">
                    <Check className="w-2.5 h-2.5 text-success" />
                    <span className="text-xs text-success font-semibold">
                      Required
                    </span>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-grey">Valid passport copy</p>
              </div>
            </div>

            {/* Driving License */}
            <div className="flex items-start gap-4 p-4 bg-site-accent/5 rounded-xl border border-site-accent/20">
              <div className="w-10 h-10 rounded-lg bg-site-accent/10 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-site-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-semibold text-sm md:text-base text-dark-base">
                    UAE Driving License
                  </h4>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-success/10 rounded-full">
                    <Check className="w-3 h-3 text-success" />
                    <span className="text-xs text-success font-semibold">
                      Required
                    </span>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-grey">
                  Valid UAE driving license
                </p>
              </div>
            </div>

            {/* Note */}
            <div className="mt-4 p-3 md:p-4 bg-site-accent/5 border border-site-accent/20 rounded-lg">
              <p className="text-xs md:text-sm text-grey">
                <strong className="text-dark-base">Note:</strong> All documents must be valid and
                not expired. Digital copies are accepted during booking.
              </p>
            </div>
          </div>
        </div>

        {/* Tourists */}
        <div className="bg-white rounded-xl shadow-md border border-soft-grey/20 overflow-hidden">
          <div className="bg-gradient-to-r from-site-secondary to-site-accent p-4 md:p-5">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white leading-tight">
                For Tourists
              </h3>
            </div>
            <p className="text-white/80 text-xs md:text-sm">
              If you&apos;re visiting the UAE
            </p>
          </div>

          <div className="p-4 md:p-5 space-y-3">
            {/* Passport */}
            <div className="flex items-start gap-3 p-3 md:p-4 bg-site-secondary/5 rounded-lg border border-site-secondary/20">
              <div className="w-9 h-9 rounded-lg bg-site-secondary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-site-secondary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-semibold text-sm md:text-base text-dark-base">
                    Passport
                  </h4>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-success/10 rounded-full">
                    <Check className="w-2.5 h-2.5 text-success" />
                    <span className="text-xs text-success font-semibold">
                      Required
                    </span>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-grey">
                  Valid passport with entry stamp
                </p>
              </div>
            </div>

            {/* Visit Visa */}
            <div className="flex items-start gap-3 p-3 md:p-4 bg-site-secondary/5 rounded-lg border border-site-secondary/20">
              <div className="w-9 h-9 rounded-lg bg-site-secondary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-site-secondary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-dark-base">Visit Visa</h4>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-success/10 rounded-full">
                    <Check className="w-3 h-3 text-success" />
                    <span className="text-xs text-success font-semibold">
                      Required
                    </span>
                  </div>
                </div>
                <p className="text-sm text-grey">
                  Valid UAE visit visa or visa on arrival
                </p>
              </div>
            </div>

            {/* IDP */}
            <div className="flex items-start gap-4 p-4 bg-site-secondary/5 rounded-xl border border-site-secondary/20">
              <div className="w-10 h-10 rounded-lg bg-site-secondary/10 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-site-secondary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-dark-base">
                    Driver&apos;s License (IDP)
                  </h4>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-success/10 rounded-full">
                    <Check className="w-3 h-3 text-success" />
                    <span className="text-xs text-success font-semibold">
                      Required
                    </span>
                  </div>
                </div>
                <p className="text-sm text-grey">International Driving Permit</p>
              </div>
            </div>

            {/* Important Note */}
            <div className="mt-4 p-3 md:p-4 bg-warning/5 border border-warning/20 rounded-lg">
              <p className="text-xs md:text-sm text-grey mb-2">
                <strong className="text-dark-base">Important:</strong> An International Driving
                Permit (IDP) is required for tourists. Check if your country is eligible.
              </p>
              <a
                href="/idp"
                className="text-site-accent hover:text-slate-teal font-semibold text-xs md:text-sm underline"
              >
                Check IDP Requirements &amp; Eligibility →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="mt-6 text-center p-4 md:p-5 bg-white rounded-xl shadow-md border border-soft-grey/20">
        <p className="text-sm md:text-base text-grey mb-3">
          <strong className="text-dark-base">Need Help?</strong> Our team is here to assist you with
          any questions about document requirements.
        </p>
        <Link
  href="/contact"
  className="px-5 py-2.5 bg-gradient-to-r from-site-accent to-slate-teal text-white font-semibold text-sm rounded-lg hover:shadow-lg transition-all inline-block text-center"
>
  Contact Support
</Link>
      </div>
    </Section>
  );
}
