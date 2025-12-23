import { X, Shield, CheckCircle, Clock } from "lucide-react";

interface SignInPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
  onRegister: () => void;
}

const SignInPrompt = ({
  isOpen,
  onClose,
  onSignIn,
  onRegister,
}: SignInPromptProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-dark-base/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-md bg-off-white rounded-2xl shadow-2xl animate-[slideUp_0.3s_ease-out]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-grey/10 hover:bg-grey/20 transition-colors"
        >
          <X className="w-5 h-5 text-dark-base" />
        </button>

        <div className="p-8">
          <div className="w-16 h-16 bg-site-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-site-accent" />
          </div>

          <h2 className="text-3xl font-bold text-dark-base text-center mb-3">
            Sign In to Continue
          </h2>
          <p className="text-grey text-center mb-8">
            Create an account or sign in to book this vehicle and access
            exclusive deals
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-dark-base">
              <CheckCircle className="w-5 h-5 text-site-accent flex-shrink-0" />
              <span className="text-sm">Instant booking confirmation</span>
            </div>
            <div className="flex items-center gap-3 text-dark-base">
              <CheckCircle className="w-5 h-5 text-site-accent flex-shrink-0" />
              <span className="text-sm">
                Manage all your bookings in one place
              </span>
            </div>
            <div className="flex items-center gap-3 text-dark-base">
              <CheckCircle className="w-5 h-5 text-site-accent flex-shrink-0" />
              <span className="text-sm">Access to exclusive member deals</span>
            </div>
            <div className="flex items-center gap-3 text-dark-base">
              <Clock className="w-5 h-5 text-site-accent flex-shrink-0" />
              <span className="text-sm">
                One-time document setup, verified in 24 hours
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onRegister}
              className="w-full py-3 bg-site-accent text-white font-semibold rounded-xl hover:bg-site-accent/90 transition-all"
            >
              Create Account
            </button>
            <button
              onClick={onSignIn}
              className="w-full py-3 bg-white border-2 border-grey/20 text-dark-base font-semibold rounded-xl hover:bg-grey/5 transition-all"
            >
              Sign In
            </button>
          </div>

          <p className="text-xs text-grey text-center mt-6">
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-site-accent hover:underline">
              Terms & Conditions
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPrompt;
