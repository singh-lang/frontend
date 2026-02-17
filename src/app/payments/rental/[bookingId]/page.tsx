"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/Auth/AuthModel";
import ProfileSetup from "@/components/Auth/ProfileSetup";
import Image from "next/image";
import Navbar from "@/components/home/Navbar";
import type { CarTypes } from "@/types/homePageTypes";

type Booking = {
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
  prepaymentPaid?: boolean;
  pickupTime?: string;
  dropoffTime?: string;
  address?: string;
  listing?: Listing;
};

type Listing = {
  _id?: string;
  title?: string;

  images?: { url?: string }[];

  modelYear?: {
    _id?: string;
    year?: number;
  };

  vendor?: Vendor;
};


type Vendor = {
  _id?: string;
  name?: string;
  email?: string;

  profilePicture?: {
    url?: string;
  };

  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    mapUrl?: string;
  };

  contact?: {
    whatsappNum?: string;
    mobileNum?: string;
    landlineNum?: string;
  };

  vendorDetails?: {
    businessName?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      mapUrl?: string;
    };
    contact?: {
      whatsappNum?: string;
      mobileNum?: string;
      landlineNum?: string;
    };
  };
};



export default function RentalPaymentSuccessPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();
  const router = useRouter();

const [carData, setCarData] = useState<CarTypes | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [agree, setAgree] = useState(true);

  useEffect(() => {
    if (!bookingId) return;

    let retries = 0;
    const maxRetries = 4;

    const loadBooking = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/payments/rental/view/${bookingId}`,
          {
            cache: "no-store",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();

        if (data.success && data.data) {
          setBooking(data.data);
          if (!data.data?.prepaymentPaid && retries < maxRetries) {
            retries++;
            setTimeout(loadBooking, 2000);
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId]);

  const sendGuestAccess = async () => {
    if (!booking?.bookingId) return;

    setSending(true);
    setSuccessMsg(null);

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
        setSuccessMsg(data.message || "Login details sent to your email.");
      } else {
        setSuccessMsg(data.message || "Something went wrong.");
      }
    } catch (error) {
      setSuccessMsg("Network error. Please try again later.");
    } finally {
      setSending(false);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (!user?.profileComplete) {
      setShowProfileSetup(true);
    }
  };

  const formatDate = (date: string): string => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return date;
    }
  };

  const formatTime = (time?: string): string => {
    if (!time) return "10:00 AM";
    return time;
  };

  const calculateDays = (): number => {
    if (!booking?.pickupDate || !booking?.dropoffDate) return 0;
    try {
      const pickup = new Date(booking.pickupDate);
      const dropoff = new Date(booking.dropoffDate);
      const diffTime = Math.abs(dropoff.getTime() - pickup.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (error) {
      return 0;
    }
  };

  const getInitials = (name?: string): string => {
    if (!name) return "P";
    return name.charAt(0).toUpperCase();
  };



  if (loading || !booking) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-site-accent/20 border-t-site-accent rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-site-accent to-slate-teal rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">Finalizing your booking...</p>
          </div>
        </div>
      </>
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
const listing = booking?.listing;
const vendor = listing?.vendor;
const carTitle = listing?.title;
const carBrand = carTitle?.split(" ")[0];
const carYear = listing?.modelYear?.year;
const carImage =
  listing?.images?.length
    ? listing.images[0].url
    : "";
const vendorName =
  vendor?.vendorDetails?.businessName || vendor?.name;

const vendorLogo = vendor?.profilePicture?.url;
const vendorMobile =
  vendor?.vendorDetails?.contact?.mobileNum ||
  vendor?.contact?.mobileNum ||
  "";
  return (
    <>
      <Navbar />

      <main className="pt-30 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
        <div className="mb-8">
  <div className="flex flex-col items-center justify-center text-center gap-2">
    
    <h1 className="text-2xl font-bold text-gray-900">
      Booking confirmed
    </h1>

    <p className="text-base text-gray-500 font-medium">
      {booking.prepaymentPaid
        ? "Your payment was successful."
        : "Payment is processing. This usually takes a few seconds."}
    </p>

  </div>
</div>

          <div className="grid lg:grid-cols-3 gap-6 ">
            <div className="lg:col-span-2 space-y-6">
  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5">
  <div className="flex flex-col sm:flex-row gap-6">
    
    {/* Car Image */}
    <div className="relative sm:w-64 w-full">
      {carImage ? (
        <img
          src={carImage}
          alt={listing?.title}
          className="w-full h-40 sm:h-44 object-cover rounded-2xl"
        />
      ) : (
        <div className="w-full h-40 sm:h-44 bg-gray-100 rounded-2xl flex items-center justify-center">
          <span className="text-gray-400 text-sm">No image</span>
        </div>
      )}

      {carBrand && (
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-gray-800 shadow">
          {carBrand}
        </div>
      )}
    </div>

    {/* Car Details */}
    <div className="flex-1 flex flex-col gap-4">
      
      {/* Title + meta */}
      <div>
        <p className="text-xl font-semibold text-gray-900 leading-tight">
          {listing?.title}
        </p>

        <div className="flex items-center gap-4 mt-3">
          {carYear && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
              {carYear}
            </span>
          )}

          {carBrand && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-site-accent/10 text-site-accent font-semibold">
              {carBrand}
            </span>
          )}
        </div>
      </div>

{/* Vendor */}
<div className="pt-3 border-t border-gray-100 flex items-center gap-4">
  {vendorLogo ? (
    <img
      src={vendorLogo}
      alt={vendorName}
      className="w-10 h-10 rounded-full object-cover border border-gray-200"
    />
  ) : (
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
      {vendorName?.charAt(0)}
    </div>
  )}

  <div className="flex flex-col">
    <span className="text-xs text-gray-500">Provided by</span>
    <span className="text-sm font-semibold text-gray-900">
      {vendorName}
    </span>
  </div>
</div>

    </div>
  </div>
</div>


              {/* Customer Information Card */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-base font-medium text-gray-900">
                    Customer Details
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-1">Booking ID</p>
                      <p className="text-sm font-mono font-medium text-gray-900">
                        {booking.bookingId}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs  font-medium text-gray-400 mb-1">Full name</p>
                      <p className="text-sm font-medium text-gray-900">
                        {booking.guestName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs  font-medium text-gray-400 mb-1">Email address</p>
                      <p className="text-sm font-medium text-gray-900 break-all">
                        {booking.guestEmail || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs  font-medium text-gray-400 mb-1">Phone number</p>
                      <p className="text-sm font-medium text-gray-900">
                        {booking.guestPhone || "N/A"}
                      </p>
                    </div>
                    
                  </div>
                </div>
              </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-base font-medium text-gray-900">
                 Vendor Details
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-1">Vendor name</p>
                      <p className="text-sm  font-medium text-gray-900">
                  {vendor?.name || "N/A"}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs  font-medium text-gray-400 mb-1">Email address</p>
                      <p className="text-sm font-medium text-gray-900 break-all">
                      {vendor?.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs  font-medium text-gray-400 mb-1">Phone number</p>
                      <p className="text-sm font-medium text-gray-900">
                          {vendorMobile || "+971 501234567"}
                      </p>
                    </div>
                    
                  </div>
                </div>
              </div>



              {/* Agreement Card */}
              <div className="bg-white rounded-xl border p-4 border-gray-200 overflow-hidden">
                <h3 className="text-base font-extrabold text-gray-900 mb-3">
                  Agreement
                </h3>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-site-accent focus:ring-site-accent"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        I agree to the terms and conditions
                      </p>
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                        i
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-500 mt-1">
                      I have reviewed the rental agreement and agree to all
                      stated terms and conditions
                    </p>
                  </div>
                </label>
                <div className="mt-4 border-t border-gray-200 p-3 flex gap-3">
                  <div className="text-yellow-500 text-lg">✍️</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Physical Signature Required
                    </p>
                    <p className="text-xs font-medium text-gray-500 mt-1 leading-relaxed">
                      A physical copy of this agreement must be signed upon
                      pickup or delivery of the vehicle. This digital approval
                      is for your convenience and does not replace the physical
                      signature requirement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-24 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="relative px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-site-accent to-slate-teal rounded-r-full"></div>
                  <h2 className="text-base font-semibold text-gray-900 pl-3">
                    Payment Summary
                  </h2>
                  
                </div>

                <div className="p-6">
                  <div className="mb-6 bg-gray-50/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rental period
                      </span>
                      <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-700 shadow-sm">
                        {calculateDays()}{" "}
                        {calculateDays() === 1 ? "day" : "days"}
                      </span>
                    </div>

                    {/* Timeline Visual */}
                    <div className="relative">
                      <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-site-accent to-slate-teal/30"></div>

                      {/* Pickup */}
                      <div className="flex items-start gap-3 relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-site-accent/10 to-slate-teal/10 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                          <svg
                            className="w-4 h-4 text-site-accent"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="text-xs text-gray-400 mb-0.5">PICKUP</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatDate(booking.pickupDate)}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600 border border-gray-200">
                              {formatTime(booking.pickupTime)}
                            </span>
                            {booking.address && (
                              <span
                                className="text-xs text-gray-500 truncate ml-1"
                                title={booking.address}
                              >
                                • {booking.address.split(",")[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Dropoff */}
                      <div className="flex items-start gap-3 relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-teal/10 to-site-accent/10 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                          <svg
                            className="w-4 h-4 text-slate-teal"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-400 mb-0.5">
                            DROPOFF
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatDate(booking.dropoffDate)}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600 border border-gray-200">
                              {formatTime(booking.dropoffTime)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                  
                  </div>

                 <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 mb-5 border border-gray-100">
                  <div className="space-y-3 text-sm">
                      <Amount label="Total amount" value={`AED ${booking.totalAmount}`} />
                      <Amount
                        label="Paid now"
                        value={`AED ${booking.prepaymentAmount}`}
                      />
                        <div className="h-px bg-gray-200 my-2"></div>
                      <Amount
                        label="Remaining at pickup"
                        value={`AED ${booking.remainingAmount}`}
                        bold
                      />     
                  </div>
                </div>

                  {/* Payment Status */}
                  <div
                    className={`p-4 rounded-xl mb-6 ${
                      booking.prepaymentPaid
                        ? "bg-gradient-to-r from-green-50 to-emerald-50/50 border border-green-100"
                        : "bg-gradient-to-r from-yellow-50 to-amber-50/50 border border-yellow-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          booking.prepaymentPaid
                            ? "bg-green-100"
                            : "bg-yellow-100"
                        }`}
                      >
                        {booking.prepaymentPaid ? (
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-yellow-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {booking.prepaymentPaid
                            ? "Payment confirmed"
                            : "Payment processing"}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {booking.prepaymentPaid
                            ? "Your payment was successful."
                            : "Payment is processing. This usually takes a few seconds."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Guest Actions */}
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
{/* Modals */}


                      {successMsg && (
                        <p className="mt-3 text-xs font-semibold text-green-600">
                          {successMsg}
                        </p>
                      )}
                    </>
                  )}
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      <ProfileSetup
        isOpen={showProfileSetup}
        onClose={() => setShowProfileSetup(false)}
        onComplete={() => setShowProfileSetup(false)}
        allowSkip={false} 
      />
    </>
  );
}