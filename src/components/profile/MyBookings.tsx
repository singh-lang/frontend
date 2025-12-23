"use client";

import { Car as CarIcon, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next-nprogress-bar";
import { useGetBookingsQuery } from "@/lib/api/bookinguser";
import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";

interface Booking {
  id: string;
  carName: string;
  image: string;
  pickupDate: string;
  returnDate: string;
  duration: string;
  total: string;
  status: "Pending" | "Confirmed" | "Cancelled";
}

interface BookingsResponse {
  success: boolean;
  bookings: {
    docs: Booking[];
    totalDocs: number;
    page: number;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  };
}

export default function MyBookings() {
  const { user } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);

  // Fetch bookings from API
  const {
    data: bookingsResponse,
    isFetching,
    isError,
  } = useGetBookingsQuery(
    { page },
    {
      // skip: !user, // only run if user is logged in
    }
  );

  if (!user) return null;
  // if (isFetching) return <p>Loading bookings...</p>;
  if (isError) return <p>Failed to load bookings.</p>;
  console.log("📦 Bookings API Response:", bookingsResponse);

  const bookingStatus = {
    1: "Pending",
    2: "Confirmed",
    3: "Cancelled",
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-dark-base mb-6">My Bookings</h2>

      <div className="space-y-4">
        {isFetching
          ? Array.from({ length: 10 }).map((_, i) => (
              <BookingCardSkeleton key={i} />
            ))
          : bookingsResponse?.bookings?.docs?.length > 0 &&
            bookingsResponse?.bookings?.docs?.map((booking) => (
              <div
                key={booking._id}
                className="border-2 border-soft-grey/20 rounded-xl p-6 hover:border-accent/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <Image
                    src={booking.car?.images?.[0]?.url}
                    alt={booking.car?.title}
                    className="w-full md:w-48 h-32 object-cover rounded-lg"
                    height={100}
                    width={100}
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-dark-base">
                          {booking.car?.title}
                        </h3>
                        <p className="text-sm text-grey">
                          Booking #{booking.bookingId}
                        </p>
                      </div>

                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 1
                            ? "bg-warning/10 text-warning"
                            : booking.status === 2
                            ? "bg-success/10 text-success"
                            : "bg-danger/10 text-danger"
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{bookingStatus[Number(booking.status)]}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-grey mb-1">Pickup Date</p>
                        <p className="text-sm font-semibold text-dark-base">
                          {new Date(booking.pickupDate).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-grey mb-1">Return Date</p>
                        <p className="text-sm font-semibold text-dark-base">
                          {new Date(booking.dropoffDate).toLocaleString()}
                        </p>
                      </div>
                      {/* <div>
                      <p className="text-xs text-grey mb-1">Duration</p>
                      <p className="text-sm font-semibold text-dark-base">
                        {booking.duration}
                      </p>
                    </div> */}
                      <div>
                        <p className="text-xs text-grey mb-1">Total</p>
                        <p className="text-sm font-semibold text-dark-base">
                          AED {booking.totalAmount}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-grey mb-1">Payment</p>
                        <p className="text-sm font-semibold text-dark-base">
                          {booking.payment === 1
                            ? "Pending"
                            : booking.payment === 2
                            ? "Paid"
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end mt-10">
                      <button className="px-4 py-2 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-slate-teal transition-colors">
                        View Details
                      </button>
                      <button className="px-4 py-2 border-2 border-soft-grey/30 text-dark-base text-sm font-semibold rounded-lg hover:bg-soft-grey/10 transition-colors">
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
      {bookingsResponse?.bookings?.docs?.length > 0 ? (
        <>
          <div className="flex justify-end mt-5">
            <div className="flex items-center justify-center gap-3">
              <button
                className={`rounded-full bg-gradient-to-r from-site-accent to-slate-teal p-2 text-white ${
                  !bookingsResponse?.bookings?.hasPrevPage
                    ? "opacity-50 !cursor-not-allowed"
                    : ""
                }`}
                disabled={!bookingsResponse?.bookings?.hasPrevPage}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft />
              </button>
              <button
                className={`rounded-full bg-gradient-to-r from-site-accent to-slate-teal p-2 text-white ${
                  !bookingsResponse?.bookings?.hasNextPage
                    ? "opacity-50 !cursor-not-allowed"
                    : ""
                }`}
                disabled={!bookingsResponse?.bookings?.hasNextPage}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-soft-grey/30 rounded-xl">
          <CarIcon className="w-16 h-16 text-grey/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark-base mb-2">
            No bookings yet
          </h3>
          <p className="text-grey mb-6">
            Start browsing our collection to book your dream car
          </p>
          <button
            onClick={() => router.push("/catalog/all/cars")}
            className="px-6 py-3 bg-gradient-to-r from-site-accent to-slate-teal text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            Browse Cars
          </button>
        </div>
      )}
    </div>
  );
}

function BookingCardSkeleton() {
  return (
    <div className="border-2 border-soft-grey/20 rounded-xl p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image Skeleton */}
        <Skeleton className="w-full md:w-48 h-32 rounded-lg" />

        <div className="flex-1">
          {/* Title + Status */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-3 w-28" />
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          {/* Grid Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton className="h-3 w-20 mb-2" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end mt-10">
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-9 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
