"use client";

import { useEffect, useState } from "react";
import {
  Star,
  Users,
  Gauge,
  Shield,
  Calendar,
  CheckCircle,
  Phone,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import VerifiedBadge from "./VerifiedBadge";
import Link from "next/link";
import Image from "next/image";
import { type CarTypes } from "@/types/homePageTypes";
import DirhamSymbol from "../shared/DirhamSymbol";
import { useCreateClickMutation } from "@/lib/api/car";
import { useRouter } from "@bprogress/next/app";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/util/watsapp";

interface CarCardProps {
  car: CarTypes;
}

const CarCard = ({ car }: CarCardProps) => {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [imgSrc, setImgSrc] = useState("/assets/car_placeholder.png");

  const [createClick] = useCreateClickMutation();

  useEffect(() => {
    if (car) {
      setImgSrc(car.car.coverImage?.url || "/assets/car_placeholder.png");
    }
  }, [car]);

  /* ===================== PRICE LOGIC (WITH OFFERS) ===================== */
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
  /* =================================================================== */

  const getTransmissionSubstring = () => {
    switch (car.car.transmission?.toLowerCase()) {
      case "automatic":
        return "Auto";
      case "manual":
        return "Manual";
      case "semi-automatic":
        return "Semi-Auto";
    }
  };

  const handleButtonsClick = (type: string, navigateTo: string) => {
    createClick({ carId: car._id, body: { type } }).catch(() => {});
    router.push(navigateTo);
  };

  const whatsappUrl = buildWhatsAppUrl(
    car?.vendor?.vendorDetails?.contact?.whatsappNum,
    `${buildWhatsAppMessage(
      car as CarTypes
    )}\n\n*Any changes made to this message will result in the inquiry not being sent to the dealer.*`
  );

  return (
    <div className="flex-shrink-0 h-fit w-full sm:w-[340px] bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-out-cubic group border border-soft-grey/30">
      <Link href={`/car/${car._id}`} className="block" prefetch={false}>
        <div className="relative h-40 md:h-44 overflow-hidden bg-gradient-to-br from-slate-teal/5 to-transparent">
          <Image
            src={imgSrc}
            alt={car.title}
            className="w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out-cubic object-cover"
            height={960}
            width={1280}
            onError={() => setImgSrc("/assets/car_placeholder.jpg")}
            priority
          />

          <div className="absolute top-4 right-4 bg-white/98 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-dark-base">4.7</span>
          </div>

          {hasOffer && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg">
              Special Offer
            </div>
          )}
        </div>
      </Link>

      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <p className="text-[10px] text-slate-teal font-bold uppercase tracking-wide">
              {car.car.carBrand.name}
            </p>
            <Link href={`/car/${car._id}`} prefetch={false}>
              <h3 className="text-base font-bold text-dark-base truncate">
                {car.title}
              </h3>
            </Link>
          </div>

          <Image
            src={car.car.carBrand.logo.url}
            alt={car.car.carBrand.name}
            height={40}
            width={40}
            className="w-8 h-8 rounded-lg object-contain bg-white border p-1"
          />
        </div>

        {/* PERIOD SWITCH */}
        <div className="flex gap-1 mb-2">
          {(["daily", "weekly", "monthly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`px-2 py-1 rounded text-[9px] font-semibold transition ${
                selectedPeriod === p
                  ? "bg-gradient-to-r from-site-accent to-slate-teal text-white"
                  : "bg-slate-teal/10 text-slate-teal"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* PRICE */}
        <div className="flex items-baseline gap-1">
          <DirhamSymbol className="w-[30px] h-[30px] relative top-[6px]" />

          {hasOffer ? (
            <>
              <span className="text-sm text-gray-400 line-through font-semibold">
                {price.base?.toLocaleString()}
              </span>
              <span className="text-2xl font-bold text-green-600">
                {price.final?.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-dark-base">
              {price.final?.toLocaleString()}
            </span>
          )}

          <span className="text-[10px] text-grey">{price.label}</span>
        </div>

        <div className="flex items-center gap-1.5 mt-1 text-[9px] text-grey">
          <Gauge className="w-3 h-3 text-slate-teal" />
          {price.mileage} km included
        </div>

        <div className="flex items-center gap-3 my-2 text-[10px] text-grey">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-slate-teal" /> Min{" "}
            {car.minRentalDays} day
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-slate-teal" />
            {car.car.carInsurance === "yes" ? "Insured" : "Not Insured"}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[9px] mb-2 border-b pb-2">
          <span>By</span>
          <Link
            href={`/catalog/vendor-cars/${car.vendor?._id}`}
            className="font-bold truncate"
          >
            {car.vendor?.vendorDetails?.businessName}
          </Link>
          <VerifiedBadge className="w-3 h-3" />
        </div>

        <div className="flex justify-between text-[10px] text-grey mb-3">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3 text-slate-teal" />
            {car.car.seatingCapacity} Seats
          </span>
          <span className="flex items-center gap-1">
            <Gauge className="w-3 h-3 text-slate-teal" />
            {getTransmissionSubstring()}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-teal" />
            Available
          </span>
        </div>

        {/* ACTIONS */}
        <div className="space-y-3">
          <button
            onClick={() => handleButtonsClick("rent", `/car/${car._id}`)}
            className="flex items-center justify-center gap-1 w-full  bg-gradient-to-r from-site-accent to-slate-teal hover:from-site-accent/90 hover:to-slate-teal text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 hover:shadow-lg text-xs group/btn"
          >
            <span>Rent Now</span>
            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </button>
          <div className="flex items-center gap-2">
            <a
              href={`tel:${car.vendor?.vendorDetails?.contact?.landlineNum}`}
              onClick={(e) => {
                e.preventDefault();
                createClick({ carId: car._id, body: { type: "call" } })
                  .unwrap()
                  .then((res) => {
                    console.log("CarCard:Click res", res);
                  })
                  .catch((err) => {
                    console.log("CarCard:Click err", err);
                  })
                  .finally(() => {
                    setTimeout(() => {
                      window.location.href = `tel:${car.vendor?.vendorDetails?.contact?.landlineNum}`;
                    }, 200);
                  });
              }}
              className="flex-1 flex items-center justify-center gap-1 bg-white border border-slate-teal/30 text-slate-teal hover:border-slate-teal hover:bg-slate-teal/5 px-2 py-1.5 rounded-lg font-semibold transition-all duration-300 text-[10px]"
            >
              <Phone className="w-4 h-4" />
              Call
            </a>

            {/* ===== FIXED CHAT using helpers + warning line ===== */}
            <a
              href={whatsappUrl}
              onClick={(e) => {
                e.preventDefault();
                createClick({ carId: car._id, body: { type: "whatsapp" } })
                  .unwrap()
                  .catch((err) => {
                    console.log("CarCard:Click err", err);
                  })
                  .finally(() => {
                    setTimeout(() => {
                      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
                    }, 150);
                  });
              }}
              className="flex-1 flex items-center justify-center gap-1 bg-white border border-site-accent/30 text-site-accent hover:bg-site-accent hover:text-white hover:border-site-accent px-2 py-1.5 rounded-lg font-semibold transition-all duration-300 text-[10px] hover:shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
            {/* =================================================== */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
