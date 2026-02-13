// app/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import HeroFormLayout from "@/components/home/HeroSearchComponent";
import FeatureCards from "@/components/home/FeatureCards";
import CategoriesSection from "@/components/home/CategoriesSection";
import CarsCarousel from "@/components/home/CarsCarousel";
import BrandCarousel from "@/components/home/BrandCarousel";
import MobileAppBanner from "@/components/home/MobileAppBanner";
import WhatWeOffer from "@/components/home/WhatWeOffer";
import DocumentsRequired from "@/components/home/DocumentsRequired";
import Navbar from "@/components/home/Navbar";
import Link from "next/link";
import {
  fetchCategories,
  fetchCategoryListings,
  fetchMasterData,
} from "@/lib/api/home";
import VendorBanner from "@/components/home/VendorBanner";
import {
  Star,
  Crown,
  Flame,
  TrendingUp,
  Award,
  ThumbsUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "TheDriveHub | Compare & Book Car Rentals in Dubai, Abu Dhabi and UAE",
  description:
    " TheDriveHub connects you with verified car rental providers across the UAE. Compare prices, filter by brand/budget, and book with transparent terms—fast, simple, trusted. ",
  keywords: [
    "rent a car dubai",
    "car rental dubai",
    "car hire uae",
    "luxury car rental dubai",
    "sports car rental dubai",
    "economy car rental dubai",
    "uae car rental",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    title: "Rent a Car in Dubai | Affordable & Luxury Rentals | TheDriveHub",
    description:
      "Explore the UAE with TheDriveHub. Rent cars in Dubai, Abu Dhabi, Sharjah, Ajman & Ras Al Khaimah. Luxury, economy & sports cars – fast booking and delivery.",
    url: "/",
    type: "website",
    siteName: "TheDriveHub",
  },
  twitter: {
    card: "summary_large_image",
  },
  verification: {
    other: { "facebook-domain-verification": "6k689o08nv1m93spf16swtbkexeim5" },
  },
};
export const dynamic = "force-dynamic";

export default async function Page() {
  const [categoryListings, categories, masterData] = await Promise.all([
    fetchCategoryListings(),
    fetchCategories(),
    fetchMasterData(),
  ]);

  const luxuryCategory = categories?.data?.[0]?.categories.find(
    (cat: { name: string }) => cat.name === "Luxury Cars",
  )?.listings;

  const sportsCategory = categories?.data?.[0]?.categories.find(
    (cat: { name: string }) => cat.name === "Sports Cars",
  )?.listings;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full h-auto md:h-full mx-auto bg-gradient-to-b from-dark-base to-off-white">
        <Navbar />
        <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-32 pb-6 md:pb-8">
          {/* Hero Title */}
          <div className="text-center mb-4 md:mb-6 max-w-4xl animate-fade-in">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight leading-tight">
              Luxury Cars.{" "}
              <span className="bg-gradient-to-r from-slate-teal to-site-accent bg-clip-text text-transparent">
                Instant Booking.
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto">
              Premium car rentals across the UAE with seamless booking
            </p>
          </div>

          {/* Search Box */}
          <HeroFormLayout
            brands={masterData?.data?.[0]?.allBrands}
            bodyTypes={masterData?.data?.[0]?.allBodyTypes}
          />

          <div className="mt-5 flex flex-wrap justify-center gap-3 animate-fade-in">
            {["500+ Luxury Cars", "UAE-Wide Delivery", "24/7 Support"].map(
              (text) => (
                <div
                  key={text}
                  className="flex items-center justify-center w-40 h-12 bg-slate-teal/20 backdrop-blur-md rounded-full border border-slate-teal/30 text-white font-medium text-xs transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:bg-slate-teal/30"
                >
                  {text}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="py-6 md:py-8  bg-gradient-to-b from-off-white to-white">
        <FeatureCards />
      </section>

      {masterData?.data?.[0]?.allCategories?.length > 0 && (
        <section className="py-6 bg-gradient-to-b mt-5 from-off-white to-white relative overflow-hidden">
          <CategoriesSection data={masterData?.data?.[0]?.allCategories} />
        </section>
      )}

      {masterData?.data?.[0]?.carBrands?.length > 0 && (
        <section className="py-6 mb-6 bg-gradient-to-b from-off-white to-white relative overflow-hidden">
          <BrandCarousel data={masterData?.data?.[0]?.carBrands} />
        </section>
      )}

      {categoryListings?.data?.[0]?.featured?.length > 0 && (
        <section className="py-6 bg-gradient-to-b from-off-white to-white relative overflow-hidden">
          <CarsCarousel
            cars={categoryListings?.data?.[0]?.featured}
            sectionTypeTitle={true}
            sectionName="featured"
            sectionId="all"
            sectionTitle="Featured Cars"
            sectionDescription="Handpicked premium vehicles from verified providers across the UAE"
            bg="#fff"
            buttonsColor="#fff"
          />
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Link
          href={`/catalog/vendor-cars/68e0b6b5ca61c2774ef0e1c2`}
          className="block"
        >
          <Image
            src="/assets/Falcon Drive - GIF.gif"
            alt="Fancy animation"
            width={1216}
            height={550.78}
            unoptimized
            className="rounded-xl w-full h-auto"
          />
        </Link>
      </div>

      {luxuryCategory?.length > 0 && (
        <section className="py-6 bg-white">
          <CarsCarousel
            cars={luxuryCategory}
            sectionTypeTitle={false}
            sectionName="categories"
            sectionId={
              categories?.data?.[0]?.categories.find(
                (cat: { name: string }) => cat.name === "Luxury Cars",
              )?._id
            }
            sectionTitle="Luxury Collection"
            sectionDescription="Experience the ultimate in automotive excellence"
              sectionIcon={
                <div className="p-2 bg-gradient-to-r from-site-accent to-slate-teal rounded-full">
                  <Crown className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
              } 
             bg="#efeeea"
            buttonsColor="#efeeea"
          />
        </section>
      )}
      <div className="bg-white width=full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  bg-white py-12 md:py-16">
          <Link
            href={`/catalog/vendor-cars/68f63d6aa42f2f95b80dc8a4`}
            className="block"
          >
            <Image
              src="/assets/UPTOWN.gif"
              alt="Fancy animation"
              width={1216}
              height={550.78}
              unoptimized
              className="rounded-xl w-full h-auto"
            />
          </Link>
        </div>
      </div>
      {sportsCategory?.length > 0 && (
        <section className="py-6 bg-off-white">
          <CarsCarousel
            cars={sportsCategory}
            sectionTypeTitle={false}
            sectionName="categories"
            sectionId={
              categories?.data?.[0]?.categories.find(
                (cat: { name: string }) => cat.name === "Sports Cars",
              )?._id
            }
            sectionTitle="Sports Cars"
            sectionDescription="High-performance vehicles for the thrill seekers"
            sectionIcon={
              <div className="p-2 bg-gradient-to-r from-site-accent to-slate-teal rounded-full">
                <Flame className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            }  
            bg="#efeeea"
            buttonsColor="#fff"
          />
        </section>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Link
          href={`/catalog/vendor-cars/68e0b77cca61c2774ef0e1cb`}
          className="block"
        >
          <Image
            src="/assets/Princess Car rental.gif"
            alt="Fancy animation"
            width={1216}
            height={550.78}
            unoptimized
            className="rounded-xl w-full h-auto"
          />
        </Link>
      </div>

      {categoryListings?.data?.[0]?.popularCars?.length > 0 && (
        <section className="py-6 bg-white">
          <CarsCarousel
            cars={categoryListings?.data?.[0]?.popularCars}
            sectionTypeTitle={false}
            sectionName="popular"
            sectionId="all"
            sectionTitle="Popular Cars"
            sectionDescription="High-performance vehicles for the thrill seekers"
            sectionIcon={
            <div className="p-2 bg-gradient-to-r from-site-accent to-slate-teal rounded-full">
              <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          }  
            bg="#fff"
            buttonsColor="#efeeea"
          />
        </section>
      )}

      {categoryListings?.data?.[0]?.bestCars?.length > 0 && (
        <section className="py-16 bg-off-white">
          <CarsCarousel
            cars={categoryListings?.data?.[0]?.bestCars}
            sectionTypeTitle={false}
            sectionName="best"
            sectionId="all"
            sectionTitle="Best Cars"
            sectionDescription="High-performance vehicles for the thrill seekers"
            sectionIcon={
            <div className="p-2 bg-gradient-to-r from-site-accent to-slate-teal rounded-full">
              <Award className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          }  
            bg="#efeeea"
            buttonsColor="#fff"
          />
        </section>
      )}

      {categoryListings?.data?.[0]?.topChoice?.length > 0 && (
        <section className="py-16 bg-white">
          <CarsCarousel
            cars={categoryListings?.data?.[0]?.topChoice}
            sectionTypeTitle={false}
            sectionName="top-choice"
            sectionId="all"
            sectionTitle="Top Choice"
            sectionDescription="High-performance vehicles for the thrill seekers"
            sectionIcon={
            <div className="p-2 bg-gradient-to-r from-site-accent to-slate-teal rounded-full">
              <ThumbsUp className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          }  
            bg="#fff"
            buttonsColor="#efeeea"
          />
        </section>
      )}

      {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 pb-12 md:pb-16">
        <VendorBanner />
      </section> */}

      <DocumentsRequired />

      {/* <section className="py-16 bg-gradient-to-r from-site-accent to-slate-teal relative overflow-hidden">
        <MobileAppBanner />
      </section> */}

      <section className="py-10 md:py-12 bg-gradient-to-b from-white to-off-white relative overflow-hidden">
        <WhatWeOffer />
      </section>
    </div>
  );
}
