"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/Auth/AuthModel";
import ProfileSetup from "@/components/Auth/ProfileSetup";

type Booking = {
  _id: string;
  bookingId: string;
  isGuestBooking: boolean;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  totalAmount: number;
  prepaymentAmount: number;
  remainingAmount: number;
  pickupDate: string;
  dropoffDate: string;
  pickupTime: string;
  dropoffTime: string;
  pickupType: string;
  returnType: string;
  status: string;
};

export default function RentalPaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const searchParams = useSearchParams();

  const { user } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 🔐 auth modal state (same as Navbar)
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    if (!bookingId) return;

    const token = searchParams.get("token");

    if (token) {
      window.location.href = `http://localhost:5000/api/payments/rental/${bookingId}?token=${token}`;
      return;
    }

    fetch(`http://localhost:5000/api/payments/rental/view/${bookingId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setError(data.message || "Booking not found");
          return;
        }
        setBooking(data.data);
      })
      .catch(() => setError("Internal server error"))
      .finally(() => setLoading(false));
  }, [bookingId, searchParams]);

  // ✅ same function as Navbar
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (!user?.profileComplete) {
      setShowProfileSetup(true);
    }
  };

  const sendGuestAccess = async () => {
    if (!booking?.bookingId) return;

    try {
      setSending(true);
      setSuccessMsg(null);

      const res = await fetch(
        "http://localhost:5000/api/auth/guest/send-temp-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: booking.bookingId }),
        },
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setSuccessMsg(
        "Login details sent to your email. Please check your inbox.",
      );
    } catch (err: any) {
      setError(err.message || "Failed to send login details");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p className="p-10">Loading booking details…</p>;
  if (error) return <p className="p-10 text-red-600">{error}</p>;
  if (!booking) return <p className="p-10">Booking not found</p>;

  return (
    <>
      <div className="p-10 max-w-lg mx-auto bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">Booking Confirmed 🎉</h1>

        {booking.isGuestBooking && (
          <div className="mb-4 rounded border p-4 bg-gray-50">
            <p className="font-semibold mb-2">
              Hello {booking.guestName || "Guest"},
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Want to manage your booking online?
            </p>

            {/* EXISTING BUTTON – untouched */}
            <button
              onClick={sendGuestAccess}
              disabled={sending}
              className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
            >
              {sending ? "Sending access email…" : "Sign in to manage booking"}
            </button>

            {/* ✅ NEW SIGN IN BUTTON (Navbar auth logic) */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full mt-3 border border-black text-black py-2 rounded hover:bg-black hover:text-white transition"
            >
              Sign In using Temporary Password recieved via Email
            </button>

            {successMsg && (
              <p className="text-green-600 text-sm mt-2">{successMsg}</p>
            )}
          </div>
        )}

        <p>
          <strong>Booking ID:</strong> {booking.bookingId}
        </p>
        <p>
          <strong>Pickup:</strong> {booking.pickupDate} {booking.pickupTime}
        </p>
        <p>
          <strong>Dropoff:</strong> {booking.dropoffDate} {booking.dropoffTime}
        </p>
        <p>
          <strong>Total:</strong> AED {booking.totalAmount}
        </p>
        <p>
          <strong>Paid:</strong> AED {booking.prepaymentAmount}
        </p>
        <p>
          <strong>Remaining:</strong> AED {booking.remainingAmount}
        </p>
      </div>

      {/* 🔐 SAME MODALS AS NAVBAR */}
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
