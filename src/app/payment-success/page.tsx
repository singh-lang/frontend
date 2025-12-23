"use client";

import Link from "next/link";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
          alt="Payment Success"
          className="w-16 mx-auto mb-4"
        />

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Payment Successful
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed">
          Thank you! Your payment has been processed successfully.
        </p>

        <p className="text-gray-600 text-sm mt-2 leading-relaxed">
          You can now access your purchased items and continue using your
          account normally.
        </p>

        <Link
          href="/"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-xl mt-6 transition"
        >
          Go to Home
        </Link>

        <p className="text-xs text-gray-400 mt-4">Powered by Stripe</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
