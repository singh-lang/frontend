import { LucideIcon } from "lucide-react";

interface InputProps {
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "search"
    | "tel"
    | "url"
    | "date"
    | "time";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  className?: string;
  name?: string;
  id?: string;
  variant?: "default" | "hero" | "auth";
}

const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  iconPosition = "left",
  label,
  error,
  disabled = false,
  required = false,
  fullWidth = false,
  className = "",
  name,
  id,
  variant = "default",
}: InputProps) => {
  const inputId = id || name;

  const variantStyles = {
    default: "px-4 py-3 text-sm md:text-base",
    hero: "px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base",
    auth: "px-4 py-3 text-base",
  };

  const iconSize = {
    default: "w-5 h-5",
    hero: "w-4 md:w-5 h-4 md:h-5",
    auth: "w-5 h-5",
  };

  const labelStyles = {
    default: "text-sm font-semibold text-dark-base",
    hero: "text-xs md:text-sm font-semibold text-dark-base",
    auth: "text-sm font-semibold text-dark-base",
  };

  return (
    <div className={`${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`block ${labelStyles[variant]} mb-1.5 md:mb-2`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && iconPosition === "left" && (
          <Icon
            className={`absolute left-3 md:left-4 top-1/2 -translate-y-1/2 ${iconSize[variant]} text-grey`}
          />
        )}

        <input
          type={type}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full ${variantStyles[variant]}
            ${Icon && iconPosition === "left" ? "pl-10 md:pl-12" : ""}
            ${Icon && iconPosition === "right" ? "pr-10 md:pr-12" : ""}
            border-2 border-soft-grey/30 rounded-lg md:rounded-xl
            text-dark-base font-medium
            placeholder:text-grey/60
            focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
            disabled:bg-soft-grey/10 disabled:cursor-not-allowed
            transition-all duration-200
            ${
              error
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : ""
            }
            ${className}
          `}
        />

        {Icon && iconPosition === "right" && (
          <Icon
            className={`absolute right-3 md:right-4 top-1/2 -translate-y-1/2 ${iconSize[variant]} text-grey`}
          />
        )}
      </div>

      {error && (
        <p className="mt-1.5 md:mt-2 text-xs md:text-sm text-red-500 font-medium leading-tight">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
