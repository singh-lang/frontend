"use client";

import { X, FileText, CheckCircle, FileSignature } from "lucide-react";
import { useEffect, useState } from "react";
import { useCreateBookingMutation } from "@/lib/api/booking";
import { useAppSelector } from "@/lib/hooks";
import { toast } from "sonner";

interface PDFPreviewModalProps {
  onClose: () => void;
  onConfirm: () => void;
  bookingCalculation: {
    baseRate: number;
    total: number;
    priceType: string;
    units: number;
    depositRequired: boolean;
    securityDeposit: number;
    deliveryCharges: number;
    grandTotal: number;
    deliveryRequired: boolean;
    car: { carBrand: { name: string }; location: string };
  };
}

const PDFPreviewModal = ({
  onClose,
  onConfirm,
  bookingCalculation,
}: PDFPreviewModalProps) => {
  const bookingDetails = useAppSelector((state) => state.booking);
  const [agreed, setAgreed] = useState(false);

  const [createBooking, { isLoading }] = useCreateBookingMutation();

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleSubmit = () => {
    if (agreed) {
      toast.promise(
        createBooking({
          carId: bookingDetails.carId,
          address: bookingDetails.address,
          pickupDate: bookingDetails.pickupDate,
          pickupTime: bookingDetails.pickupTime,
          dropoffDate: bookingDetails.dropoffDate,
          dropoffTime: bookingDetails.dropoffTime,
          deliveryRequired: bookingDetails.deliveryRequired,
          priceType: bookingDetails.priceType,
        }).unwrap(),
        {
          loading: "Submitting...",
          success: (res) => {
            console.log("PDFPreviewModal:Success", res);
            onConfirm();
            return res.message || "Booking created!";
          },
          error: (err) => {
            console.error("PDFPreviewModal:Error", err);
            return err.data.message || "Error creating booking";
          },
        }
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-dark-base/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-soft-grey/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/10 to-slate-teal/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-dark-base">
                Rental Agreement
              </h3>
              <p className="text-xs text-grey">Please review and approve</p>
            </div>
          </div>
          <button
            onClick={() => {
              document.body.style.overflow = "";
              onClose();
            }}
            className="text-grey hover:text-dark-base transition-colors p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="bg-soft-grey/10 border border-soft-grey/20 rounded-xl p-6 mb-6">
            <h4 className="text-sm font-bold text-dark-base mb-4">
              RENTAL AGREEMENT PREVIEW
            </h4>
            <div className="space-y-4 text-sm">
              <div className="bg-white rounded-lg p-4 border border-soft-grey/20">
                <h5 className="font-bold text-dark-base mb-3">
                  Rental Details
                </h5>
                <div className="space-y-2 text-xs text-grey">
                  <div className="flex justify-between">
                    <span>Vehicle:</span>
                    <span className="font-semibold text-dark-base">
                      {bookingCalculation.car.carBrand.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pickup Date:</span>
                    <span className="font-semibold text-dark-base">
                      {formatDate(bookingDetails.pickupDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pickup Time:</span>
                    <span className="font-semibold text-dark-base">
                      {bookingDetails.pickupTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Return Date:</span>
                    <span className="font-semibold text-dark-base">
                      {formatDate(bookingDetails.dropoffDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Return Time:</span>
                    <span className="font-semibold text-dark-base">
                      {bookingDetails.dropoffTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rental Duration:</span>
                    <span className="font-semibold text-dark-base">
                      {bookingCalculation.units}{" "}
                      {/* {bookingCalculation.units > 1 ? "days" : "day"} */}
                      {bookingDetails.priceType === "monthly"
                        ? "month"
                        : bookingDetails.priceType === "weekly"
                        ? "week"
                        : "day"}
                      {bookingCalculation.units > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Option:</span>
                    <span className="font-semibold text-dark-base capitalize">
                      {bookingDetails.deliveryRequired ? "Delivery" : "Pickup"}
                    </span>
                  </div>
                  {!bookingDetails.deliveryRequired && (
                    <div className="flex justify-between">
                      <span>Pickup Location:</span>
                      <span className="font-semibold text-dark-base">
                        {bookingCalculation.car.location}
                      </span>
                    </div>
                  )}
                  {bookingDetails.deliveryRequired &&
                    bookingDetails.address && (
                      <div className="flex justify-between">
                        <span>Delivery Address:</span>
                        <span className="font-semibold text-dark-base text-right">
                          {bookingDetails.address}
                        </span>
                      </div>
                    )}

                  {/* Pricing */}
                  <div className="pt-3 border-t border-soft-grey/20 space-y-1.5">
                    <div className="flex justify-between">
                      <span>
                        Base Rate (
                        {bookingDetails.priceType?.charAt(0).toUpperCase() +
                          bookingDetails.priceType?.slice(1)}
                        ):
                      </span>
                      <span className="font-semibold text-dark-base">
                        AED {bookingCalculation.baseRate.toLocaleString()} ×{" "}
                        {bookingCalculation.units}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-dark-base">
                        AED {bookingCalculation.total.toLocaleString()}
                      </span>
                    </div>
                    {bookingCalculation.deliveryRequired &&
                      bookingCalculation.deliveryCharges > 0 && (
                        <div className="flex justify-between">
                          <span>Delivery Fee:</span>
                          <span className="font-semibold text-dark-base">
                            AED{" "}
                            {bookingCalculation.deliveryCharges.toLocaleString()}
                          </span>
                        </div>
                      )}
                    {/* <div className="flex justify-between">
                      <span>VAT (5%):</span>
                      <span className="font-semibold text-dark-base">
                        AED {vat.toLocaleString()}
                      </span>
                    </div> */}
                    {/* <div className="flex justify-between pt-2 border-t border-soft-grey/20 font-bold text-dark-base">
                      <span>Rental Total:</span>
                      <span>AED {rentalTotal.toLocaleString()}</span>
                    </div> */}
                    {bookingCalculation.depositRequired && (
                      <>
                        <div className="flex justify-between pt-2 border-t border-warning/20 text-warning">
                          <span>Security Deposit (refundable):</span>
                          <span className="font-bold">
                            AED{" "}
                            {bookingCalculation.securityDeposit.toLocaleString()}
                          </span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between pt-2 border-t-2 border-dark-base/20 font-bold text-dark-base text-sm">
                      <span>Total Due Now:</span>
                      <span>
                        AED {bookingCalculation.grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="bg-soft-grey/10 border-2 border-soft-grey/30 rounded-xl p-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-6 h-6 border-2 border-soft-grey/50 rounded-md peer-checked:border-accent peer-checked:bg-accent transition-all flex items-center justify-center">
                  {agreed && (
                    <CheckCircle className="w-4 h-4 text-white fill-white" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-dark-base group-hover:text-accent transition-colors">
                  I agree to the terms and conditions
                </p>
                <p className="text-xs text-grey mt-1">
                  I have reviewed the rental agreement and agree to all stated
                  terms and conditions
                </p>
              </div>
            </label>

            <div className="mt-4 pt-4 border-t border-soft-grey/20 flex items-start gap-2.5 bg-warning/5 -mx-4 px-4 py-3 -mb-4 rounded-b-xl">
              <FileSignature className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-dark-base mb-1">
                  Physical Signature Required
                </p>
                <p className="text-[11px] text-grey leading-relaxed">
                  A physical copy of this agreement must be signed upon pickup
                  or delivery of the vehicle.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-soft-grey/20 px-6 py-4 flex gap-3">
          <button
            disabled={isLoading}
            onClick={() => {
              document.body.style.overflow = "";
              onClose();
            }}
            className={`flex-1 px-6 py-3 border-2 border-soft-grey/30 text-dark-base font-semibold rounded-xl hover:bg-soft-grey/10 transition-colors ${
              isLoading ? "opacity-50" : "opacity-100"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!agreed && isLoading}
            className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all ${
              agreed
                ? "bg-gradient-to-r from-site-accent to-slate-teal text-white hover:shadow-lg"
                : "bg-soft-grey/30 text-grey cursor-not-allowed"
            } ${isLoading ? "opacity-50" : "opacity-100"}`}
          >
            Approve & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewModal;
