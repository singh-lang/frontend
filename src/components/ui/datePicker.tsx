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
        onClick={() => setOpen(!open)}
        className="
          w-full flex items-center gap-3
          rounded-xl bg-soft-grey/30 px-4 py-3
          text-sm text-left
          hover:bg-soft-grey/40
          focus:outline-none
        "
      >
        <CalendarIcon size={16} className="text-grey" />
        {value ? format(value, "dd/MM/yyyy") : "dd/mm/yyyy"}
      </button>

      {/* POPOVER */}
      {open && (
        <div className="absolute z-50 mt-2 rounded-2xl bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
          <DayPicker
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            disabled={minDate ? { before: minDate } : undefined}
            className="rounded-xl"
          />
        </div>
      )}
    </div>
  );
}
