"use client";

const PaymentFailed = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png"
          alt="Payment Failed"
          className="w-16 mx-auto mb-4"
        />

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Payment Failed
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed">
          Unfortunately, your payment was not successful.
        </p>

        <p className="text-gray-600 text-sm mt-2 leading-relaxed">
          Please try again or contact support if the issue persists.
        </p>

        {/* <div className="mt-6 flex flex-col gap-3">
          <a
            href="/checkout"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-xl transition"
          >
            Retry Payment
          </a>

          <a
            href="/support"
            className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-3 rounded-xl transition"
          >
            Contact Support
          </a>
        </div> */}

        <p className="text-xs text-gray-400 mt-4">Powered by Stripe</p>
      </div>
    </div>
  );
};

export default PaymentFailed;
