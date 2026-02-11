import { FileText, CreditCard, Plane, MapPin, Check } from "lucide-react";
import Section from "../shared/Section";
import SectionHeader from "../shared/SectionHeader";
import Link from "next/link";

export default function DocumentsRequired() {
  return (
    <Section className="bg-gradient-to-br from-off-white to-soft-grey/30 py-8 md:py-14">
      <SectionHeader
        title="Documents Required"
        subtitle="Simple requirements to get you on the road"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8 mt-8">
        {/* UAE Residents */}
        <div className="bg-white rounded-2xl shadow-sm border border-soft-grey/20 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-site-accent to-slate-teal px-4 py-4 md:p-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base md:text-xl font-bold text-white">
                  For UAE Residents
                </h3>
                <p className="text-white/80 text-[11px] md:text-sm">
                  If you live and work in the UAE
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-4 py-4 md:p-5 space-y-3">
            {[
              {
                title: "Emirates ID (Front)",
                desc: "Front side of your valid UAE Emirates ID",
              },
              {
                title: "Emirates ID (Back)",
                desc: "Back side of your valid UAE Emirates ID",
              },
              {
                title: "Passport",
                desc: "Valid passport copy",
              },
              {
                title: "UAE Driving License",
                desc: "Valid UAE driving license",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 md:p-4 bg-site-accent/5 rounded-xl border border-site-accent/10 hover:shadow-sm transition"
              >
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-site-accent/10 flex items-center justify-center flex-shrink-0">
                  {index === 3 ? (
                    <CreditCard className="w-4 h-4 text-site-accent" />
                  ) : (
                    <FileText className="w-4 h-4 text-site-accent" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-xs md:text-sm text-dark-sm">
                      {item.title}
                    </h4>
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-success/10 rounded-full text-[10px] md:text-xs text-success font-semibold">
                      <Check className="w-3 h-3" />
                      Required
                    </span>
                  </div>
                  <p className="text-[10px] md:text-sm text-grey mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}

            <div className="mt-4 p-3 bg-site-accent/5 border border-site-accent/20 rounded-xl">
              <p className="text-[10px] md:text-sm text-grey">
                <strong className="text-dark-base">Note:</strong> All documents must be valid and not expired. Digital copies are accepted during booking.
              </p>
            </div>
          </div>
        </div>

        {/* Tourists */}
        <div className="bg-white rounded-2xl shadow-sm border border-soft-grey/20 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-site-secondary to-site-accent px-4 py-4 md:p-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Plane className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base md:text-xl font-bold text-white">
                  For Tourists
                </h3>
                <p className="text-white/80 text-[11px] md:text-sm">
                  If you&apos;re visiting the UAE
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-4 py-4 md:p-5 space-y-3">
            {[
              {
                title: "Passport",
                desc: "Valid passport with entry stamp",
              },
              {
                title: "Visit Visa",
                desc: "Valid UAE visit visa or visa on arrival",
              },
              {
                title: "Driver’s License (IDP)",
                desc: "International Driving Permit",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 md:p-4 bg-site-secondary/5 rounded-xl border border-site-secondary/10 hover:shadow-sm transition"
              >
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-site-secondary/10 flex items-center justify-center flex-shrink-0">
                  {index === 2 ? (
                    <CreditCard className="w-4 h-4 text-site-secondary" />
                  ) : (
                    <FileText className="w-4 h-4 text-site-secondary" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-xs md:text-sm text-dark-sm">
                      {item.title}
                    </h4>
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-success/10 rounded-full text-[10px] md:text-xs text-success font-semibold">
                      <Check className="w-3 h-3" />
                      Required
                    </span>
                  </div>
                  <p className="text-[10px] md:text-sm text-grey mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}

            <div className="mt-4 p-3 bg-warning/5 border border-warning/20 rounded-xl">
              <p className="text-[11px] md:text-sm text-grey">
                <strong className="text-dark-base">Important:</strong>  An International Driving Permit (IDP) is required for tourists. Check if your country is eligible.
                </p>
              <Link
                href="/idp"
                className="text-site-accent font-semibold text-[11px] md:text-sm underline mt-1 inline-block"
              >
                Check IDP Requirements →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="mt-5 text-center p-5 bg-white rounded-2xl shadow-sm border border-soft-grey/20">
        <p className="text-xs md:text-base text-grey mb-4">
          <strong className="text-dark-base">Need Help?</strong> Our team is here to assist you with any questions about document requirements.


        </p>
        <Link
          href="/contact"
          className="px-5 py-2.5 bg-gradient-to-r from-site-accent to-slate-teal text-white font-semibold text-xs md:text-sm rounded-lg hover:shadow-lg transition-all inline-block"
        >
          Contact Support
        </Link>
      </div>
    </Section>
  );
}
