import React, { forwardRef } from "react";
import { CalendarDays } from "lucide-react";

interface DateInputProps {
  value?: string;
  placeholder?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ value, onClick, placeholder }, ref) => {
    const dayLabel =
      value && !isNaN(new Date(value).getTime())
        ? new Date(value).toLocaleDateString("en-US", { weekday: "short" })
        : "";

    return (
      <div
        onClick={onClick}
        className="
          w-[310px] cursor-pointer
          rounded-full bg-soft-grey/40
          px-5 py-3
          flex items-center gap-3
          text-sm
          focus-within:bg-white
          focus-within:ring-2 focus-within:ring-site-accent/30
          transition
        "
      >
        {/* ✅ DAY (UI ONLY) - FORCE COLOR */}
        {dayLabel && (
          <span
            className="!text-gray-900 font-semibold min-w-[40px] leading-none"
            style={{ color: "#111827" }} // extra force (prevents white override)
          >
            {dayLabel}
          </span>
        )}

        {/* ✅ ORIGINAL VALUE — UNCHANGED */}
        <input
          ref={ref}
          value={value}
          readOnly
          placeholder={placeholder}
          className="bg-transparent outline-none w-full cursor-pointer !text-gray-900"
          style={{ color: "#111827" }} // force input too (optional but safe)
        />

        <CalendarDays size={18} className="text-gray-800 ml-auto" />
      </div>
    );
  }
);

DateInput.displayName = "DateInput";
