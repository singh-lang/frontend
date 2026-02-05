"use client";

import { useMemo, useState, useEffect } from "react";
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
  const [isHovering, setIsHovering] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSheet, setShowSheet] = useState(false);

  // ✅ works for SEARCH + CATALOG
  const images = car?.car?.images ?? [];

  const imageUrl =
    car?.car?.coverImage?.url ||
    car?.car?.images?.[0]?.url ||
    "/assets/car_placeholder.png";

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
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  useEffect(() => {
    if (showSheet) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showSheet]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const closeSheet = () => {
    setShowSheet(false);
    setActiveTab("carInfo");
  };
  const FIXED_CALL_NUMBER = "++971 50 148 0802";

  const FIXED_WHATSAPP_NUMBER = "+971 50 148 0802";
  const fixedWhatsappUrl = buildWhatsAppUrl(
    FIXED_WHATSAPP_NUMBER,
    `${buildWhatsAppMessage(car)}\n\n*Any changes made to this message will result in the inquiry not being sent to the dealer.*`,
  );

  return (
    <>
      <div className="w-full group rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          {/* IMAGE SECTION */}
          <div className="relative w-full md:w-[34%] h-[190px] md:h-[180px] bg-gray-100 overflow-hidden group">
            {/* IMAGE */}
            <div
              className="relative w-full h-full cursor-pointer"
              onClick={() => {
                setActiveIndex(0);
                setShowGallery(true);
              }}
            >
              <Image
                src={imageUrl}
                alt={car?.title || "car"}
                fill
                className="
        object-cover
        transition-transform
        duration-500
        ease-out
        group-hover:scale-[1.08]
      "
                sizes="(max-width:768px) 100vw, 35vw"
                priority={false}
              />

              {/* HOVER OVERLAY (DESKTOP ONLY) */}
              <div
                className="
      absolute inset-0
      hidden md:flex
      items-center justify-center
      bg-black/40
      opacity-0
      group-hover:opacity-100
      transition
    "
              >
                <span
                  className="
        text-white/90
        text-sm
        font-semibold
        bg-black/60
        px-4 py-2
        rounded-full
      "
                >
                  Click To Large
                </span>
              </div>
            </div>

            {/* CATEGORY BADGE */}
            <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
              {car?.car?.category || "Car"}
            </div>

            {showGallery && images.length > 0 && (
              <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
                {/* Close */}
                <button
                  onClick={() => setShowGallery(false)}
                  className="absolute top-4 right-4 text-white text-3xl font-bold"
                >
                  ✕
                </button>

                {/* Image */}
                <div className="relative w-full max-w-4xl h-[70vh] px-4">
                  <Image
                    src={images[activeIndex].url}
                    alt="car image"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>

                {/* Left */}
                <button
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1,
                    )
                  }
                  className="
    absolute left-4
    w-10 h-10
    flex items-center justify-center
    rounded-full
    bg-gradient-to-r from-site-accent to-slate-teal
   
    text-white text-2xl
    shadow-md
  
    transition"
                >
                  ‹
                </button>

                {/* Right */}
                <button
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1,
                    )
                  }
                  className="absolute right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-site-accent to-slate-teal  text-white text-2xl shadow-md  transition"
                >
                  ›
                </button>
              </div>
            )}

            <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
              {car?.car?.category || "Car"}
            </div>
          </div>
          <div className="w-full md:w-[66%] p-4 flex flex-col gap-2 relative pb-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-site-accent truncate">
                  {car?.car?.carBrand?.name || ""}
                </p>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {(["daily", "weekly", "monthly"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPeriod(p)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition whitespace-nowrap ${
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

              <h3 className="text-base font-extrabold text-gray-900 leading-tight line-clamp-2">
                {car?.title}
              </h3>
            </div>
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
                    {price?.mileage} km included{" "}
                    {price?.label?.replace("/", "")}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 w-full md:w-auto">
                <div className="flex gap-2 w-full md:w-[380px]">
                  {/* Call */}
                  {/* <a
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
                </a> */}
                  <a
                    href={`tel:${FIXED_CALL_NUMBER}`}
                    onClick={(e) => {
                      e.preventDefault();
                      createClick({ carId: car._id, body: { type: "call" } })
                        .unwrap()
                        .catch(() => {})
                        .finally(() => {
                          setTimeout(() => {
                            window.location.href = `tel:${FIXED_CALL_NUMBER}`;
                          }, 150);
                        });
                    }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:border-site-accent hover:text-site-accent transition"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </a>
                  {/* <a
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
                </a> */}
                  <a
                    href={fixedWhatsappUrl}
                    onClick={(e) => {
                      e.preventDefault();
                      createClick({
                        carId: car._id,
                        body: { type: "whatsapp" },
                      })
                        .unwrap()
                        .catch(() => {})
                        .finally(() => {
                          setTimeout(() => {
                            window.open(
                              fixedWhatsappUrl,
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
                  <Link
                    href={`/booking/${car._id}`}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-site-accent to-slate-teal px-3 py-2 text-xs  md:text-sm font-semibold text-white shadow hover:shadow-md transition"
                  >
                    Rent Now
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-grey relative">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-site-accent" />
                <span className="font-medium">
                  Min {car?.minRentalDays} day
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-site-accent" />
                <span className="font-medium">
                  {car?.car?.carInsurance === "yes" ? "Insured" : "Not Insured"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (isMobile) {
                    setShowSheet(true); // 📱
                  } else {
                    setShowDetails((p) => !p); // 💻
                  }
                }}
                className="absolute right-0 flex items-center gap-1 text-sm font-semibold text-site-accent"
              >
                More Details
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {showDetails && !isMobile && (
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 h-[500px] overflow-y-auto">
            <div className="flex items-center gap-6 border-b border-gray-200 mb-4">
              {(["carInfo", "overview", "features"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`pb-3 text-sm font-semibold transition relative
            ${
              activeTab === t
                ? "text-gray-900 after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:bg-site-accent"
                : "text-gray-500 hover:text-gray-900"
            }
          `}
                >
                  {t === "carInfo"
                    ? "Important Info"
                    : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <h3 className="text-base font-bold text-gray-900 mb-4">
                  {activeTab === "carInfo"
                    ? "Important Information"
                    : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h3>
                {activeTab === "carInfo" && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        [
                          "Price",
                          `AED ${car?.rentPerDay?.toLocaleString() || "-"}/day`,
                        ],
                        [
                          "Security Deposit",
                          `AED ${(car?.securityDeposit || 0).toLocaleString()}`,
                        ],
                        ["Minimum Rental Days", car?.minRentalDays || "-"],
                        [
                          "Extra Mileage Rate",
                          `AED ${(car?.extraMileageRate || 0).toLocaleString()}`,
                        ],
                        ["Toll Charges", car?.tollCharges ?? "-"],
                        [
                          "Mileage",
                          `${price?.mileage} km ${price?.label?.replace("/", "")}`,
                        ],
                      ].map(([label, value], i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-gray-200 bg-gray-50 p-3"
                        >
                          <p className="text-xs text-gray-500 font-medium">
                            {label}
                          </p>
                          <p className="text-sm font-bold text-gray-900 mt-1">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Still have questions?
                        </p>
                        <p className="text-xs text-gray-500">
                          Our support team is here to help
                        </p>
                      </div>
                      <Link
                        href="/contact"
                        className="text-sm font-semibold text-site-accent underline hover:opacity-80"
                      >
                        Contact Support
                      </Link>
                    </div>
                  </>
                )}
                {activeTab === "overview" && (
                  <div className="h-[320px] overflow-y-auto pr-2">
                    <p className="text-sm font-medium text-gray-600 leading-relaxed">
                      {car?.description || "No overview available."}
                    </p>
                  </div>
                )}
                {activeTab === "features" && (
                  <div className="max-h-[320px] overflow-y-auto pr-2 space-y-4">
                    {(car?.car?.techFeatures || []).length > 0 && (
                      <div>
                        <p className="text-sm font-bold text-gray-900 mb-2">
                          Technical Features
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {car.car.techFeatures.map(
                            (f: string, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-sm font-medium text-gray-600"
                              >
                                <CheckCircle className="w-4 h-4 text-site-accent shrink-0" />
                                <span>{f}</span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {(car?.car?.otherFeatures || []).length > 0 && (
                      <div>
                        <p className="text-sm font-bold text-gray-900 mb-2">
                          Other Features
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {car.car.otherFeatures.map(
                            (f: string, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-sm font-medium text-gray-600"
                              >
                                <CheckCircle className="w-4 h-4 text-site-accent shrink-0" />
                                <span>{f}</span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {!car?.car?.techFeatures?.length &&
                      !car?.car?.otherFeatures?.length && (
                        <p className="text-sm text-gray-500">
                          No features available.
                        </p>
                      )}
                  </div>
                )}
              </div>
              <div className="bg-white rounded-2xl max-h-[700px] border border-gray-200 p-4">
                <h3 className="text-base font-bold text-gray-900 mb-4">
                  Car Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    [
                      ["Model Year", car?.car?.modelYear],
                      ["Car Model", car?.car?.carModel],
                      ["Body Type", car?.car?.bodyType],
                      ["Regional Specs", car?.car?.regionalSpecs],
                      ["Transmission", car?.car?.transmission],
                      ["Seats", car?.car?.seatingCapacity],
                      ["Fuel Type", car?.car?.fuelType],
                      ["Doors", car?.car?.doors],
                    ],
                    [
                      [
                        "Insurance",
                        car?.car?.carInsurance === "yes"
                          ? "Included"
                          : "Not Included",
                      ],
                      ["Warranty", car?.car?.warranty === "yes" ? "Yes" : "No"],
                      ["Location", car?.location],
                      ["Horse Power", car?.car?.horsePower],
                      ["Air Bags", car?.car?.airBags],
                      ["Tank Capacity", car?.car?.tankCapacity],
                      ["Interior Color", car?.car?.interiorColor],
                      ["Exterior Color", car?.car?.exteriorColor],
                    ],
                  ].map((group, idx) => (
                    <div key={idx} className="space-y-3">
                      {group.map(([label, value], i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">
                            {label}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {value || "-"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {showSheet && (
        <div className="fixed inset-0 z-[999] md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSheet(false)}
          />
          <div
            className="
        absolute bottom-0 left-0 right-0
        h-[85vh]
        bg-white
        rounded-t-3xl
        shadow-xl
        animate-slideUp
        flex flex-col
      "
          >
            <div className="flex justify-center py-3">
              <div className="w-12 h-1.5 rounded-full bg-gray-300" />
            </div>
            <div className="flex items-center justify-between px-4 pb-2 border-b">
              <h3 className="text-base font-bold text-gray-900">
                {car?.title}
              </h3>
              <button
                onClick={() => setShowSheet(false)}
                className="text-gray-500 text-2xl"
              >
                ✕
              </button>
            </div>
            <div
              className="
        flex gap-6
        px-4 py-3
        overflow-x-auto
        whitespace-nowrap
        border-b
        scrollbar-hide
      "
            >
              {(["carInfo", "overview", "features"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`pb-2 text-sm font-semibold transition relative
              ${
                activeTab === t
                  ? "text-site-accent after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:bg-site-accent"
                  : "text-gray-500"
              }
            `}
                >
                  {t === "carInfo"
                    ? "Important Info"
                    : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {activeTab === "carInfo" && (
                <div className="space-y-1">
                  {[
                    ["Model Year", car?.car?.modelYear],
                    ["Car Model", car?.car?.carModel],
                    ["Body Type", car?.car?.bodyType],
                    ["Regional Specs", car?.car?.regionalSpecs],
                    ["Transmission", car?.car?.transmission],
                    ["Seats", car?.car?.seatingCapacity],
                    ["Fuel Type", car?.car?.fuelType],
                    ["Doors", car?.car?.doors],

                    [
                      "Insurance",
                      car?.car?.carInsurance === "yes"
                        ? "Included"
                        : "Not Included",
                    ],
                    ["Warranty", car?.car?.warranty === "yes" ? "Yes" : "No"],
                    ["Location", car?.location],
                    ["Horse Power", car?.car?.horsePower],
                    ["Air Bags", car?.car?.airBags],
                    ["Tank Capacity", car?.car?.tankCapacity],
                    ["Interior Color", car?.car?.interiorColor],
                    ["Exterior Color", car?.car?.exteriorColor],
                  ].map(([label, value], i) => (
                    <div key={i} className="flex justify-between  p-1 text-sm">
                      <span className="text-gray-600 font-medium">{label}</span>
                      <span className="font-semibold text-gray-900">
                        {value || "-"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "overview" && (
                <div className="h-[320px] overflow-y-auto pr-2">
                  <p className="text-sm font-medium text-gray-600 leading-relaxed">
                    {car?.description || "No overview available."}
                  </p>
                </div>
              )}
              {activeTab === "features" && (
                <div className=" overflow-y-auto pr-2 space-y-4">
                  {(car?.car?.techFeatures || []).length > 0 && (
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-2">
                        Technical Features
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {car.car.techFeatures.map((f: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm text-gray-700"
                          >
                            <CheckCircle className="w-4 h-4 text-site-accent shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(car?.car?.otherFeatures || []).length > 0 && (
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-2">
                        Other Features
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {car.car.otherFeatures.map((f: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm text-gray-700"
                          >
                            <CheckCircle className="w-4 h-4 text-site-accent shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!car?.car?.techFeatures?.length &&
                    !car?.car?.otherFeatures?.length && (
                      <p className="text-sm text-gray-500">
                        No features available.
                      </p>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompactCarCard;
