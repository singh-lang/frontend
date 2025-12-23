// src/app/FAQs/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import FAQsPage from "@/components/Faq";

export const metadata: Metadata = {
  title: "Car Rental FAQs | Renting in Dubai, Abu Dhabi & UAE",
  description:
    "Find answers about renting cars in Dubai, Abu Dhabi, Sharjah, Ajman & Ras Al Khaimah. Learn about deposits, delivery, insurance & payments at TheDriveHub.",
  keywords: [
    "car rental faq dubai",
    "car rental insurance uae",
    "car rental deposit dubai",
    "car rental delivery dubai",
    "car hire uae questions",
  ],
  robots: { index: true, follow: true },
  // Prefer absolute canonical in production:
  // alternates: { canonical: "https://thedrivehub.com/FAQs" },
  alternates: { canonical: "/FAQs" },
  openGraph: {
    title: "Car Rental FAQs | Renting in Dubai, Abu Dhabi & UAE",
    description:
      "Find answers about renting cars in Dubai, Abu Dhabi, Sharjah, Ajman & Ras Al Khaimah. Learn about deposits, delivery, insurance & payments at TheDriveHub.",
    url: "/FAQs",
    type: "website",
    siteName: "TheDriveHub",
  },
  twitter: { card: "summary_large_image" },
};

export default function Page() {
  // Your FAQ JSON-LD (unchanged)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do I need an International Driving Permit (IDP) to rent a car in Dubai?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, tourists must provide a valid International Driving Permit and a national driving license to rent a car in Dubai."
        }
      },
      {
        "@type": "Question",
        "name": "Is insurance included in the rental price?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all rentals at TheDriveHub include basic insurance with the option to add full coverage."
        }
      },
      {
        "@type": "Question",
        "name": "How is the security deposit handled?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Vendor holds your deposit either via credit card block or other agreed methods. It is typically refunded within 14–30 days, subject to fines or damages."
        }
      }
    ]
  };

  return (
    <>
      {/* Page UI */}
      <FAQsPage />

      {/* Inject JSON-LD for this page */}
      <Script
        id="ld-json-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
