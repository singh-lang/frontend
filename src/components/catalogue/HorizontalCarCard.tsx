"use client";

import { useEffect, useState, useRef } from "react";
import {
  Star,
  Users,
  Gauge,
  Fuel,
  Calendar,
  MessageCircle,
  Shield,
  CheckCircle,
  Phone,
  Plus,
  ArrowLeftRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import VerifiedBadge from "../home/VerifiedBadge";
import Image from "next/image";
import Link from "next/link";
import type { CarTypes } from "@/types/homePageTypes";
import DirhamSymbol from "../shared/DirhamSymbol";
import { useComparison } from "@/contexts/ComparisionContext";
import { useCreateClickMutation } from "@/lib/api/car";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/util/watsapp";

interface HorizontalCarCardProps {
  car: CarTypes;
}

const HorizontalCarCard = ({ car }: HorizontalCarCardProps) => {
  const [imgSrc, setImgSrc] = useState("/assets/car_placeholder.png");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const [selectedPeriod, setSelectedPeriod] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [createClick] = useCreateClickMutation();

  // ✅ Comparison logic
  const {
    addToComparison,
    removeFromComparison,
    isInComparison,
    comparisonCars,
  } = useComparison();
  const inComparison = isInComparison(car._id);

  // Toggle compare
  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (inComparison) removeFromComparison(car._id);
    else if (comparisonCars.length < 3) addToComparison(car);
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setCurrentImageIndex(0);
  };

  const handleCardClick = () => router.push(`/car/${car._id}`);

  // 🧭 Pointer-based image control
  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!car?.car?.images?.length) return;
    const container = imageContainerRef.current;
    if (!container) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const rect = container.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, relativeX / rect.width));
    const newIndex = Math.min(
      car.car.images.length - 1,
      Math.floor(percentage * car.car.images.length)
    );
    if (newIndex !== currentImageIndex) setCurrentImageIndex(newIndex);
  };

  useEffect(() => {
    if (car) {
      setImgSrc(
        car?.car?.images?.[currentImageIndex]?.url ||
          "/assets/car_placeholder.png"
      );
    }
  }, [car, currentImageIndex]);
  const getPriceForPeriod = () => {
    switch (selectedPeriod) {
      case "daily":
        return {
          base: car.rentPerDay,
          offer: car.offerRentPerDay,
          final: car.offerRentPerDay ?? car.rentPerDay,
          label: "/day",
          mileage: car.car.dailyMileage || 250,
        };

      case "weekly":
        return {
          base: car.rentPerWeek,
          offer: car.offerRentPerWeek,
          final: car.offerRentPerWeek ?? car.rentPerWeek,
          label: "/week",
          mileage: car.car.weeklyMileage || 1500,
        };

      case "monthly":
        return {
          base: car.rentPerMonth,
          offer: car.offerRentPerMonth,
          final: car.offerRentPerMonth ?? car.rentPerMonth,
          label: "/month",
          mileage: car.car.monthlyMileage || 5000,
        };
    }
  };

  const price = getPriceForPeriod();

  const hasOffer =
    price?.offer !== null &&
    price?.offer !== undefined &&
    Number(price.offer) > 0;

  const getTransmissionSubstring = () => {
    switch (car?.car?.transmission?.toLowerCase()) {
      case "automatic":
        return "Auto";
      case "manual":
        return "Manual";
      case "semi-automatic":
        return "Semi-Auto";
      default:
        return car?.car?.transmission;
    }
  };

  // ✅ Prebuild WhatsApp URL with message + warning line (consistent across components)
  const whatsappNumber =
    car?.vendor?.vendorDetails?.contact?.whatsappNum?.replaceAll(" ", "") ||
    "971501234567";
  const whatsappUrl = buildWhatsAppUrl(
    whatsappNumber,
    `${buildWhatsAppMessage(
      car as CarTypes
    )}\n\n*Any changes made to this message will result in the inquiry not being sent to the dealer.*`
  );

  const callNumber =
    car?.vendor?.vendorDetails?.contact?.mobileNum || "+971501234567";
  const specs = [
    {
      icon: <Calendar className="w-4 h-4" />,
      value: car?.car?.modelYear,
      label: "Year",
    },
    {
      icon: <Users className="w-4 h-4" />,
      value: `${car?.car?.seatingCapacity} Seats`,
      label: "Seats",
    },
    {
      icon: <Gauge className="w-4 h-4" />,
      value: getTransmissionSubstring(),
      label: "Trans",
    },
    {
      icon: <Fuel className="w-4 h-4" />,
      value: car?.car?.fuelType,
      label: "Fuel",
    },
  ];
  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer  w-full lg:w-[1200px] bg-gradient-to-br from-white to-gray-100 border border-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 group mb-6"
    >
      <div className="flex flex-col md:flex-row">
        {/* IMAGE SECTION */}
        <div
          ref={imageContainerRef}
          className="md:w-[40%] relative overflow-hidden bg-gray-100 select-none isolate"
          style={{ height: 390 }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
        >
          <Image
            src={imgSrc}
            alt={`${car?.car?.carBrand?.name} image`}
            fill
            priority={false}
            sizes="(max-width: 768px) 100vw, 40vw"
            className={`object-cover transition-transform duration-500 ${
              isHovering ? "scale-[1.05]" : "scale-100"
            }`}
            onError={() => setImgSrc("/assets/car_placeholder.jpg")}
          />

          {/* Compare Button */}
          <button
            onClick={handleCompareClick}
            className={`absolute bottom-4 left-4 px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1 text-xs font-bold transition-all ${
              inComparison
                ? "bg-site-accent text-white"
                : "bg-white/95 text-site-accent hover:bg-site-accent hover:text-white"
            }`}
            title={
              inComparison ? "Remove from comparison" : "Add to comparison"
            }
          >
            {inComparison ? (
              <ArrowLeftRight className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>Compare</span>
          </button>

          {/* Rating */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold text-primary">4.7</span>
          </div>

          {/* Dots for multiple images */}
          {car?.car?.images?.length > 1 && (
            <div className="absolute bottom-4 right-4 flex gap-1.5">
              {car?.car?.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-site-accent w-6"
                      : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="p-6 w-full md:w-[60%] flex flex-col justify-between">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-site-accent font-semibold  text-sm mb-1">
                {car?.car?.carBrand?.name}
              </p>
              <h3
                className="text-xl font-bold text-primary mb-1 "
                style={{ fontFamily: "Stretch Pro, sans-serif" }}
              >
                {car?.title}
              </h3>
              <p className="text-site-secondary text-xs font-semibold">
                {car?.car?.modelYear} Model
              </p>
            </div>

            <Image
              height={100}
              width={100}
              src={
                car?.vendor?.profilePicture?.url ||
                "/assets/car_placeholder.png"
              }
              alt={car?.vendor?.vendorDetails?.businessName || "Vendor"}
              className="w-12 h-12 rounded-xl object-contain bg-white border border-gray-200"
            />
          </div>
          <div
            className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs text-site-secondary font-medium">
              Provided by
            </span>
            <Link
              href={`/catalog/vendor-cars/${car?.vendor?._id}`}
              className="text-sm font-semibold text-primary"
            >
              {car?.vendor?.vendorDetails?.businessName}
            </Link>
            <VerifiedBadge className="w-5 h-5" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {specs.map((item, i) => (
              <div
                key={i}
                className="
                  flex items-center gap-3
                  rounded-2xl border border-gray-200 bg-white
                  px-4 py-3
                  shadow-sm hover:shadow-md transition
                "
              >
                <div
                  className="
                  w-10 h-10 rounded-full
                  bg-site-accent/10
                  flex items-center justify-center
                "
                >
                  {item.icon}
                </div>
                <div className="leading-tight">
                  <p className="text-[11px] text-gray-500 font-semibold">
                    {item.label}
                  </p>
                  <p className="text-sm font-extrabold text-gray-900 truncate">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-2">
            <div>
              <div
                className="flex gap-2 mb-2"
                onClick={(e) => e.stopPropagation()}
              >
                {(["daily", "weekly", "monthly"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPeriod(p)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                      selectedPeriod === p
                        ? "bg-gradient-to-r from-site-accent to-slate-teal text-white shadow-md scale-105"
                        : "bg-slate-teal/10 text-slate-teal hover:bg-slate-teal/20"
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex items-baseline gap-2">
                <DirhamSymbol className="w-[30px] h-[30px] relative top-[6px] text-[#00B4D8]" />

                {hasOffer ? (
                  <>
                    <span className="text-sm line-through text-gray-400 font-semibold">
                      {price.base?.toLocaleString()}
                    </span>

                    <span className="text-2xl font-bold text-green-600">
                      {price.final?.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-site-grey">
                    {price.final?.toLocaleString()}
                  </span>
                )}

                <span className="text-site-secondary text-xs">
                  {price.label}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-grey font-medium mb-1">
                <Gauge className="w-3.5 h-3.5 text-slate-teal" />
                <span>
                  {price?.mileage} km included {price?.label?.replace("/", "")}
                </span>
              </div>

              <div className="flex items-center gap-4 text-[10px] text-grey">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-site-accent" />
                  <span className="font-medium">
                    Min {car.minRentalDays} day
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-site-accent" />
                  <span className="font-medium">
                    {car.car.carInsurance == "yes" ? "Insured" : "Not Insured"}
                  </span>
                </div>
              </div>
            </div>
            <div
              className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between sm:justify-end gap-2 mt-4 w-full"
              onClick={(e) => e.stopPropagation()}
            >
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
                      }, 200);
                    });
                }}
                className="flex-1 flex items-center justify-center gap-2 whitespace-nowrap bg-gradient-to-br from-white to-off-white border-2 border-soft-grey/50 text-site-grey hover:border-site-accent hover:text-site-accent hover:bg-white px-5 py-3 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <Phone className="w-5 h-5" />
                Call
              </a>
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
                          "noopener,noreferrer"
                        );
                      }, 150);
                    });
                }}
                className="flex-1 flex items-center justify-center gap-2 whitespace-nowrap bg-gradient-to-br from-white to-off-white border-2 border-site-accent/60 text-site-accent hover:border-site-accent hover:text-white hover:bg-gradient-to-r hover:from-site-accent hover:to-site-accent/90 px-5 py-3 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>

              <Link
                href={`/car/${car._id}`}
                className="flex-1 flex items-center justify-center gap-2 whitespace-nowrap bg-gradient-to-r from-site-accent to-slate-teal hover:from-site-accent hover:to-slate-teal text-white px-5  py-3 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base shadow-lg hover:shadow-lg hover:-translate-y-0.5"
              >
                Rent Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalCarCard;
