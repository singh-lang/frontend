"use client";

import { X, Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNum: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, { message: "Invalid phone number" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(50, { message: "Password must be at most 50 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultTab?: "signin" | "register";
}

const AuthModal = ({
  isOpen,
  onClose,
  onSuccess,
  defaultTab = "signin",
}: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<"signin" | "register">(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading] = useState(false);
  const [errorMessage] = useState<string | null>(null);

  const { signIn, signUp, signInWithGoogle } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: registerFormReset,
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: loginFormReset,
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const onLoginSubmit = async (data: { email: string; password: string }) => {
    try {
      await signIn(data.email, data.password);
      handleClose();
      onSuccess?.();
    } catch {}
  };

  const onSubmit = async (data: {
    name: string;
    phoneNum: string;
    password: string;
    email: string;
  }) => {
    try {
      const newData = { ...data, role: 3 };
      await signUp(newData);
      onSuccess?.();
    } catch {}
  };

  const handleClose = () => {
    onClose();
    registerFormReset();
    loginFormReset();
  };

  const handleGoogleSuccess = async (res: CredentialResponse) => {
    const idToken = res.credential;
    if (!idToken) {
      toast.error("No Google token received.");
      return;
    }
    try {
      await signInWithGoogle(idToken);
      toast.success("Signed in with Google");
      handleClose();
      onSuccess?.();
    } catch {}
  };

  const handleGoogleError = () => {
    toast.error("Google sign-in was cancelled or failed.");
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-dark-base/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-md bg-off-white rounded-xl md:rounded-2xl shadow-2xl animate-[slideUp_0.3s_ease-out] my-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
        <button
          onClick={handleClose}
          className="sticky top-4 right-4 z-10 ml-auto mr-4 w-8 h-8 flex items-center justify-center rounded-full bg-grey/10 hover:bg-grey/20 transition-colors focus:outline-none focus:ring-2 focus:ring-site-accent"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-dark-base" />
        </button>

        <div className="px-4 sm:px-6 md:px-8 pb-6 md:pb-8">
          <div className="mb-6 md:mb-8">
            <Image
              src="/assets/dlogo.png"
              alt="The Drive Hub"
              className="h-5 md:h-5 w-auto mb-3 md:mb-4"
              height={100}
              width={100}
            />
            <h2
              id="auth-modal-title"
              className="text-2xl md:text-3xl font-bold text-dark-base mb-1.5 md:mb-2"
            >
              {activeTab === "signin" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm md:text-base text-grey leading-relaxed">
              {activeTab === "signin"
                ? "Sign in to continue your luxury car rental experience"
                : "Join us to unlock exclusive car rental deals"}
            </p>
          </div>

          <div
            className="flex gap-2 mb-4 md:mb-6 p-1 bg-grey/10 rounded-lg md:rounded-xl"
            role="tablist"
          >
            <button
              onClick={() => setActiveTab("signin")}
              role="tab"
              aria-selected={activeTab === "signin"}
              aria-controls="signin-panel"
              className={`flex-1 py-2 md:py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-site-accent ${
                activeTab === "signin"
                  ? "bg-white text-dark-base shadow-sm"
                  : "text-grey hover:text-dark-base"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("register")}
              role="tab"
              aria-selected={activeTab === "register"}
              aria-controls="register-panel"
              className={`flex-1 py-2 md:py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-site-accent ${
                activeTab === "register"
                  ? "bg-white text-dark-base shadow-sm"
                  : "text-grey hover:text-dark-base"
              }`}
            >
              Register
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {errorMessage}
            </div>
          )}

          {activeTab === "signin" ? (
            <form
              className="space-y-4"
              onSubmit={handleLoginSubmit(onLoginSubmit)}
            >
              <div>
                <label className="block text-sm font-medium text-dark-base mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey" />
                  <input
                    {...loginRegister("email")}
                    type="email"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-grey/20 rounded-xl focus:border-site-accent focus:outline-none text-dark-base"
                    placeholder="you@example.com"
                  />
                </div>
                {loginErrors?.email && (
                  <p className="text-danger">{loginErrors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-base mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey" />
                  <input
                    {...loginRegister("password")}
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-12 py-3 bg-white border border-grey/20 rounded-xl focus:border-site-accent focus:outline-none text-dark-base"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-grey hover:text-dark-base"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {loginErrors?.password && (
                  <p className="text-danger">{loginErrors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 site-accent-site-accent"
                  />
                  <span className="text-grey">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-site-accent hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-site-accent text-white font-semibold rounded-xl hover:bg-site-accent/90 transition-all disabled:opacity-50"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-dark-base mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey" />
                  <input
                    {...register("name")}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-grey/20 rounded-xl focus:border-site-accent focus:outline-none text-dark-base"
                    placeholder="John Doe"
                  />
                </div>
                {errors?.name && (
                  <p className="text-danger">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-base mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey" />
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-grey/20 rounded-xl focus:border-site-accent focus:outline-none text-dark-base"
                    placeholder="you@example.com"
                  />
                </div>
                {errors?.email && (
                  <p className="text-danger">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-base mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey" />
                  <div className="absolute left-10 top-1/2 -translate-y-1/2 text-grey font-medium">
                    +971
                  </div>
                  <input
                    {...register("phoneNum")}
                    className="w-full pl-20 pr-4 py-3 bg-white border border-grey/20 rounded-xl focus:border-site-accent focus:outline-none text-dark-base"
                    placeholder="50 123 4567"
                  />
                </div>
                {errors?.phoneNum && (
                  <p className="text-danger">{errors.phoneNum.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-base mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey" />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-12 py-3 bg-white border border-grey/20 rounded-xl focus:border-site-accent focus:outline-none text-dark-base"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-grey hover:text-dark-base"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-grey mt-1">
                  Must be at least 8 characters with uppercase, lowercase, and
                  numbers
                </p>
                {errors?.password && (
                  <p className="text-danger">{errors.password.message}</p>
                )}
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-1 site-accent-site-accent"
                  required
                />
                <span className="text-xs text-grey">
                  {"I agree to The Drive Hub's"}{" "}
                  <a href="/terms" className="text-site-accent hover:underline">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="text-site-accent hover:underline"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-site-accent text-white font-semibold rounded-xl hover:bg-site-accent/90 transition-all disabled:opacity-50"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}

          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-grey/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-off-white text-grey">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 flex justify-center">
                <div className="inline-block">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                  />
                </div>
              </div>
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
