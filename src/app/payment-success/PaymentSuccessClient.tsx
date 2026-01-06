"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Calendar, MapPin, Car, User, Clock, Shield } from "lucide-react";

export default function PaymentSuccessClient() {
  const params = useSearchParams();

  const bookingId = params.get("bookingId") || "BK-000123";
  const name = params.get("name") || "John Smith";
  const email = params.get("email") || "john@gmail.com";
  const phone = params.get("phone") || "+971 50 123 4567";
  const carName = params.get("car") || "Toyota Land Cruiser";
  const pickupLocation = params.get("pickup") || "Dubai Airport T1";
  const pickupDate = params.get("date") || "15 Jan 2026";
  const rentalPeriod = params.get("days") || "7 Days";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full p-8 md:p-10">
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="group">
            <Image
              src="/assets/logoo.svg"
              alt="The Drive Hub"
              width={48}
              height={48}
              className="transition-transform group-hover:scale-105"
            />
          </Link>
        </div>

        {/* HEADER */}
        <div className="text-center mb-10">
          <p className="text-2xl font-medium mb-2">
            Thank you for using The Drive Hub!
          </p>
          <h1 className="text-2xl font-semibold mb-3">Booking Successful 🎉</h1>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Your payment was successful and your vehicle is reserved. A
            confirmation has been sent to your email.
          </p>
        </div>

        {/* CONTENT */}
        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          {/* LEFT */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-gray-600 to-slate-400 rounded-2xl p-8 text-white mb-6">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-site-accent to-slate-teal flex items-center justify-center mr-4">
                  <User />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{name}</h3>
                  <p className="text-sm text-gray-200">Verified & Confirmed</p>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-5">
                <p className="text-sm mb-1">Booking Reference</p>
                <p className="text-xl font-mono font-bold">{bookingId}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-white/10 p-4 rounded-xl">
                  <p className="text-xs">Email</p>
                  <p className="font-medium">{email}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl">
                  <p className="text-xs">Contact</p>
                  <p className="font-medium">{phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border">
              <div className="flex items-center mb-2">
                <Shield className="text-blue-600 mr-2" />
                <h4 className="font-semibold">Need Help?</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Our support team is available 24/7.
              </p>
              <button className="w-full py-3 bg-white border rounded-xl">
                Contact Support
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-7">
            <h3 className="text-2xl font-semibold mb-6">Booking Summary</h3>

            <div className="bg-white rounded-2xl p-6 border">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-site-accent to-slate-teal rounded-xl flex items-center justify-center mr-4">
                  <Car className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reserved Vehicle</p>
                  <p className="text-xl font-bold">{carName}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <MapPin className="text-blue-600 mb-2" />
                  <p className="text-sm font-medium">{pickupLocation}</p>
                  <p className="text-xs text-gray-500">{pickupDate}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <Calendar className="text-blue-600 mb-2" />
                  <p className="text-sm font-medium">{rentalPeriod}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 bg-gradient-to-r from-site-accent to-slate-teal text-white py-4 rounded-xl text-center"
          >
            Go to Homepage
          </Link>

          <button
            onClick={() => window.print()}
            className="flex-1 border py-4 rounded-xl"
          >
            Print Summary
          </button>
        </div>
      </div>
    </div>
  );
}
