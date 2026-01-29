"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CreditCard,
  User,
  FileText,
  ChevronRight,
  X,
} from "lucide-react";

/* ---------------- TYPES ---------------- */
type AgeType = number | "50+";
type PaymentMethod = "Cash" | "Credit Card" | "Debit Card";

/* ---------------- MAIN COMPONENT ---------------- */
export default function ImportantInfoSection() {
  const [selectedAge, setSelectedAge] = useState<AgeType>(25);
  const [tempAge, setTempAge] = useState<AgeType>(25);

  const [selectedExperience, setSelectedExperience] = useState(6);
  const [tempExperience, setTempExperience] = useState(6);

  const [selectedPayments, setSelectedPayments] = useState<PaymentMethod[]>([
    "Cash",
    "Credit Card",
    "Debit Card",
  ]);
  const [tempPayments, setTempPayments] = useState<PaymentMethod[]>([]);

  const [showAgePopup, setShowAgePopup] = useState(false);
  const [showExperiencePopup, setShowExperiencePopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  const ageOptions: readonly AgeType[] = [
    ...Array.from({ length: 33 }, (_, i) => i + 18),
    "50+",
  ];

  const experienceOptions = [
    0,
    ...Array.from({ length: 20 }, (_, i) => i + 1),
  ];

  return (
    <>
      {/* CARD */}
      <section className="bg-white rounded-3xl border border-gray-200 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <div className="divide-y">

          {/* PAYMENT */}
          <Row>
            <RowLeft icon={<CreditCard size={20} />} title="Payment on pickup" />
            <RowRight>
              <p className="text-sm font-semibold text-gray-900">
                {selectedPayments.join(", ")}
              </p>
              <button
                onClick={() => {
                  setTempPayments(selectedPayments);
                  setShowPaymentPopup(true);
                }}
                className="text-xs font-semibold text-site-accent hover:underline"
              >
                Other options?
              </button>
            </RowRight>
          </Row>

          {/* MIN AGE */}
          <Row>
            <RowLeft icon={<User size={20} />} title="Minimum age" />
            <RowRight>
              <p className="text-sm font-semibold text-gray-900">
                {selectedAge} years
              </p>
              <button
                onClick={() => {
                  setTempAge(selectedAge);
                  setShowAgePopup(true);
                }}
                className="text-xs font-semibold text-site-accent hover:underline"
              >
                Other age?
              </button>
            </RowRight>
          </Row>

          {/* EXPERIENCE */}
          <Row>
            <RowLeft icon={<User size={20} />} title="Minimum driving experience" />
            <RowRight>
              <p className="text-sm font-semibold text-gray-900">
                {selectedExperience === 0
                  ? "Less than 1 year"
                  : `${selectedExperience} year${selectedExperience > 1 ? "s" : ""}`}
              </p>
              <button
                onClick={() => {
                  setTempExperience(selectedExperience);
                  setShowExperiencePopup(true);
                }}
                className="text-xs font-semibold text-site-accent hover:underline"
              >
                Other experience?
              </button>
            </RowRight>
          </Row>

          <ArrowRow title="Required documents" href="/idp" />
          <ArrowRow title="Car rental terms and conditions" href="/terms" />
        </div>
      </section>

      {/* ---------------- POPUPS ---------------- */}

      {showPaymentPopup && (
        <Popup
          title="Select Payment Method"
          onClose={() => setShowPaymentPopup(false)}
          onApply={() => {
            setSelectedPayments(tempPayments);
            setShowPaymentPopup(false);
          }}
        >
          {(["Cash", "Credit Card", "Debit Card"] as PaymentMethod[]).map(
            (method) => (
              <OptionButton
                key={method}
                active={tempPayments.includes(method)}
                onClick={() => setTempPayments([method])}
              >
                {method}
              </OptionButton>
            )
          )}
        </Popup>
      )}

      {showAgePopup && (
        <Popup
          title="Select Minimum Age"
          onClose={() => setShowAgePopup(false)}
          onApply={() => {
            setSelectedAge(tempAge);
            setShowAgePopup(false);
          }}
        >
          {ageOptions.map((age) => (
            <OptionButton
              key={age}
              active={tempAge === age}
              onClick={() => setTempAge(age)}
            >
              {age} years
            </OptionButton>
          ))}
        </Popup>
      )}

      {showExperiencePopup && (
        <Popup
          title="Select Driving Experience"
          onClose={() => setShowExperiencePopup(false)}
          onApply={() => {
            setSelectedExperience(tempExperience);
            setShowExperiencePopup(false);
          }}
        >
          {experienceOptions.map((exp) => (
            <OptionButton
              key={exp}
              active={tempExperience === exp}
              onClick={() => setTempExperience(exp)}
            >
              {exp === 0 ? "Less than 1 year" : `${exp} year${exp > 1 ? "s" : ""}`}
            </OptionButton>
          ))}
        </Popup>
      )}
    </>
  );
}

/* ---------------- UI HELPERS ---------------- */

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start px-6 py-4">
      {children}
    </div>
  );
}

function RowLeft({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex gap-3 items-center text-gray-500">
      {icon}
      <span className="text-sm font-semibold text-gray-700">
        {title}
      </span>
    </div>
  );
}

function RowRight({ children }: { children: React.ReactNode }) {
  return <div className="text-right">{children}</div>;
}

function ArrowRow({ title, href }: { title: string; href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 transition"
    >
      <div className="flex gap-3 items-center text-gray-500">
        <FileText size={20} />
        <span className="text-sm font-semibold text-gray-700">
          {title}
        </span>
      </div>
      <ChevronRight size={18} className="text-gray-400" />
    </Link>
  );
}

/* ---------------- POPUP ---------------- */

function Popup({
  title,
  children,
  onClose,
  onApply,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onApply: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-base font-semibold text-gray-900">
            {title}
          </h3>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-2">{children}</div>

        <div className="p-4 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onApply}
            className="flex-1 py-3 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-site-accent to-slate-teal
                       shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function OptionButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl text-left transition border ${
        active
          ? "bg-gradient-to-r from-site-accent to-slate-teal text-white font-semibold shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
          : "bg-white border-gray-200 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}
