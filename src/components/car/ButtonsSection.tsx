"use client";

import { type CarTypes } from "@/types/homePageTypes";
import { MessageCircle, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

import { useCreateClickMutation } from "@/lib/api/car";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/util/watsapp";

interface ButtonsSectionProps {
  car: CarTypes;
}

const ButtonsSection = ({ car }: ButtonsSectionProps) => {
  const router = useRouter();
  const [createClick] = useCreateClickMutation();

  /* ---------------- WHATSAPP ---------------- */
  const whatsappNumber =
    car?.vendor?.vendorDetails?.contact?.whatsappNum || "971501234567";

  const whatsappUrl = buildWhatsAppUrl(
    whatsappNumber,
    `${buildWhatsAppMessage(
      car
    )}\n\n*Any changes made to this message will result in the inquiry not being sent to the dealer.*`
  );

  /* ---------------- RENT NOW ---------------- */
  const handleRentNow = () => {
    // analytics click
    createClick({ carId: car._id, body: { type: "rent" } }).catch(() => {});

    // 👉 redirect to booking page
    router.push(`/booking/${car._id}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-soft-grey/20">
      {/* CALL */}
      <button
        onClick={(e) => {
          e.preventDefault();
          createClick({ carId: car._id, body: { type: "call" } }).finally(
            () => {
              window.open(
                `tel:${
                  car.vendor?.vendorDetails?.contact?.mobileNum ||
                  "+971501234567"
                }`,
                "_self"
              );
            }
          );
        }}
        className="flex items-center justify-center gap-2 bg-white border-2 border-soft-grey/40 px-5 py-3 rounded-xl font-semibold hover:bg-soft-grey/10 transition"
      >
        <Phone className="w-4 h-4" />
        Call Now
      </button>

      {/* WHATSAPP */}
      <button
        onClick={(e) => {
          e.preventDefault();
          createClick({ carId: car._id, body: { type: "whatsapp" } }).finally(
            () => window.open(whatsappUrl, "_blank")
          );
        }}
        className="flex items-center justify-center gap-2 bg-white border-2 border-site-accent text-site-accent px-5 py-3 rounded-xl font-semibold hover:bg-site-accent/5 transition"
      >
        <MessageCircle className="w-4 h-4" />
        WhatsApp
      </button>

      {/* RENT NOW */}
      <button
        onClick={handleRentNow}
        className="flex-1 bg-gradient-to-r from-site-accent to-slate-teal text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition"
      >
        Rent Now
      </button>
    </div>
  );
};

export default ButtonsSection;
