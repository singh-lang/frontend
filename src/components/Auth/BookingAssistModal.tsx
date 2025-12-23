
"use client";

import { X, User, Mail, Phone, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCreateCustomerLeadMutation } from "@/lib/api/leadCustomerApi";
import { toast } from "sonner";

interface BookingAssistFormInputs {
  name: string;
  email: string;
  phone: string;
}

interface BookingAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  carId?: string;
  onSubmit?: (data: { name: string; email: string; phone: string }) => void;
}

const BookingAssistModal = ({ isOpen, onClose, carId }: BookingAssistModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<BookingAssistFormInputs>({
    defaultValues: { name: "", email: "", phone: "" },
  });

  const [createCustomerLead] = useCreateCustomerLeadMutation();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // ---- CALL & WHATSAPP HELPERS ----
  const telHref = "tel:+971564727007";
  const whatsappNumber = "971564727007"; // wa.me must not include '+'

  // Build these unconditionally (no hooks needed)
  const carLink = carId
    ? `https://thedrivehub.com/car/${carId}`
    : `https://thedrivehub.com/`;

  const whatsappText = carId
    ? `Hi The Drive Hub team! I'm interested in this car.\nCar ID: ${carId}\nLink: ${carLink}\nPlease help me book.`
    : `Hi The Drive Hub team! I'd like help booking a car. Please assist.`;

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

  if (!isOpen) return null;

  const handleFormSubmit: SubmitHandler<BookingAssistFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        carId,
        name: data.name,
        email: data.email,
        phoneNum: data.phone,
      };

      await createCustomerLead(payload).unwrap();

      toast.success("Your request has been submitted successfully!");
      reset();
      onClose();
    } catch (error) {
      console.error("Customer Lead submission failed:", error);
      toast.error(" Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-dark-base/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out] overflow-y-auto">
      <div className="relative w-full max-w-md bg-off-white rounded-xl md:rounded-2xl shadow-2xl animate-[slideUp_0.3s_ease-out] my-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-grey/10 hover:bg-grey/20 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-dark-base" />
        </button>

        <div className="px-5 sm:px-6 md:px-8 py-8">
          <div className="text-center mb-6">
            <Image
              src="/assets/dlogo.png"
              alt="The Drive Hub"
              height={80}
              width={90}
              className="mx-auto mb-3"
            />
            <h2 className="text-2xl md:text-3xl font-bold text-dark-base mb-2">
              Our Online Payment Took a Coffee Break ☕
            </h2>
            <p className="text-sm md:text-base text-grey leading-relaxed">
              No worries — share your details below or contact <b>The Drive Hub Support</b>, and
              we’ll book your car for you faster than your coffee cools down.
              {carId && (
                <>
                  {" "}
                  <a
                    href={carLink}
                    className="text-site-accent underline underline-offset-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View this car
                  </a>
                  .
                </>
              )}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
            <div>
              <label className="block text-sm font-medium text-dark-base mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey" />
                <input
                  {...register("name", { required: true })}
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-grey/20 rounded-xl focus:border-site-accent focus:outline-none text-dark-base"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-base mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey" />
                <input
                  {...register("email", { required: true })}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-grey/20 rounded-xl focus:border-site-accent focus:outline-none text-dark-base"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-base mb-2">Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey" />
                <div className="absolute left-10 top-1/2 -translate-y-1/2 text-grey font-medium">
                  +971
                </div>
                <input
                  {...register("phone", { required: true })}
                  className="w-full pl-20 pr-4 py-3 bg-white border border-grey/20 rounded-xl focus:border-site-accent focus:outline-none text-dark-base"
                  placeholder="50 123 4567"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-site-accent text-white font-semibold rounded-xl hover:bg-site-accent/90 transition-all disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Share My Details"}
            </button>

            {/* --- QUICK ACTIONS: CALL & WHATSAPP --- */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={telHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-grey/20 bg-white px-4 py-3 text-dark-base hover:bg-grey/10 transition"
              >
                <Phone className="h-5 w-5" />
                Call
              </a>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-grey/20 bg-white px-4 py-3 text-dark-base hover:bg-grey/10 transition"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
            </div>

            <p className="text-center text-sm text-grey mt-3">
              Or contact us directly at{" "}
              <a href="mailto:support@thedrivehub.com" className="text-site-accent hover:underline">
                support@thedrivehub.com
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingAssistModal;
