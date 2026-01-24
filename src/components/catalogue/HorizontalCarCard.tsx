"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Users,
  Gauge,
  CheckCircle,
  Shield,
  Plus,
  Minus,
  Building2,
  MapPin,
  Star,
} from "lucide-react";

import DirhamSymbol from "../shared/DirhamSymbol";
import type { CarTypes } from "@/types/homePageTypes";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/util/watsapp";
import { useCreateClickMutation } from "@/lib/api/car";

type PeriodType = "daily" | "weekly" | "monthly";
type DetailTabType = "carInfo" | "overview" | "features" | "provider";

interface CompactCarCardProps {
  car: CarTypes;
}

const CompactCarCard = ({ car }: CompactCarCardProps) => {
  const [period, setPeriod] = useState<PeriodType>("daily");
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTabType>("carInfo");
  const [createClick] = useCreateClickMutation();

  const imageUrl = car?.car?.images?.[0]?.url || "/assets/car_placeholder.png";

  const whatsappNumber =
    car?.vendor?.vendorDetails?.contact?.whatsappNum?.replaceAll(" ", "") ||
    "971501234567";

  const whatsappUrl = buildWhatsAppUrl(
    whatsappNumber,
    `${buildWhatsAppMessage(
      car,
    )}\n\n*Any changes made to this message will result in the inquiry not being sent to the dealer.*`,
  );

  const callNumber =
    car?.vendor?.vendorDetails?.contact?.mobileNum || "+971501234567";

  const price = useMemo(() => {
    switch (period) {
      case "daily":
        return {
          base: car?.rentPerDay,
          offer: car?.offerRentPerDay,
          final: car?.offerRentPerDay ?? car?.rentPerDay,
          label: "/day",
          mileage: car?.car?.dailyMileage || 250,
        };
      case "weekly":
        return {
          base: car?.rentPerWeek,
          offer: car?.offerRentPerWeek,
          final: car?.offerRentPerWeek ?? car?.rentPerWeek,
          label: "/week",
          mileage: car?.car?.weeklyMileage || 1500,
        };
      case "monthly":
        return {
          base: car?.rentPerMonth,
          offer: car?.offerRentPerMonth,
          final: car?.offerRentPerMonth ?? car?.rentPerMonth,
          label: "/month",
          mileage: car?.car?.monthlyMileage || 5000,
        };
      default:
        return {
          base: car?.rentPerDay,
          offer: car?.offerRentPerDay,
          final: car?.offerRentPerDay ?? car?.rentPerDay,
          label: "/day",
          mileage: car?.car?.dailyMileage || 250,
        };
    }
  }, [period, car]);

  const hasOffer =
    price?.offer !== null &&
    price?.offer !== undefined &&
    Number(price.offer) > 0;

  const specs = [
    {
      icon: <Users className="w-4 h-4" />,
      value: `${car?.car?.seatingCapacity || "-"} Seats`,
    },
    {
      icon: <Gauge className="w-4 h-4" />,
      value: car?.car?.transmission || "-",
    },
  ];

  const toggleDetails = () => {
    setShowDetails((prev) => {
      const next = !prev;
      if (next) setActiveTab("carInfo");
      return next;
    });
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative w-full md:w-[34%] h-[190px] md:h-[180px] bg-gray-100">
          <Image
            src={imageUrl}
            alt={car?.title || "car"}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 35vw"
          />

          {/* Tag */}
          <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
            {car?.car?.category || "Car"}
          </div>
        </div>

        {/* Content */}
        <div className="w-full md:w-[66%] p-4 flex flex-col gap-2 relative pb-2">
          {/* Title + Period Buttons */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-site-accent">
                {car?.car?.carBrand?.name || ""}
              </p>

              <h3 className="text-base font-extrabold text-gray-900 truncate leading-tight">
                {car?.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 mt-2">
              {(["daily", "weekly", "monthly"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                    period === p
                      ? "bg-gradient-to-r from-site-accent to-slate-teal text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div className="flex flex-wrap gap-3">
            {specs.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-1 text-xs font-semibold text-gray-700"
              >
                <span className="text-site-accent">{s.icon}</span>
                <span className="truncate">{s.value}</span>
              </div>
            ))}
          </div>

          {/* Price + Buttons Row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* LEFT */}
            <div>
              <div className="flex items-baseline gap-2">
                <DirhamSymbol className="w-6 h-6 relative top-[4px]" />

                {hasOffer ? (
                  <>
                    <span className="text-sm line-through text-gray-400 font-semibold">
                      {price.base?.toLocaleString()}
                    </span>

                    <span className="text-2xl font-extrabold text-green-600">
                      {price.final?.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-extrabold text-gray-900">
                    {price.final?.toLocaleString()}
                  </span>
                )}

                <span className="text-xs text-gray-500 font-semibold">
                  {price.label}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-1">
                <Gauge className="w-3.5 h-3.5 text-slate-teal" />
                <span>
                  {price?.mileage} km included {price?.label?.replace("/", "")}
                </span>
              </div>
            </div>

            {/* RIGHT Buttons */}
            <div className="flex flex-col items-end gap-1.5 w-full md:w-auto">
              <div className="flex gap-2 w-full md:w-[380px]">
                {/* Call */}
                <a
                  href={`tel:${callNumber}`}
                  onClick={(e) => {
                    e.preventDefault();
                    createClick({ carId: car._id, body: { type: "call" } })
                      .unwrap()
                      .catch(() => {})
                      .finally(() => {
                        setTimeout(() => {
                          window.location.href = `tel:${callNumber}`;
                        }, 150);
                      });
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:border-site-accent hover:text-site-accent transition"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </a>

                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    createClick({ carId: car._id, body: { type: "whatsapp" } })
                      .unwrap()
                      .catch(() => {})
                      .finally(() => {
                        setTimeout(() => {
                          window.open(
                            whatsappUrl,
                            "_blank",
                            "noopener,noreferrer",
                          );
                        }, 120);
                      });
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-site-accent/50 bg-white px-3 py-2 text-sm font-semibold text-site-accent hover:bg-site-accent hover:text-white transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>

                {/* Rent Now */}
                <Link
                  href={`/car/${car._id}`}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-site-accent to-slate-teal px-3 py-2 text-sm font-semibold text-white shadow hover:shadow-md transition"
                >
                  Rent Now
                </Link>
              </div>
            </div>
          </div>

          {/* Small info row */}
          <div className="flex items-center gap-3 text-[10px] text-grey relative">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-site-accent" />
              <span className="font-medium">Min {car?.minRentalDays} day</span>
            </div>

            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-site-accent" />
              <span className="font-medium">
                {car?.car?.carInsurance === "yes" ? "Insured" : "Not Insured"}
              </span>
            </div>

            {/* Toggle */}
            <button
              type="button"
              onClick={toggleDetails}
              className="absolute right-0 flex items-center gap-1 text-sm font-semibold text-site-accent hover:underline"
            >
              {showDetails ? "Less Details" : "More Details"}
              {showDetails ? (
                <Minus className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* DETAILS SECTION */}
      {showDetails && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-4">
          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-200 pb-3 mb-4">
            {(["carInfo", "overview", "features"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTab(t)}
                className={`text-sm font-semibold transition ${
                  activeTab === t
                    ? "text-gray-900 border-b-2 border-site-accent pb-2"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {t === "carInfo"
                  ? "Car info"
                  : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* LEFT BOX */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <h3 className="text-base font-bold text-gray-900 mb-3">
                {activeTab === "carInfo"
                  ? "Car info"
                  : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h3>

              {activeTab === "carInfo" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Specs Part 1 */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">
                        Model Year
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {car?.car?.modelYear || "-"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">
                        Body Type
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {car?.car?.bodyType || "-"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">
                        Transmission
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {car?.car?.transmission || "-"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">Seats</span>
                      <span className="text-gray-900 font-semibold">
                        {car?.car?.seatingCapacity || "-"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">
                        Fuel Type
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {car?.car?.fuelType || "-"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">Doors</span>
                      <span className="text-gray-900 font-semibold">
                        {car?.car?.doors || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Specs Part 2 */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">
                        Insurance
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {car?.car?.carInsurance === "yes"
                          ? "Included"
                          : "Not Included"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">
                        Warranty
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {car?.car?.warranty === "yes" ? "Yes" : "No"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">
                        Security Deposit
                      </span>
                      <span className="text-gray-900 font-semibold">
                        AED {(car?.securityDeposit || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "overview" && (
                <p className="text-sm font-medium text-gray-600 leading-relaxed">
                  {car?.description || "No overview available."}
                </p>
              )}

              {activeTab === "features" && (
                <div className="max-h-[220px] overflow-y-auto pr-2 space-y-4">
                  {/* Technical Features */}
                  {(car?.car?.techFeatures || []).length > 0 && (
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-2">
                        Technical Features
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(car?.car?.techFeatures || []).map(
                          (f: string, idx: number) => (
                            <div
                              key={`tech-${idx}`}
                              className="flex items-center gap-2 text-sm text-gray-700"
                            >
                              <CheckCircle className="w-4 h-4 text-site-accent shrink-0" />
                              <span className="break-words">{f}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Other Features */}
                  {(car?.car?.otherFeatures || []).length > 0 && (
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-2">
                        Other Features
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(car?.car?.otherFeatures || []).map(
                          (f: string, idx: number) => (
                            <div
                              key={`other-${idx}`}
                              className="flex items-center gap-2 text-sm text-gray-700"
                            >
                              <CheckCircle className="w-4 h-4 text-site-accent shrink-0" />
                              <span className="break-words">{f}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Fallback */}
                  {!car?.car?.techFeatures?.length &&
                    !car?.car?.otherFeatures?.length && (
                      <p className="text-sm text-gray-500">
                        No features available.
                      </p>
                    )}
                </div>
              )}
            </div>

            {/* RIGHT BOX */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <h3 className="text-base font-bold text-gray-900 mb-3">
                Car info
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs text-gray-500 font-semibold">Mileage</p>
                  <p className="text-sm font-bold text-gray-900">
                    {price?.mileage || 250} km/day
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs text-gray-500 font-semibold">
                    Transmission
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {car?.car?.transmission || "-"}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs text-gray-500 font-semibold">
                    Insurance
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {car?.car?.carInsurance === "yes"
                      ? "Insurance Included"
                      : "Not Included"}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs text-gray-500 font-semibold">
                    Body Type
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {car?.car?.bodyType || "-"}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs text-gray-500 font-semibold">
                    Fuel Type
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {car?.car?.fuelType || "-"}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs text-gray-500 font-semibold">Price</p>
                  <p className="text-sm font-bold text-gray-900">
                    AED {price?.final?.toLocaleString() || "-"} {price?.label}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Still have questions?
                  </p>
                  <p className="text-xs text-gray-500 font-medium">
                    Contact support for help
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="text-black/60 hover:text-slate-teal transition-colors text-sm"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactCarCard;
