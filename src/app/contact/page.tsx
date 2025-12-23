// src/app/contact/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import ContactClient from "@/components/contact";

export const metadata: Metadata = {
  title: "Contact TheDriveHub | 24/7 Car Rental Support in Dubai & UAE",
  description:
    "Need help renting a car in Dubai, Abu Dhabi, Sharjah, Ajman or Ras Al Khaimah? Contact TheDriveHub’s support team for quick assistance.",
  keywords: [
    "contact car rental dubai",
    "thedrivehub contact",
    "car rental support dubai",
    "rent car uae help",
    "car hire abu dhabi contact",
    "24/7 car rental dubai",
    "thedrivehub support",
  ],
  robots: { index: true, follow: true },
  // In production prefer an absolute URL:
  // alternates: { canonical: "https://thedrivehub.com/contact" },
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact TheDriveHub | 24/7 Car Rental Support in Dubai & UAE",
    description:
      "Need help renting a car in Dubai, Abu Dhabi, Sharjah, Ajman or Ras Al Khaimah? Contact TheDriveHub’s support team for quick assistance.",
    url: "/contact",
    type: "website",
    siteName: "TheDriveHub",
  },
  twitter: { card: "summary_large_image" },
};

export default function Page() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact TheDriveHub",
    "url": "https://thedrivehub.com/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "TheDriveHub",
      "url": "https://thedrivehub.com/",
      "logo": "https://thedrivehub.com/assets/logoo.svg",
      "contactPoint": [{
        "@type": "ContactPoint",
        "telephone": "+971564727007",
        "contactType": "customer service",
        "areaServed": ["AE"],
        "availableLanguage": ["en","ar"]
      }]
    }
  };

  return (
    <>
      <ContactClient />

      <Script
        id="ld-json-contact"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
    </>
  );
}
