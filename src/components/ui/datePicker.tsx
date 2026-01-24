import React, { forwardRef } from "react";
import { CalendarDays } from "lucide-react";

interface DateInputProps {
  value?: string;
  placeholder?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ value, onClick, placeholder }, ref) => (
    <div
      onClick={onClick}
      className="
        w-[300px] cursor-pointer
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
        className="bg-transparent font-semibold outline-none w-full cursor-pointer"
      />

      {/* ✅ CALENDAR ICON */}
      <CalendarDays size={18} className="text-gray-800 ml-3" />
    </div>
  ),
);

DateInput.displayName = "DateInput";
