"use client";
import countries from "world-countries";
import { useState } from "react";

type CountrySelectProps = {
  value: string;
  onChange: (val: string) => void;
  error?: string;
  className?: string; // ✅ allow parent to pass Tailwind classes
};

export default function CountrySelect({
  value,
  onChange,
  error,
}: CountrySelectProps) {
  const [touched, setTouched] = useState(false);

  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        className={`w-full p-3 rounded-md border text-[#263337] bg-transparent focus:outline-none focus:ring-2 ${
          error && touched
            ? "border-red-400 focus:ring-red-300"
            : "border-gray-500 focus:ring-[#89B4BA]"
        }`}
      >
        <option value="">Select country</option>
        {countries.map((c) => (
          <option key={c.cca2} value={c.name.common}>
            {c.flag} {c.name.common}
          </option>
        ))}
      </select>

      {/* Floating error */}
      {error && touched && (
        <div className="absolute top-0 right-0 mt-1 mr-1 bg-white border border-red-400 text-red-500 text-xs rounded-md px-2 py-1 shadow-md">
          {error}
        </div>
      )}
    </div>
  );
}
