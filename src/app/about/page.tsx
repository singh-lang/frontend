// src/app/about/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import AboutPage from "@/components/About";

export const metadata: Metadata = {
  title: "About TheDriveHub | Trusted Car Rental Company in Dubai, UAE",
  description:
    "TheDriveHub connects you with top car rental providers across Dubai, Abu Dhabi, Sharjah, Ajman & Ras Al Khaimah. Trusted, transparent, and customer-focused.",
  keywords: [
    "car rental company dubai",
    "the drive hub",
    "rent car dubai",
    "car hire uae",
    "luxury car rental dubai",
    "affordable car rental",
    "trusted car rental dubai",
  ],
  robots: { index: true, follow: true },
  // In production, prefer absolute canonical:
  // alternates: { canonical: "https://thedrivehub.com/about" },
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About TheDriveHub | Trusted Car Rental Company in Dubai, UAE",
    description:
      "TheDriveHub connects you with top car rental providers across Dubai, Abu Dhabi, Sharjah, Ajman & Ras Al Khaimah. Trusted, transparent, and customer-focused.",
    url: "/about",
    type: "website",
    siteName: "TheDriveHub",
  },
};

export default function Page() {
  // Prefer AboutPage schema + embedded Organization (references your global org)
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About TheDriveHub",
    "url": "https://thedrivehub.com/about",
    "mainEntity": {
      "@type": "Organization",
      "name": "TheDriveHub",
      "url": "https://thedrivehub.com/",
      "logo": "https://thedrivehub.com/assets/logoo.svg",
      "description": "TheDriveHub is a trusted car rental company in Dubai and across the UAE offering premium and affordable vehicles with transparent pricing.",
      "foundingDate": "2023-01-01",
      "founder": { "@type": "Organization", "name": "TheDriveHub Team" }, // or a Person if applicable
      "contactPoint": [{
        "@type": "ContactPoint",
        "telephone": "+971564727007",
        "contactType": "customer service",
        "areaServed": ["AE"],
        "availableLanguage": ["en","ar"]
      }],
      "sameAs": [
        "https://www.instagram.com/thedrivehubco",
        "https://www.facebook.com/thedrivehubco",
        "https://www.snapchat.com/add/thedrivehubco",
        "https://www.tiktok.com/@thedrivehubco"
      ]
    }
  };

  // Optional: breadcrumbs
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://thedrivehub.com/" },
      { "@type": "ListItem", "position": 2, "name": "About", "item": "https://thedrivehub.com/about" }
    ]
  };

  return (
    <>
      <AboutPage />

      <Script
        id="ld-json-about"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([aboutSchema, breadcrumb]) }}
      />
    </>
  );
}
