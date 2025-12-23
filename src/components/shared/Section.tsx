import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  background?: "white" | "off-white" | "gradient-primary" | "gradient-accent";
  padding?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const Section = ({
  children,
  background = "off-white",
  padding = "md",
  className = "",
}: SectionProps) => {
  const backgroundClasses = {
    white: "bg-white",
    "off-white": "bg-off-white",
    "gradient-primary":
      "bg-gradient-to-br from-primary via-primary/95 to-slate-teal/40 relative overflow-hidden",
    "gradient-accent":
      "bg-gradient-to-br from-accent via-accent/95 to-slate-teal/60 relative overflow-hidden",
  };

  const paddingClasses = {
    sm: "py-2 md:py-8 lg:py-10",
    md: "py-2 md:py-8 lg:py-10",
    lg: "py-4 md:py-8 lg:py-10 xl:py-12",
    xl: "py-12 md:py-20 lg:py-24 xl:py-32",
  };

  const hasGradient = background.includes("gradient");

  return (
    <section
      className={`${backgroundClasses[background]} ${paddingClasses[padding]} ${className}`}
    >
      {hasGradient && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(9,180,198,0.2),rgba(89,120,124,0.1)_40%,transparent_70%)] pointer-events-none" />
      )}
      <div
        className={`max-w-7xl mx-auto px-4 md:px-6 ${
          hasGradient ? "relative z-10" : ""
        }`}
      >
        {children}
      </div>
    </section>
  );
};

export default Section;
