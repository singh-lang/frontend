"use client";


import { AlertCircle, CheckCircle, FileText, Globe } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import SectionHeader from "@/components/shared/SectionHeader";

export default function IDPRequirementsPage() {
  const eligibleCountries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "New Zealand",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Netherlands",
    "Belgium",
    "Switzerland",
    "Austria",
    "Sweden",
    "Norway",
    "Denmark",
    "Finland",
    "Ireland",
    "Portugal",
    "Japan",
    "South Korea",
    "Singapore",
    "Malaysia",
    "Hong Kong",
    "South Africa",
    "India",
    "Pakistan",
    "Philippines",
    "Indonesia",
    "Thailand",
    "China",
    "Russia",
    "Poland",
    "Czech Republic",
    "Greece",
    "Turkey",
    "Brazil",
    "Argentina",
    "Mexico",
    "Chile",
    "Colombia",
  ];

  const gccCountries = ["Saudi Arabia", "Kuwait", "Bahrain", "Oman", "Qatar"];

  return (
    <>
      {/* ✅ SEO Head Section */}
     

      {/* ✅ Page Content */}
      <div className="min-h-screen bg-off-white">
        <Navbar />

        <div className="pt-32 pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <SectionHeader
                eyebrow="For Tourists"
                title="International Driving Permit Requirements"
                subtitle="Everything you need to know about driving in the UAE as a tourist"
              />
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* What is an IDP */}
            <div className="bg-white rounded-xl shadow-md border border-soft-grey/20 overflow-hidden">
              <div className="bg-gradient-to-r from-site-accent to-slate-teal p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    What is an IDP?
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-4 text-grey leading-relaxed">
                <p>
                  An International Driving Permit (IDP) is a document that
                  translates your home country&apos;s driver&apos;s license into
                  multiple languages, allowing you to drive in foreign
                  countries. In the UAE, tourists must have a valid IDP along
                  with their original license to rent and drive a vehicle.
                </p>
                <p>
                  The IDP is recognized in over 150 countries and must be issued
                  by an authorized organization in your home country before
                  travel.
                </p>
              </div>
            </div>

            {/* Who Needs an IDP */}
            <div className="bg-white rounded-xl shadow-md border border-soft-grey/20 overflow-hidden">
              <div className="bg-gradient-to-r from-success to-emerald-600 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    Who Needs an IDP?
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3 p-4 bg-success/5 rounded-lg border border-success/20">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-dark-base mb-1">
                      Tourists Visiting UAE
                    </h3>
                    <p className="text-sm text-grey">
                      Tourists on a visitor visa must present a valid IDP issued
                      in their home country to rent or drive vehicles in the
                      UAE.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-site-accent/5 rounded-lg border border-site-accent/20">
                  <FileText className="w-5 h-5 text-site-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-dark-base mb-1">
                      Required Documents
                    </h3>
                    <ul className="text-sm text-grey space-y-1 list-disc list-inside">
                      <li>Valid passport with UAE entry stamp</li>
                      <li>Valid UAE tourist visa</li>
                      <li>Original driver&apos;s license from home country</li>
                      <li>International Driving Permit (IDP)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Eligible Countries */}
            <div className="bg-white rounded-xl shadow-md border border-soft-grey/20 overflow-hidden">
              <div className="bg-gradient-to-r from-site-secondary to-blue-600 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    Eligible Countries
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-dark-base mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    GCC Countries (No IDP Required)
                  </h3>
                  <p className="text-sm text-grey mb-3">
                    Residents of GCC countries can drive in the UAE using their
                    domestic licenses.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {gccCountries.map((country) => (
                      <span
                        key={country}
                        className="px-3 py-1.5 bg-success/10 text-success text-sm rounded-full border border-success/20"
                      >
                        {country}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-soft-grey/30" />

                <div>
                  <h3 className="font-semibold text-dark-base mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-site-accent" />
                    Countries Requiring IDP
                  </h3>
                  <p className="text-sm text-grey mb-3">
                    Visitors from the following countries must carry both their
                    domestic license and a valid IDP.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {eligibleCountries.map((country) => (
                      <span
                        key={country}
                        className="px-3 py-1.5 bg-site-accent/10 text-accent text-sm rounded-full border border-site-accent/20"
                      >
                        {country}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-grey">
                      <strong className="text-dark-base">Note:</strong> If your
                      country is not listed, please contact us to confirm
                      eligibility. Some nations have bilateral agreements with
                      the UAE that allow driving without an IDP.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Obtain an IDP */}
            <div className="bg-white rounded-xl shadow-md border border-soft-grey/20 overflow-hidden">
              <div className="bg-gradient-to-r from-warning to-orange-500 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    How to Obtain an IDP
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {[
                  {
                    step: "1",
                    title: "Apply Before Your Trip",
                    desc: "You must obtain your IDP from your home country before traveling to the UAE. It cannot be issued locally for tourists.",
                  },
                  {
                    step: "2",
                    title: "Contact Authorized Organizations",
                    desc: "Apply through authorized automobile associations (e.g., AAA in the US, AA in the UK, ADAC in Germany).",
                  },
                  {
                    step: "3",
                    title: "Provide Required Documents",
                    desc: "Usually requires a valid license, passport photos, and a small fee. Processing takes about 1–2 weeks.",
                  },
                  {
                    step: "4",
                    title: "Validity Period",
                    desc: "Most IDPs are valid for one year from the issue date. Ensure yours covers your entire UAE trip.",
                  },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-site-accent text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark-base mb-1">
                        {title}
                      </h3>
                      <p className="text-sm text-grey">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assistance */}
            <div className="bg-gradient-to-r from-site-accent to-slate-teal rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Need Assistance?</h3>
              <p className="mb-4 text-white/90">
                Our support team is available 24/7 to guide you on rental and
                license requirements in the UAE.
              </p>
              <a
                href="/contact"
                className="inline-block px-6 py-3 bg-white text-site-accent font-semibold rounded-lg hover:bg-off-white transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
