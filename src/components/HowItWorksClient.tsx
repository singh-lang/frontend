"use client";

import Head from "next/head";
import { useState } from "react";
import {
  Search,
  Car,
  CreditCard,
  ShieldCheck,
  MapPin,
  Clock,
  Headphones,
  RefreshCw,
  Star,
  MessageCircle,
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import SectionHeader from "@/components/shared/SectionHeader";
import StepCard from "@/components/shared/StepCard";
import TrustBadge from "@/components/shared/TrustBadge";
import StatCard from "@/components/shared/StatCard";
import CTABand from "@/components/shared/CTABand";

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<"customer" | "vendor">("customer");

  const customerSteps = [
    {
      icon: Search,
      title: "Browse & Select Your Car",
      description:
        "Search our extensive collection of cars by brand, category, or budget. Use advanced filters and view detailed specs, photos, and verified reviews.",
      learnMoreLink: "/FAQs",
    },
    {
      icon: Clock,
      title: "Choose Dates & Time",
      description:
        "Select your pickup and return dates with specific times. Our smart system calculates duration automatically, adding an extra day if rental exceeds 24 hours.",
      learnMoreLink: "/FAQs",
    },
    {
      icon: ShieldCheck,
      title: "Review Booking Details",
      description:
        "Check all rental details including pricing breakdown, insurance coverage, mileage limits, and terms. Preview your rental agreement before confirming.",
      learnMoreLink: "/FAQs",
    },
    {
      icon: CreditCard,
      title: "Confirm & Pay",
      description:
        "Complete your booking with secure payment. Receive instant confirmation with all booking details and rental agreement PDF.",
      learnMoreLink: "/FAQs",
    },
    {
      icon: Car,
      title: "Pickup & Drive",
      description:
        "Meet the vendor at the scheduled time for vehicle handover. Quick verification, collect keys, and hit the road with 24/7 support.",
      learnMoreLink: "/FAQs",
    },
  ];

  const vendorSteps = [
    {
      icon: Car,
      title: "List Your Car",
      description:
        "Create a detailed listing with photos and specifications. Set your own daily, weekly, and monthly rates.",
      learnMoreLink: "/FAQs",
    },
    {
      icon: ShieldCheck,
      title: "Get Verified",
      description:
        "Complete our verification process to earn the verified badge. Build trust with potential renters.",
      learnMoreLink: "/FAQs",
    },
    {
      icon: MessageCircle,
      title: "Receive Bookings",
      description:
        "Accept or decline booking requests. Communicate directly with renters through our secure platform.",
      learnMoreLink: "/FAQs",
    },
    {
      icon: CreditCard,
      title: "Get Paid",
      description:
        "Receive secure payments directly to your account. Track all transactions and earnings in your dashboard.",
      learnMoreLink: "/FAQs",
    },
  ];

  const steps = activeTab === "customer" ? customerSteps : vendorSteps;

  return (
    <>
      <Head>
        <title>How It Works | Rent a Car Easily in Dubai | TheDriveHub</title>
        <meta
          name="description"
          content="Renting a car in Dubai, Abu Dhabi or anywhere in the UAE is easy with TheDriveHub. Learn how to book luxury or budget cars online in minutes."
        />
        <meta
          name="keywords"
          content="how to rent a car in dubai, rent car uae, thedrivehub, car rental process dubai, car hire abu dhabi, rent luxury car dubai, cheap car rental uae"
        />
        <meta
          property="og:title"
          content="How It Works | Rent a Car Easily in Dubai | TheDriveHub"
        />
        <meta
          property="og:description"
          content="Renting a car in Dubai, Abu Dhabi or anywhere in the UAE is easy with TheDriveHub. Learn how to book luxury or budget cars online in minutes."
        />
        <meta property="og:url" content="https://thedrivehub.com/HowItWorks" />
        <meta property="og:site_name" content="TheDriveHub" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://thedrivehub.com/HowItWorks" />
        <meta name="robots" content="index,follow" />
      </Head>

      <div className="min-h-screen bg-off-white">
        <Navbar />

        <div className="pt-32 pb-24">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-16 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-site-accent/5 to-transparent -z-10 rounded-3xl blur-3xl"></div>

              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-site-accent/10 to-slate-teal/10 px-4 py-2 rounded-full border border-site-accent/20 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-site-accent to-slate-teal bg-clip-text text-transparent">
                  Simple Process
                </span>
              </div>

              <h1
                className="text-4xl md:text-6xl font-bold text-dark-base mb-6"
                style={{ fontFamily: "Stretch Pro, sans-serif" }}
              >
                How It Works
              </h1>

              <p className="text-xl text-grey max-w-3xl mx-auto leading-relaxed">
                Renting or listing a car has never been easier. Follow our
                simple {activeTab === "customer" ? "5-step" : "4-step"} process
                and get on the road in minutes.
              </p>
            </div>

            <div className="flex justify-center mb-16">
              <div className="inline-flex bg-white rounded-xl p-1.5 shadow-md border border-soft-grey/20">
                <button
                  onClick={() => setActiveTab("customer")}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-site-accent focus:ring-offset-2 ${
                    activeTab === "customer"
                      ? "bg-gradient-to-r from-site-accent to-slate-teal text-white shadow-md"
                      : "text-grey hover:text-dark-base"
                  }`}
                  role="tab"
                  aria-selected={activeTab === "customer"}
                >
                  For Customers
                </button>
                <button
                  onClick={() => setActiveTab("vendor")}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-site-accent focus:ring-offset-2 ${
                    activeTab === "vendor"
                      ? "bg-gradient-to-r from-site-accent to-slate-teal text-white shadow-md"
                      : "text-grey hover:text-dark-base"
                  }`}
                  role="tab"
                  aria-selected={activeTab === "vendor"}
                >
                  For Vendors
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
              {steps.map((step, index) => (
                <StepCard
                  key={index}
                  number={index + 1}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  learnMoreLink={step.learnMoreLink}
                />
              ))}
            </div>

            <div className="mb-24">
              <SectionHeader
                eyebrow="Trust &amp; Safety"
                title="Your Security is Our Priority"
                subtitle="We've built comprehensive safeguards to ensure every rental is safe, secure, and hassle-free."
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <TrustBadge icon={CreditCard} label="Secure Payments" />
                <TrustBadge icon={Headphones} label="24/7 Support" />
                <TrustBadge icon={RefreshCw} label="Smart Compare" />
                <TrustBadge icon={MapPin} label="UAE-wide Delivery" />
              </div>
            </div>

            <div className="mb-24">
              <SectionHeader
                eyebrow="Transparent Pricing"
                title="Simple, Clear Pricing"
                subtitle="No hidden fees. No surprises. Just straightforward rates that fit your budget."
              />
              {/* Pricing Section */}
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-soft-grey/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/10 to-green-600/10 flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-dark-base mb-2">
                      Daily
                    </h3>
                    <p className="text-grey text-sm">Perfect for short trips</p>
                    <div className="mt-4 text-3xl font-bold text-site-accent">
                      From AED 80
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-site-accent/10 to-slate-teal/10 flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-site-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-dark-base mb-2">
                      Weekly
                    </h3>
                    <p className="text-grey text-sm">
                      Best value for week-long rentals
                    </p>
                    <div className="mt-4 text-3xl font-bold text-site-accent">
                      From AED 500
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-site-primary/10 to-slate-teal/10 flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-site-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-dark-base mb-2">
                      Monthly
                    </h3>
                    <p className="text-grey text-sm">
                      Maximum savings for long-term
                    </p>
                    <div className="mt-4 text-3xl font-bold text-site-accent">
                      From AED 2200
                    </div>
                  </div>
                </div>

                <div className="border-t border-soft-grey/20 pt-8">
                  <h4 className="text-lg font-bold text-dark-base mb-4">
                    What&apos;s Included:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-site-accent"></div>
                      <span className="text-grey">Comprehensive Insurance</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-site-accent"></div>
                      <span className="text-grey">24/7 Support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-site-accent"></div>
                      <span className="text-grey">
                        Free Delivery (selected areas)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-site-accent"></div>
                      <span className="text-grey">VAT Included in Price</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-24">
              <SectionHeader
                eyebrow="Why Choose Us"
                title="Trusted by Thousands"
                subtitle="Join the growing community of satisfied customers across the UAE."
              />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={Car} value="500+" label="Vehicles Available" />
                <StatCard icon={Star} value="4.8/5" label="Average Rating" />
                <StatCard
                  icon={MapPin}
                  value="7 Emirates"
                  label="Coverage Area"
                />
                <StatCard
                  icon={Headphones}
                  value="24/7"
                  label="Customer Support"
                />
              </div>
            </div>

            <div className="mb-24 bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-soft-grey/20">
              <h3 className="text-2xl font-bold text-dark-base mb-8 text-center">
                Frequently Asked Questions
              </h3>

              <div className="space-y-4 mb-8">
                <div className="p-6 border border-soft-grey/20 rounded-xl hover:border-site-accent/40 transition-all">
                  <h4 className="font-bold text-dark-base mb-2">
                    What documents do I need to rent a car?
                  </h4>
                  <p className="text-grey text-sm">
                    Valid UAE driving license, Emirates ID, and a credit card
                    for the security deposit.
                  </p>
                </div>

                <div className="p-6 border border-soft-grey/20 rounded-xl hover:border-site-accent/40 transition-all">
                  <h4 className="font-bold text-dark-base mb-2">
                    Is insurance included in the rental price?
                  </h4>
                  <p className="text-grey text-sm">
                    Yes, all rentals include comprehensive insurance coverage
                    for your peace of mind.
                  </p>
                </div>

                <div className="p-6 border border-soft-grey/20 rounded-xl hover:border-site-accent/40 transition-all">
                  <h4 className="font-bold text-dark-base mb-2">
                    Can I cancel or modify my booking?
                  </h4>
                  <p className="text-grey text-sm">
                    Yes, free cancellation up to 24 hours before pickup.
                    Modifications can be made through your dashboard.
                  </p>
                </div>

                <div className="p-6 border border-soft-grey/20 rounded-xl hover:border-site-accent/40 transition-all">
                  <h4 className="font-bold text-dark-base mb-2">
                    Do you offer delivery service?
                  </h4>
                  <p className="text-grey text-sm">
                    Yes, free delivery is available in select areas. Additional
                    charges may apply for distant locations.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <a
                  href="/FAQs"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-site-accent to-slate-teal text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                >
                  View All FAQs
                </a>
              </div>
            </div>

            <CTABand
              title="Ready to Get Started?"
              subtitle="Browse our collection of premium vehicles and find your perfect ride today."
              primaryText="Search Cars"
              primaryLink="/catalog/all/cars"
              secondaryText="Contact Support"
              secondaryLink="/contact"
            />
          </div>
        </div>
      </div>
    </>
  );
}
