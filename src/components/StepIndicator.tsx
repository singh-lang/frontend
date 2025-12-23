"use client";

type StepIndicatorProps = {
  totalSteps: number;
  currentStep: number; // 1-based index
};

export default function StepIndicator({
  totalSteps,
  currentStep,
}: StepIndicatorProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto mb-10">
      {/* Line Background */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] border-t border-[#89B4BA] -translate-y-1/2" />

    {/* Constant Line */}
<div
  className="absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2"
  style={{
    borderTop: "1px solid #89B4BA",
  }}
/>

      {/* Step Circles */}
      <div className="relative flex justify-between">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === currentStep;

          return (
            <div
              key={i}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium z-10 transition`}
              style={{
                background: isActive
                  ? "linear-gradient(91.73deg, #263337 -4.47%, #59787C 125.13%)"
                  : "white",
                color: isActive ? "white" : "#263337",
                border: isActive ? "none" : "1px solid #89B4BA",
              }}
            >
              {stepNum}
            </div>
          );
        })}
      </div>
    </div>
  );
}
