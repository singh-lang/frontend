"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/Auth/AuthModel";
import ProfileSetup from "@/components/Auth/ProfileSetup";
import Image from "next/image";
import Navbar from "@/components/home/Navbar";

type Booking = {
  bookingId: string;
  isGuestBooking: boolean;
  guestName?: string;
  totalAmount: number;
  prepaymentAmount: number;
  remainingAmount: number;
  pickupDate: string;
  dropoffDate: string;
  prepaymentPaid?: boolean;
};

export default function RentalPaymentSuccessPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
const router = useRouter();

  useEffect(() => {
    if (!bookingId) return;

    let retries = 0;

    const load = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payments/rental/view/${bookingId}`,
      );
      const data = await res.json();

      setBooking(data.data);

      if (!data.data?.prepaymentPaid && retries < 4) {
        retries++;
        setTimeout(load, 2000);
      } else {
        setLoading(false);
      }
    };

    load();
  }, [bookingId]);

const sendGuestAccess = async () => {
  if (!booking?.bookingId) return;

  setSending(true);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/guest/send-temp-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.bookingId }),
      }
    );

    const data = await res.json();

    if (data.success) {
      alert(data.message || "Login details sent to your email.");
      setSuccessMsg(data.message || "Login details sent to your email.");
    } else {
      // 🔴 API error message
      alert(data.message || "Something went wrong.");
    }
  } catch (error) {
    alert("Network error. Please try again later.");
  } finally {
    setSending(false);
  }
};


  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (!user?.profileComplete) setShowProfileSetup(true);
  };

  if (loading || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Finalizing your booking…
      </div>
    );
  }

  return (
    <>
<div className="mt-20">
        <Navbar/>
      </div>

      <main className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#eef2f7] flex items-center justify-center px-4">
        <section className="w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-[0_20px_50px_rgba(15,23,42,0.08)] p-6 text-center">
          <div className=" text-center items-center justify-center flex">
            <Image
              src="/assets/logo.svg"
              alt="Company logo"
              width={120}
              height={40}
            />
          </div>

          {/* HEADLINE */}
          <h1 className="text-2xl font-bold text-gray-900">
            Booking confirmed
          </h1>

          <p className="mt-2 text-sm text-gray-500 font-medium max-w-sm mx-auto">
            {booking.prepaymentPaid
              ? "Your payment was successful."
              : "Payment is processing. This usually takes a few seconds."}
          </p>

          {/* DIVIDER */}
          <div className="my-6 h-px bg-gray-200" />

          {/* BOOKING DETAILS */}
          <div className="space-y-3 text-sm text-left font-medium">
            <Detail label="Booking ID" value={booking.bookingId} />
            <Detail
              label="Pickup date"
              value={formatDate(booking.pickupDate)}
            />
            <Detail
              label="Drop-off date"
              value={formatDate(booking.dropoffDate)}
            />
          </div>

          {/* DIVIDER */}
          <div className="my-6 h-px bg-gray-200" />

          {/* AMOUNT SUMMARY */}
          <div className="space-y-2 text-sm text-left font-medium">
            <Amount label="Total amount" value={`AED ${booking.totalAmount}`} />
            <Amount
              label="Paid now"
              value={`AED ${booking.prepaymentAmount}`}
            />
            <Amount
              label="Remaining at pickup"
              value={`AED ${booking.remainingAmount}`}
              bold
            />
          </div>

          {/* GUEST CTA */}
          {booking.isGuestBooking && (
            <>
              <div className="my-6 h-px bg-gray-200" />

              <button
                onClick={sendGuestAccess}
                disabled={sending}
                className="
            w-full h-[52px]
            rounded-full
           bg-gradient-to-r from-site-accent to-slate-teal
            text-white
            text-sm font-bold
            flex items-center justify-center
            disabled:opacity-50
          "
              >
                {sending ? "Sending login details…" : "Email login details"}
              </button>

              <button
                onClick={() => setShowAuthModal(true)}
                className="
            w-full h-[52px] mt-3
            rounded-full
            border border-gray-900
            text-gray-900
            text-sm font-bold
            hover:bg-gray-900 hover:text-white
            transition
            flex items-center justify-center
          "
              >
                Sign in with temporary password
              </button>

              {successMsg && (
                <p className="mt-3 text-xs font-semibold text-green-600">
                  {successMsg}
                </p>
              )}
            </>
          )}
        </section>
      </main>

      {/* MODALS */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      <ProfileSetup
        isOpen={showProfileSetup}
        onClose={() => setShowProfileSetup(false)}
        onComplete={() => setShowProfileSetup(false)}
      />
    </>
  );
}

/* ---------- Helpers ---------- */

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-[#0f172a]">{value}</span>
    </div>
  );
}

function Amount({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span
        className={`${bold ? "font-semibold text-[#0f172a]" : "font-medium"}`}
      >
        {value}
      </span>
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
