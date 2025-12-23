// app/becomevendor/page.tsx
import type { Metadata } from "next";
import BecomeVendorPage from "@/components/Becomevendor";

export const metadata: Metadata = {
  title: "Become a Car Rental Vendor in UAE | Join TheDriveHub",
  description:
    "Join TheDriveHub as a car rental vendor in Dubai & UAE. List your cars, grow your rentals, and reach thousands of customers effortlessly.",
  keywords: [
    "become car rental vendor dubai",
    "car rental vendor uae",
    "list cars for rent dubai",
    "join car rental platform uae",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "/becomevendor" },
  openGraph: {
    title: "Become a Car Rental Vendor in UAE | Join TheDriveHub",
    description:
      "Join TheDriveHub as a car rental vendor in Dubai & UAE. List your cars, grow your rentals, and reach thousands of customers effortlessly.",
    url: "/becomevendor",
    type: "website",
    siteName: "TheDriveHub",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function Page() {
  // Keep all interactivity/state in this client component
  return <BecomeVendorPage/>;
}
