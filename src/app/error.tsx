"use client";

import { useEffect } from "react";

const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
      <p className="text-gray-600 mb-6">
        An unexpected error occurred. Please try again later.
      </p>
      <button
        onClick={() => reset()}
        className="py-2 bg-gradient-to-r from-site-accent to-slate-teal text-white md:py-3 px-4 md:px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorPage;
