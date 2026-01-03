"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

interface DatePickerProps {
  value?: Date;
  onChange: (date?: Date) => void;
  minDate?: Date;
}

export default function DatePicker({
  value,
  onChange,
  minDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      {/* INPUT */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`
          w-full flex items-center gap-3
          rounded-xl px-4 py-3
          text-sm text-left transition
          ${open ? "bg-white" : "bg-soft-grey/30 hover:bg-soft-grey/40"}
        `}
      >
        <CalendarIcon size={16} className="text-grey" />
        <span className={value ? "text-dark-base" : "text-grey"}>
          {value ? format(value, "dd MMM yyyy") : "Select date"}
        </span>
      </button>

      {/* POPOVER */}
      {open && (
        <div
          className="
            absolute z-50 mt-2
            rounded-2xl bg-white p-3
            border border-soft-grey/40
            shadow-[0_18px_40px_rgba(0,0,0,0.12)]
          "
        >
          <DayPicker
            mode="single"
            selected={value}
            onSelect={(date) => {
              if (!date) return;

              // ✅ timezone-safe (fixes 4 → 3 bug)
              const safeDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                12
              );

              onChange(safeDate);
              setOpen(false);
            }}
            disabled={minDate ? { before: minDate } : undefined}
            className="site-calendar"
          />
        </div>
      )}
    </div>
  );
}
