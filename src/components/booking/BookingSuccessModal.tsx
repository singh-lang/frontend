"use client";

import { CheckCircle, X, Mail, Clock } from "lucide-react";
import { useEffect } from "react";

interface BookingSuccessModalProps {
  onClose: () => void;
  carName: string;
}

const BookingSuccessModal = ({
  onClose,
  carName,
}: BookingSuccessModalProps) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <div className="fixed inset-0 bg-dark-base/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <div className="bg-white h-[95vh] overflow-y-auto rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={() => {
            document.body.style.overflow = "";
            onClose();
          }}
          className="absolute top-4 right-4 text-grey hover:text-dark-base transition-colors p-2"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6 animate-in zoom-in duration-500 delay-100">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>

          <h3 className="text-2xl font-bold text-dark-base mb-2">
            Request Sent Successfully!
          </h3>

          <p className="text-grey mb-6">
            Your booking request for{" "}
            <span className="font-semibold text-dark-base">{carName}</span> has
            been submitted
          </p>

          <div className="w-full space-y-3 mb-8">
            <div className="bg-site-accent/5 border border-site-accent/20 rounded-xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-site-accent/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-accent" />
              </div>
              <div className="text-left flex-1">
                <h4 className="text-sm font-semibold text-dark-base mb-1">
                  Check Your Email
                </h4>
                <p className="text-xs text-grey">
                  You will receive a confirmation email shortly with your
                  booking details
                </p>
              </div>
            </div>

            <div className="bg-slate-teal/5 border border-slate-teal/20 rounded-xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-teal/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-slate-teal" />
              </div>
              <div className="text-left flex-1">
                <h4 className="text-sm font-semibold text-dark-base mb-1">
                  What&apos;s Next?
                </h4>
                <p className="text-xs text-grey">
                  Upon acceptance of your request, you will receive a payment
                  link to complete your booking
                </p>
              </div>
            </div>
          </div>

          <div className="text-xs text-grey mb-6">
            <p>Need help? Contact us at</p>
            <a
              href="mailto:support@drivehub.ae"
              className="text-site-accent font-semibold hover:underline"
            >
              support@drivehub.ae
            </a>
          </div>

          <button
            onClick={() => {
              document.body.style.overflow = "";
              onClose();
            }}
            className="w-full px-6 py-3 bg-gradient-to-r from-site-accent to-slate-teal text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessModal;
