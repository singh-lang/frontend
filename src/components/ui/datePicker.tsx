import React, { forwardRef } from "react";
import { CalendarDays } from "lucide-react";

export const DateInput = forwardRef<HTMLInputElement, any>(
  ({ value, onClick, placeholder }, ref) => (
    <div
      onClick={onClick}
      className="
        w-[310px] cursor-pointer
        rounded-full bg-soft-grey/40
        px-5 py-3
        flex items-center justify-between
        text-sm
        focus-within:bg-white
        focus-within:ring-2 focus-within:ring-site-accent/30
        transition
      "
    >
      <input
        ref={ref}
        value={value}
        readOnly
        placeholder={placeholder}
        className="bg-transparent outline-none w-full cursor-pointer"
      />

      {/* ✅ CALENDAR ICON */}
      <CalendarDays size={18} className="text-gray-800 ml-3" />
    </div>
  )
);

DateInput.displayName = "DateInput";