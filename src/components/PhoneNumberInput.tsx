"use client";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import { useState } from "react";
type PhoneProps = {
  value: string;
  onChange: (val: string) => void;
  error?: string;
  className?: string; // 👈 allow parent to pass extra classes
};

export default function PhoneNumberInput({
  value,
  onChange,
  error,
}: PhoneProps) {
  const [touched, setTouched] = useState(false);

  return (
    <div className="relative w-full">
      <PhoneInput
        country={"in"}
        value={value}
        onChange={(val) => onChange(val)}
        onBlur={() => setTouched(true)}
        inputStyle={{
          width: "100%",
          height: "48px",
          borderRadius: "0.375rem",
          border: error && touched ? "1px solid #f87171" : "1px solid #6b7280",
          background: "transparent",
          color: "#263337",
          fontSize: "14px",
          paddingLeft: "52px",
          overflow: "hidden", // slightly more for flag button
        }}
        buttonStyle={{
          border: "none",
          background: "transparent",
          width: 48, // same as padding-left in input
        }}
        containerStyle={{
          width: "100%",
        }}
        dropdownStyle={{
          borderRadius: "0.375rem",
        }}
      />

      {/* Floating error tooltip */}
      {error && touched && (
        <div className="absolute top-0 right-0 mt-1 mr-1 bg-white border border-red-400 text-red-500 text-xs rounded-md px-2 py-1 shadow-md">
          {error}
        </div>
      )}
    </div>
  );
}
