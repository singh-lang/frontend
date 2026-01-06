"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  CheckCircle,
  Calendar,
  MapPin,
  Car,
  User,
  Phone,
  Clock,
  Shield,
  Download,
  Copy,
} from "lucide-react";

export default function PaymentSuccess() {
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
        <div className="flex justify-center mb-6">
          <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-site-accent to-slate-teal  flex items-center justify-center">
<Link href="/" className="flex items-center group">
              <Image
                src="/assets/logoo.svg"
                alt="The Drive Hub"
                height={40}
                width={40}
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>             
             </div>
          </div>
        </div>
        <div className="text-center mb-10">
         <div className="flex text-2xl font-medium items-center justify-center mb-4">
      Thank you for using the Drive Hub!
      </div>
          <h1 className="text-2xl font-semibold  text-gray-900 mb-3">
            Booking Successful! 🎉
          </h1>
          <p className="text-gray-600 text-sm  max-w-2xl mx-auto">
            Your payment was successful and your vehicle is reserved. A confirmation has been sent to your email.
          </p>
        </div>
        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          
          <div className="lg:col-span-5">
            <div className="sticky top-8">
              <div className="bg-gradient-to-br from-gray-600 to-slate-400 rounded-2xl p-8 text-white shadow-2xl overflow-hidden mb-6">                
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-site-accent to-slate-teal flex items-center justify-center mr-4 shadow-lg">
                      <User className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{name}</h3>

                      <p className="text-gray-300 text-sm">Verified & Confirmed</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                      <div>
                        <p className="text-sm text-gray-100 mb-2">Booking Reference</p>
                        <p className="text-2xl font-mono font-bold tracking-wider">
                          {bookingId}
                        </p>
                      </div>
                     
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                        <p className="text-xs text-gray-100 mb-2">Email</p>
                        <p className="font-semibold text-lg">{email}</p>
                      </div>
                      <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                        <p className="text-xs text-gray-100 mb-2">Contact</p>
                        <p className="font-semibold">{phone}</p>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-gray-100 mr-3 animate-pulse"></div>
                        <div>
                          <p className="text-sm font-medium">Ready for Pickup</p>
                          {/* <p className="text-xs text-gray-100">All documents verified</p> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center mb-4">
                  <Shield className="w-5 h-5 text-blue-600 mr-3" />
                  <h4 className="font-semibold text-gray-900">Need Help?</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Our support team is available 24/7 to assist you with any questions.
                </p>
                <button className="w-full py-3 bg-white hover:bg-gray-50 border border-blue-200 text-blue-700 font-medium rounded-xl transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="h-full flex flex-col">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900">Booking Summary</h3>
                <p className="text-gray-600 mt-2 text-sm">Complete rental details & timeline</p>
              </div>

              <div className="flex-1 space-y-6">
                <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-site-accent to-slate-teal  flex items-center justify-center mr-4">
                          <Car className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Reserved Vehicle</p>
                          <p className="text-xl font-bold text-gray-900">{carName}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                          Luxury SUV
                        </span>
                        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                          2024 Model
                        </span>
                        <span className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                          Automatic
                        </span>
                        <span className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                          Premium Package
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="inline-flex items-center px-4 py-2 rounded-full text-white bg-gradient-to-r from-site-accent to-slate-teal shadow-sm text-sm font-semibold">
                        <Clock className="w-4 h-4 mr-2" />
                        {rentalPeriod}
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                    <div className="bg-gray-50 p-5 rounded-xl">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-white flex items-center justify-center mr-3">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Pickup Location</p>
                          <p className="font-semibold text-gray-900">{pickupLocation}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                        <p className="font-medium text-gray-900">{pickupDate} • 10:00 AM</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-5 shadow-2xs rounded-xl border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-white flex items-center justify-center mr-3">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div >
                          <p className="text-xs text-gray-500">Rental Duration</p>
                          <p className="text-2xl font-bold text-gray-700 ">{rentalPeriod}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Full insurance included</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-6">Next Steps</h4>
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 text-white bg-gradient-to-r from-site-accent to-slate-teal"></div>
                    
                    <div className="space-y-8">
                      <TimelineStep
                        number="1"
                        title="Booking Confirmed"
                        description="Payment processed and booking confirmed"
                        icon="✓"
                        active={true}
                      />
                      {/* <TimelineStep
                        number="2"
                        title="Document Verification"
                        description="ID & license verification"
                        icon="📄"
                        active={false}
                      /> */}
                      {/* <TimelineStep
                        number="3"
                        title="Vehicle Preparation"
                        description="Vehicle inspection and cleaning"
                        icon="🚗"
                        active={false}
                      />
                      <TimelineStep
                        number="4"
                        title="Ready for Pickup"
                        description={`Pickup at ${pickupDate}`}
                        icon="📍"
                        active={false}
                      />
                    </div>
                  </div>
                </div>                 */} 
              </div>
            </div>
          </div>
        </div>
       <div className="flex flex-col sm:flex-row gap-4 px-10">
  {/* HOME BUTTON */}
  <Link
    href="/"
    className="flex-1 text-center bg-gradient-to-r from-site-accent to-slate-teal
               text-white font-semibold py-4 rounded-xl shadow-md
               hover:shadow-lg transition-all hover:scale-[1.02]
               flex items-center justify-center"
  >
    Go to Homepage
  </Link>

  {/* PRINT BUTTON */}
  <button
    type="button"
    onClick={() => window.print()}
    className="flex-1 text-center border-2 border-gray-300 bg-white
               text-gray-800 font-semibold py-4 rounded-xl
               hover:border-gray-400 hover:bg-gray-50
               transition-all hover:scale-[1.02]
               flex items-center justify-center"
  >
    Print Summary
  </button>
</div>


        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                Need immediate assistance? <a href="tel:+971 564727007" className="text-site-accent font-semibold hover:underline">+971 564727007</a>
              </p>
              <p className="text-xs text-gray-400 mt-1">24/7 Customer Support Available</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <Shield className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Secure Payment</p>
                  <p className="text-xs font-medium text-gray-700">Encrypted & Safe</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Booking ID: {bookingId}</p>
                <p className="text-xs text-gray-400">{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Timeline Step Component
function TimelineStep({
  number,
  title,
  description,
  icon,
  active = false,
}: {
  number: string;
  title: string;
  description: string;
  icon: string;
  active: boolean;
}) {
  return (
    <div className="flex items-start">
      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4 z-10 ${
        active ? 'bg-gradient-to-r from-site-accent to-slate-teal shadow-[0_12px_28px_rgba(0,0,0,0.12)] text-white' : 'bg-gray-100 text-gray-400'
      }`}>
        {icon}
      </div>
      <div>
        <h4 className={`font-semibold ${active ? 'text-gray-900' : 'text-gray-600'}`}>
          {title}
        </h4>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  );
}

