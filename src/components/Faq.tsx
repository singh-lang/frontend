"use client";

import Head from "next/head";
import { useState } from "react";
import { Search, MessageCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/home/Navbar";
import SectionHeader from "@/components/shared/SectionHeader";
import FAQAccordion from "@/components/shared/FAQAccordion";
import CTABand from "@/components/shared/CTABand";

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // ✅ SEO <Head>

  const faqCategories = [
    {
      id: "general",
      name: "General Questions",
      questions: [
        {
          id: "faq-general-1",
          question: "What is The Drive Hub?",
          answer:
            "The Drive Hub is an online platform that connects customers with licensed car rental companies (“Vendors”) across the UAE. We are not a rental company — we facilitate bookings by forwarding your documents to Vendors for approval and contract initiation.",
        },
        {
          id: "faq-general-2",
          question: "Is The Drive Hub a rental company?",
          answer:
            "No. We do not own, manage, or operate any vehicles. All rentals are processed directly by third-party Vendors listed on our platform.",
        },
        {
          id: "faq-general-3",
          question: "How does the booking process work?",
          answer: `1. Browse listings on our platform.
2. Submit a booking request by uploading your documents.
3. Digitally sign the Vendor’s rental agreement.
4. Wait for the Vendor’s approval.
5. Upon approval, you will receive a secure payment link.
6. Once payment is made, the booking is confirmed.`,
        },
        {
          id: "faq-general-4",
          question: "What documents do I need to upload?",
          answer:
            "You will need to upload: Emirates ID (for residents) or Passport and visa page (for tourists); Valid UAE or international driving license; Any other documents required by the Vendor.",
        },
        {
          id: "faq-general-5",
          question: "Who decides if my booking is approved?",
          answer:
            "Only the Vendor has the right to approve or reject your request. The Drive Hub does not interfere in Vendor decisions.",
        },
        {
          id: "faq-general-6",
          question: "What happens if I’m rejected by a Vendor?",
          answer:
            "You will be notified, and no payment will be made. You can request a different car or try another Vendor.",
        },
        {
          id: "faq-general-7",
          question: "Is the payment made to The Drive Hub?",
          answer:
            "No. All payments and deposits are made directly to the Vendor via secure channels. The Drive Hub does not process or hold any payments.",
        },
        {
          id: "faq-general-8",
          question: "Will I get a confirmation?",
          answer:
            "Yes. Once the Vendor accepts your request and you complete the payment, you will receive a booking confirmation.",
        },
      ],
    },
    {
      id: "uae-rentals",
      name: "About Renting a Car in the UAE",
      questions: [
        {
          id: "faq-uae-1",
          question: "Can tourists rent cars in the UAE?",
          answer:
            "Yes. Tourists with a valid international or recognized foreign license can rent a car. Ensure your home country’s license is accepted in the UAE.",
        },
        {
          id: "faq-uae-2",
          question: "Are there age restrictions for renting a car?",
          answer:
            "Most Vendors require drivers to be at least 21 years old. Luxury or high-performance vehicles may require the driver to be 25 or older.",
        },
        {
          id: "faq-uae-3",
          question: "Is insurance included in the rental?",
          answer:
            "Yes. Basic third-party insurance is typically included. Vendors may offer optional full coverage for an additional fee.",
        },
        {
          id: "faq-uae-4",
          question: "How do Salik (toll gates) work?",
          answer:
            "Toll charges are recorded and invoiced at the end of your rental. They are either deducted from your deposit or paid separately.",
        },
        {
          id: "faq-uae-5",
          question: "What happens if I get a traffic fine?",
          answer:
            "You are responsible for any fines incurred during the rental. The Vendor may deduct the fine amount (plus an admin fee) from your deposit or invoice you afterward.",
        },
        {
          id: "faq-uae-6",
          question: "Can I drive the rented vehicle between Emirates?",
          answer:
            "Yes, unless the Vendor imposes restrictions. Some luxury cars may only be allowed within Dubai or specific areas.",
        },
        {
          id: "faq-uae-7",
          question: "What if the car breaks down or I have an accident?",
          answer:
            "Contact the Vendor immediately. They will guide you on the process, which may involve filing a police report and arranging a replacement vehicle.",
        },
        {
          id: "faq-uae-8",
          question: "Can I return the car early or cancel my booking?",
          answer:
            "Policies vary by Vendor. Some allow refunds or credits, while others may impose cancellation charges. Always read the Vendor’s terms carefully.",
        },
        {
          id: "faq-uae-9",
          question: "Do I have to clean the car before returning it?",
          answer:
            "Generally, yes. Excessive dirt or smoke smell may lead to cleaning fees, as defined by the Vendor.",
        },
        {
          id: "faq-uae-10",
          question: "Are there mileage limits?",
          answer:
            "Most cars have a daily mileage limit (e.g., 250 km). Exceeding this will result in extra charges, specified in the Vendor’s terms.",
        },
        {
          id: "faq-uae-11",
          question: "How is the security deposit handled?",
          answer:
            "The Vendor holds your deposit either via credit card block or other agreed methods. It is typically refunded within 14–30 days, subject to fines or damages.",
        },
        {
          id: "faq-uae-12",
          question: "What vehicles can I rent?",
          answer:
            "You can find a wide range — from compact sedans and SUVs to luxury, sports, and exotic cars. Availability varies by city and Vendor.",
        },
      ],
    },
    {
      id: "booking",
      name: "Booking & Rentals",
      questions: [
        {
          id: "faq-booking-1",
          question: "How do I book a car?",
          answer:
            "Browse our catalog, select your desired vehicle, choose your rental period, and complete the booking process. You'll receive instant confirmation via email and SMS with all rental details.",
        },
        {
          id: "faq-booking-2",
          question: "Can I modify my booking?",
          answer:
            "Yes, you can modify your booking up to 24 hours before pickup through your account dashboard or by contacting our 24/7 support team.",
        },
        {
          id: "faq-booking-3",
          question: "What is the cancellation policy?",
          answer:
            "Free cancellation up to 24 hours before pickup. Cancellations within 24 hours will incur a 50% charge of the first day's rental fee. Full refunds are processed within 5-7 business days.",
        },
        {
          id: "faq-booking-4",
          question: "How far in advance should I book?",
          answer:
            "We recommend booking at least 48 hours in advance, especially for premium vehicles. However, same-day bookings may be available subject to inventory.",
        },
      ],
    },
  ];

  const categories = [
    { id: "all", name: "All Questions" },
    ...faqCategories.map((cat) => ({ id: cat.id, name: cat.name })),
  ];

  const filteredFAQs = faqCategories
    .filter(
      (category) => activeCategory === "all" || category.id === activeCategory
    )
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          searchQuery === "" ||
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  const hasResults = filteredFAQs.length > 0;

  return (
    <>
      {/* ✅ SEO HEAD SECTION */}

      {/* ✅ PAGE CONTENT */}
      <div className="min-h-screen bg-off-white">
        <Navbar />

        <div className="pt-32 pb-24">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <SectionHeader
                eyebrow="Help Center"
                title="Frequently Asked Questions"
                subtitle="Find answers to common questions about renting cars with The Drive Hub."
              />
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 mb-12 border border-soft-grey/20">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-site-accent w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 border-2 border-soft-grey/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-site-accent focus:border-site-accent transition-all text-dark-base font-medium text-lg"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      activeCategory === category.id
                        ? "bg-gradient-to-r from-site-accent to-slate-teal text-white shadow-md"
                        : "bg-soft-grey/20 text-grey hover:bg-soft-grey/30"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {hasResults ? (
              <div className="space-y-12">
                {filteredFAQs.map((category) => (
                  <div key={category.id}>
                    {activeCategory === "all" && (
                      <h2 className="text-2xl font-bold text-dark-base mb-10 flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-gradient-to-b from-site-accent to-slate-teal rounded-full" />
                        {category.name}
                      </h2>
                    )}
                    <div className="space-y-4">
                      {category.questions.map((faq) => (
                        <FAQAccordion
                          key={faq.id}
                          id={faq.id}
                          question={faq.question}
                          answer={faq.answer}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-soft-grey/20">
                <div className="w-24 h-24 bg-site-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-site-accent" />
                </div>
                <h3 className="text-2xl font-bold text-dark-base mb-3">
                  No results found
                </h3>
                <p className="text-grey mb-6">
                  Try different keywords or browse all categories
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-site-accent to-slate-teal text-white rounded-xl font-semibold shadow-lg"
                >
                  Clear Search
                </button>
              </div>
            )}

            <div className="mt-16 bg-gradient-to-br from-site-primary via-site-primary/95 to-slate-teal/40 rounded-2xl p-10 text-center text-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(9,180,198,0.2),rgba(89,120,124,0.1)_40%,transparent_70%)] pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Couldn&apos;t Find Your Answer?
                </h3>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto text-lg">
                  Our support team is available 24/7 to help you with any
                  inquiries.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-site-accent hover:bg-site-accent/90 text-white px-8 py-4 rounded-xl font-bold shadow-xl"
                  >
                    Contact Support
                  </Link>
                  <a
                    href="https://wa.me/971564727007"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-16">
              <CTABand
                title="Ready to Rent?"
                subtitle="Browse our collection and find your perfect car today."
                primaryText="Browse Cars"
                primaryLink="/catalog/all/cars"
                secondaryText="How It Works"
                secondaryLink="/HowItWorks"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
