"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";


import {
  CreditCard,
  User,
  FileText,
  ChevronRight,
  X,
} from "lucide-react";
import { useState } from "react";

type AgeType = number | "50+";
export default function ImportantInfoSection() {
  const [selectedAge, setSelectedAge] = useState<AgeType>(25);
  const [tempAge, setTempAge] = useState<AgeType>(25);

  const [selectedExperience, setSelectedExperience] = useState(6);
  const [tempExperience, setTempExperience] = useState(6);

  const [showAgePopup, setShowAgePopup] = useState(false);
  const [showExperiencePopup, setShowExperiencePopup] = useState(false);

type PaymentMethod = "Cash" | "Credit Card" | "Debit Card";

const [selectedPayments, setSelectedPayments] = useState<PaymentMethod[]>([
  "Cash",
  "Credit Card",
  "Debit Card",
]);

const [tempPayments, setTempPayments] = useState<PaymentMethod[]>([]);
const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const ageOptions: readonly AgeType[] = [
    ...Array.from({ length: 33 }, (_, i) => i + 18), // 18 → 50
    "50+",
  ];

const experienceOptions = [
  0, // Less than 1 year
  ...Array.from({ length: 20 }, (_, i) => i + 1),
];
  return (
    <>
      <section className="  p-3">
        <div className="rounded-2xl divide-y">

   <Row>
  <RowLeft icon={<CreditCard size={20} />} title="Payment on pickup" />
  <RowRight>
    <div className="text-right">
      <p className="font-medium">
        {selectedPayments.length > 0
          ? selectedPayments.join(", ")
          : "No payment method selected"}
      </p>

      <button
        onClick={() => {
          setTempPayments(selectedPayments);
          setShowPaymentPopup(true);
        }}
  className="text-sm text-blue-600 hover:underline"
      >
        Other options?
      </button>
    </div>
  </RowRight>
</Row>

{showPaymentPopup && (
  <Popup
    title="Select Payment Method"
    onClose={() => setShowPaymentPopup(false)}
    onApply={() => {
      setSelectedPayments(tempPayments);
      setShowPaymentPopup(false);
    }}
  >
    <div className="space-y-3 text-gray">
      {(["Cash", "Credit Card", "Debit Card"] as PaymentMethod[]).map(
        (method) => {
          const isActive = tempPayments.includes(method);

          return (
            <button
              key={method}
              onClick={() => setTempPayments([method])}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200
                ${
                  isActive
                    ? "bg-gradient-to-r from-site-accent to-slate-teal text-white font-medium shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
                    : "bg-white border border-gray-200 hover:bg-gray-50"
                }`}
            >
              {method}
            </button>
          );
        }
      )}
    </div>
  </Popup>
)}


          <Row>
            <RowLeft icon={<User size={20} />} title="Minimum age" />
            <RowRight>
              <div className="text-sm font-Medium ">
                <p className="font-medium">{selectedAge} years</p>
                <button
                  onClick={() => {
                    setTempAge(selectedAge);
                    setShowAgePopup(true);
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Other age?
                </button>
              </div>
            </RowRight>
          </Row>

          <Row>
            <RowLeft icon={<User size={20} />} title="Minimum driving experience" />
            <RowRight>
              <div className="text-right">
                <p className="font-medium">
                  {selectedExperience === 0
                    ? "Less than 1 year"
                    : `${selectedExperience} year${selectedExperience > 1 ? "s" : ""}`}
                </p>
                              
                
                <button
                  onClick={() => {
                    setTempExperience(selectedExperience);
                    setShowExperiencePopup(true);
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Other experience?
                </button>
              </div>
            </RowRight>
          </Row>
           
          <ArrowRow title="Required documents" href="/idp" />

          <ArrowRow title="Car rental terms and conditions" href="/terms" />
        </div>
      </section>

      {showAgePopup && (
        <Popup
          title="Select Minimum Age"
          onClose={() => setShowAgePopup(false)}
          onApply={() => {
            setSelectedAge(tempAge);
            setShowAgePopup(false);
          }}
        >
          <div className="grid text-sm font-Medium">
            {ageOptions.map((age) => (
              <OptionButton
                key={age}
                active={tempAge === age}
                onClick={() => setTempAge(age)}
              >
                {age} Years
              </OptionButton>
            ))}
          </div>
        </Popup>
      )}

      {showExperiencePopup && (
        <Popup
          title="Select Minimum Driving Experience"
          onClose={() => setShowExperiencePopup(false)}
          onApply={() => {
            setSelectedExperience(tempExperience);
            setShowExperiencePopup(false);
          }}
        >
          <div className="grid text-sm font-Medium">
           {experienceOptions.map((m) => (
            <OptionButton
              key={m}
              active={tempExperience === m}
              onClick={() => setTempExperience(m)}
            >
              {m === 0 ? "Less than 1 year" : `${m} year${m > 1 ? "s" : ""}`}
            </OptionButton>
          ))}

          </div>
        </Popup>
      )}
    </>
  );
}

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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-sm font-Medium">{title}</h3>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">{children}</div>

        <div className="p-6 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={onApply}
            className="flex-1 py-3 bg-gradient-to-r from-site-accent to-slate-teal shadow-[0_12px_28px_rgba(0,0,0,0.12)] rounded-xl font-medium"
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
      className={`p-4 rounded-xl transition text-center ${
        active
          ? "bg-gradient-to-r from-site-accent to-slate-teal shadow-[0_12px_28px_rgba(0,0,0,0.12)] font-medium"
          : ""
      }`}
    >
      {children}
    </button>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-between px-6 py-5">{children}</div>;
}

function RowLeft({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex gap-3 items-center text-gray-800">
      {icon}
      <span className="text-sm font-Medium ">{title}</span>
    </div>
  );
}

function RowRight({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-right">{children}</div>;
}

function ArrowRow({
  title,
  href,
}: {
  title: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex justify-between items-center
                 px-6 py-5
                 hover:bg-black/5 transition"
    >
      <div className="flex gap-3 items-center">
        <FileText size={20} />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <ChevronRight size={18} />
    </Link>
  );
}
