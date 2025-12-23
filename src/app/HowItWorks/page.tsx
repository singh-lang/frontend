import type { Metadata } from "next";
import HowItWorksPage from "@/components/HowItWorksClient";

export const metadata: Metadata = {
  title: "How It Works | Rent a Car Easily in Dubai",
  description:
    "Renting a car in Dubai, Abu Dhabi or anywhere in the UAE is easy with TheDriveHub. Learn how to book luxury or budget cars online in minutes.",
  alternates: { canonical: "/HowItWorks" },
  openGraph: {
    title: "How It Works | Rent a Car Easily in Dubai",
    description:
      "Renting a car in Dubai, Abu Dhabi or anywhere in the UAE is easy with TheDriveHub.",
    url: "/HowItWorks",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <HowItWorksPage/>; // your existing "use client" page moved here
}
