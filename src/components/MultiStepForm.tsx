"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import StepIndicator from "./StepIndicator";
import PhoneNumberInput from "./PhoneNumberInput";
import CountrySelect from "./CountrySelect";
import { AlertTriangle } from "lucide-react"; // ⚠️ Icon like browser error

// ----------------------
// Types
// ----------------------
type Field = {
  label: string;
  type: "text" | "select" | "date" | "phone" | "country" | "city" | "category";
  options?: string[];
  name: keyof FormData;
};
export type Step = {
  fields: Field[];
  subtitle: string;
};

type MultiStepFormProps = {
  title: string;
  steps: Step[];
  onSubmit: (data: FormData) => void;
};

// ----------------------
// Schema & Types
// ----------------------
const finalSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Please include an '@' in the email address"),
  nationality: z.string().nonempty("Nationality is required"),
  phone: z.string().min(10, "Enter a valid phone number"),
  dob: z.string().nonempty("Date of birth is required"),
  country: z.string().nonempty("Country is required"),
  city: z.string().nonempty("City is required"),
  category: z.string().nonempty("Category is required"),
});

type FormData = z.infer<typeof finalSchema>;

// ----------------------
// Error Tooltip Component
// ----------------------
function ErrorTooltip({ message }: { message: string }) {
  return (
    <div className="absolute top-0 right-0 mt-1 mr-1 z-10">
      <div className="relative bg-white border border-orange-400 rounded-md shadow-md text-sm text-[#263337] px-3 py-2 flex items-center gap-2 w-max max-w-[250px]">
        <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
        <span>{message}</span>
        {/* Arrow */}
        <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-orange-400"></div>
        <div className="absolute -bottom-[7px] right-[17px] w-0 h-0 border-l-7 border-r-7 border-t-7 border-l-transparent border-r-transparent border-t-white"></div>
      </div>
    </div>
  );
}

// ----------------------
// Component
// ----------------------
export default function MultiStepForm({
  title,
  steps,
  onSubmit,
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const {
    register,
    setValue,
    watch,
    getValues,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(finalSchema),
    mode: "onChange",
  });

  const { fields, subtitle } = steps[currentStep];

  const handleNext = async () => {
    const fieldNames = fields.map((f) => f.name);
    const isValid = await trigger(fieldNames as (keyof FormData)[]);
    if (!isValid) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onSubmit(getValues());
    }
  };

  const handleCancel = () => setCurrentStep(0);

  return (
    <div className="bg-white w-full max-w-[95vw] sm:max-w-[480px] p-4 sm:p-6 md:p-8 rounded-xl shadow-lg max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
      <h2 className="font-poppins text-[#263337] mb-6 font-normal text-[32px] leading-[120%] text-center uppercase">
        {title}
      </h2>

      {/* Step Indicator */}
      <StepIndicator totalSteps={steps.length} currentStep={currentStep + 1} />

      {/* Subtitle */}
      <p className="text-[#263337] font-poppins font-normal text-[20px] leading-[130%] text-center mb-4">
        {subtitle}
      </p>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleNext();
        }}
        className="flex flex-col justify-between flex-1 mt-6 space-y-6"
      >
        {/* Fields */}
        <div className="overflow-y-auto space-y-6 max-h-[260px]">
          {fields.map((field, idx) => {
            const errorMsg = errors[field.name]?.message as string | undefined;

            // ---------------- PHONE ----------------
            if (field.type === "phone") {
              return (
                <div key={idx} className="flex flex-col relative">
                  <label className="mb-2 font-medium text-[#263337]">
                    {field.label}
                  </label>
                  <PhoneNumberInput
                    value={watch(field.name) || ""}
                    onChange={(val) => setValue(field.name, val)}
                    className={`w-full rounded-md p-3 border ${
                      errorMsg
                        ? "border-orange-400 focus:ring-orange-300"
                        : "border-gray-500 focus:ring-[#89B4BA]"
                    }`}
                  />
                  {errorMsg && <ErrorTooltip message={errorMsg} />}
                </div>
              );
            }

            // ---------------- COUNTRY ----------------
            if (field.type === "country") {
              return (
                <div key={idx} className="flex flex-col relative">
                  <label className="mb-2 font-medium text-[#263337]">
                    {field.label}
                  </label>
                  <CountrySelect
                    value={watch(field.name) || ""}
                    onChange={(val) => setValue(field.name, val)}
                    className={`w-full rounded-md p-3 border ${
                      errorMsg
                        ? "border-orange-400 focus:ring-orange-300"
                        : "border-gray-500 focus:ring-[#89B4BA]"
                    }`}
                  />
                  {errorMsg && <ErrorTooltip message={errorMsg} />}
                </div>
              );
            }

            // ---------------- OTHER INPUTS ----------------
            return (
              <div key={idx} className="flex flex-col relative">
                <label className="font-medium text-[#263337] mb-2">
                  {field.label}
                </label>

                {field.type === "text" && (
                  <input
                    type="text"
                    {...register(field.name)}
                    className={`w-full rounded-md p-3 border bg-transparent text-[#263337] focus:outline-none focus:ring-2 ${
                      errorMsg
                        ? "border-orange-400 focus:ring-orange-300"
                        : "border-gray-500 focus:ring-[#89B4BA]"
                    }`}
                  />
                )}

                {field.type === "date" && (
                  <input
                    type="date"
                    {...register(field.name)}
                    className={`w-full rounded-md p-3 border bg-transparent text-[#263337] focus:outline-none focus:ring-2 ${
                      errorMsg
                        ? "border-orange-400 focus:ring-orange-300"
                        : "border-gray-500 focus:ring-[#89B4BA]"
                    }`}
                  />
                )}

                {(field.type === "select" ||
                  field.type === "city" ||
                  field.type === "category") && (
                  <select
                    {...register(field.name)}
                    className={`w-full rounded-md p-3 border bg-transparent text-[#263337] focus:outline-none focus:ring-2 ${
                      errorMsg
                        ? "border-orange-400 focus:ring-orange-300"
                        : "border-gray-500 focus:ring-[#89B4BA]"
                    }`}
                  >
                    <option value="">Select one...</option>
                    {field.options?.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}

                {errorMsg && <ErrorTooltip message={errorMsg} />}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6">
          <span className="text-sm text-gray-400">
            Step {currentStep + 1}/{steps.length}
          </span>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="border border-[#89B4BA] text-[#263337] px-6 py-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#263337] to-[#59787C] text-white px-6 py-2 rounded-full transition cursor-pointer"
            >
              {currentStep === steps.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
