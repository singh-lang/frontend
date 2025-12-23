/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Link from "next/link";
import { ArrowLeft, Star, Phone, MessageCircle, X } from "lucide-react";
import Navbar from "../home/Navbar";
import Footer from "../layout/Footer";
import VerifiedBadge from "@/components/home/VerifiedBadge";
import DirhamSymbol from "@/components/shared/DirhamSymbol";
import { useComparison } from "@/contexts/ComparisionContext";
import type { CarTypes } from "@/types/homePageTypes";
import Image from "next/image";

const comparisonFields = [
  { label: "Brand", key: "car.carBrand.name" },
  { label: "Model", key: "title" },
  { label: "Year", key: "car.modelYear" },
  { label: "Daily Price", key: "rentPerDay", suffix: "/day" },
  { label: "Weekly Price", key: "rentPerWeek", suffix: "/week" },
  { label: "Monthly Price", key: "rentPerMonth", suffix: "/month" },
  { label: "Seats", key: "car.seatingCapacity" },
  { label: "Transmission", key: "car.transmission" },
  { label: "Fuel Type", key: "car.fuelType" },
  { label: "Min Rental Days", key: "minRentalDays" },
  { label: "Deposit Required", key: "depositRequired" },
];

export default function ComparePage() {
  const { comparisonCars, removeFromComparison, clearComparison } =
    useComparison();

  if (comparisonCars.length < 2) {
    return (
      <div className="min-h-screen bg-off-white">
        <Navbar />
        <div className="pt-32 pb-24 text-center">
          <h1 className="text-4xl font-bold mb-4">Car Comparison</h1>
          <p className="text-grey mb-8">
            Please select at least 2 cars to compare.
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-slate-teal text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" /> Browse Cars
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Helper to get nested property from CarTypes safely
  const getValue = (car: CarTypes, path: string) => {
    const value = path
      .split(".")
      .reduce((obj: any, key) => (obj ? obj[key] : null), car);
    return value !== null && value !== undefined ? value : "N/A";
  };

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />
      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 text-accent hover:text-slate-teal transition-colors mb-4"
              >
                <ArrowLeft className="w-5 h-5" /> Back to Catalog
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold">Compare Cars</h1>
            </div>
            <button
              onClick={clearComparison}
              className="px-4 py-2 text-sm font-semibold text-grey hover:text-danger transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-soft-grey/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-accent/5 to-slate-teal/5">
                    <th className="sticky left-0 bg-white z-10 px-6 py-4 text-left font-bold border-r border-soft-grey/20">
                      Feature
                    </th>
                    {comparisonCars.map((car) => (
                      <th key={car._id} className="px-6 py-4 min-w-[280px]">
                        <div className="relative">
                          <button
                            onClick={() => removeFromComparison(car._id)}
                            className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full shadow-lg text-grey hover:text-danger transition-colors z-10"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <Image
                            src={
                              car.car.images[0]?.url ??
                              "/assets/car_placeholder.png"
                            }
                            alt={car.title}
                            className="w-full h-40 object-cover rounded-lg mb-4"
                            height={100}
                            width={100}
                          />
                          <h3 className="text-lg font-bold">
                            {car.car.carBrand.name} {car.title}
                          </h3>
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <VerifiedBadge className="w-4 h-4" />
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            </div>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFields.map((field, idx) => (
                    <tr
                      key={field.key}
                      className={idx % 2 === 0 ? "bg-soft-grey/10" : "bg-white"}
                    >
                      <td className="sticky left-0 bg-white z-10 px-6 py-4 font-semibold border-r border-soft-grey/20">
                        {field.label}
                      </td>
                      {comparisonCars.map((car) => (
                        <td
                          key={car._id}
                          className="px-6 py-4 text-center text-grey"
                        >
                          {field.key.includes("Price") ? (
                            <div className="flex items-center justify-center gap-1">
                              <DirhamSymbol className="w-3 h-3" />
                              <span>
                                {getValue(car, field.key)}
                                {field.suffix ?? ""}
                              </span>
                            </div>
                          ) : field.key === "depositRequired" ? (
                            getValue(car, field.key) ? (
                              "Yes"
                            ) : (
                              "No"
                            )
                          ) : (
                            getValue(car, field.key)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Actions row */}
                  <tr className="bg-white">
                    <td className="sticky left-0 bg-white z-10 px-6 py-4 font-semibold border-r border-soft-grey/20">
                      Actions
                    </td>
                    {comparisonCars.map((car) => (
                      <td key={car._id} className="px-6 py-4 space-y-2">
                        <a
                          href={`tel:${car.vendor?.vendorDetails?.contact?.mobileNum}`}
                          className="flex items-center justify-center gap-2 bg-gradient-to-br from-white to-off-white border-2 border-soft-grey/50 text-site-grey hover:border-site-accent hover:text-site-accent hover:bg-white px-5 py-2 rounded-xl font-semibold text-sm md:text-base shadow-md"
                        >
                          <Phone className="w-4 h-4" /> Call
                        </a>

                        <a
                          href={`https://wa.me/${car.vendor?.vendorDetails?.contact?.whatsappNum?.replaceAll(
                            " ",
                            ""
                          )}`}
                          className="flex items-center justify-center gap-2 bg-gradient-to-br from-white to-off-white border-2 border-site-accent/60 text-site-accent hover:border-site-accent hover:text-white hover:bg-gradient-to-r hover:from-site-accent hover:to-site-accent/90 px-5 py-2 rounded-xl font-semibold text-sm md:text-base shadow-md"
                        >
                          <MessageCircle className="w-4 h-4" /> WhatsApp
                        </a>

                        <Link
                          href={`/car/${car._id}`}
                          className="block w-full text-center bg-gradient-to-r from-site-accent to-slate-teal text-white px-5 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl"
                        >
                          Rent Now
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
