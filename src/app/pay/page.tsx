"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/Auth/AuthModel";
import ProfileSetup from "@/components/Auth/ProfileSetup";

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
  const params = useParams();
  const bookingId =
    typeof params?.bookingId === "string" ? params.bookingId : undefined;

  const { user } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    if (!bookingId) return;

    let retries = 0;

    const load = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL as string}/payments/rental/view/${bookingId}`,
        );

        const data: {
          success?: boolean;
          data?: Booking;
        } = await res.json();

        if (data?.data) {
          setBooking(data.data);

          if (!data.data.prepaymentPaid && retries < 4) {
            retries++;
            setTimeout(load, 2000);
            return;
          }
        }

        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    load();
  }, [bookingId]);

  const sendGuestAccess = async () => {
    if (!booking?.bookingId) return;

    setSending(true);
    setSuccessMsg(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL as string}/auth/guest/send-temp-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: booking.bookingId,
          }),
        },
      );

      const data: { success?: boolean; message?: string } = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send email");
      }

      setSuccessMsg("Login details sent to your email.");
    } catch (err) {
      setSuccessMsg(
        err instanceof Error ? err.message : "Something went wrong.",
      );
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
      <main className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
        <section className="w-full max-w-md text-center">
          <h1 className="text-3xl font-semibold text-[#0f172a] tracking-tight">
            Booking confirmed
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {booking.prepaymentPaid
              ? "Your payment was successful."
              : "Payment is processing. This usually takes a few seconds."}
          </p>

          <div className="my-8 h-px bg-gray-200" />

          <div className="space-y-4 text-left text-sm">
            <Detail label="Booking ID" value={booking.bookingId} />
            <Detail label="Pickup" value={formatDate(booking.pickupDate)} />
            <Detail label="Dropoff" value={formatDate(booking.dropoffDate)} />
          </div>

          <div className="my-6 h-px bg-gray-200" />

          <div className="space-y-2 text-sm">
            <Amount label="Total" value={`AED ${booking.totalAmount}`} />
            <Amount
              label="Paid now"
              value={`AED ${booking.prepaymentAmount}`}
            />
            <Amount
              label="Remaining"
              value={`AED ${booking.remainingAmount}`}
              bold
            />
          </div>

          {booking.isGuestBooking && (
            <>
              <div className="my-8 h-px bg-gray-200" />

              <button
                onClick={sendGuestAccess}
                disabled={sending}
                className="w-full bg-black text-white py-3 text-sm font-medium rounded-md"
              >
                {sending ? "Sending…" : "Email login details"}
              </button>

              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full mt-3 border border-black py-3 text-sm font-medium rounded-md hover:bg-black hover:text-white transition"
              >
                Sign in with temporary password.
              </button>

              {successMsg && (
                <p className="mt-3 text-xs text-green-600">{successMsg}</p>
              )}
            </>
          )}
        </section>
      </main>

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
      <span className="font-medium text-[#0f172a]">{value}</span>
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
      <span className={bold ? "font-semibold text-[#0f172a]" : "font-medium"}>
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
