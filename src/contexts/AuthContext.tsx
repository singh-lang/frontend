"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";
import {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useCompleteProfileMutation,
  useLazyGetCurrentUserQuery,
  useGoogleAuthMutation,
} from "@/lib/api/auth";
import {
  setToken,
  setUser as setUserInCookies,
  getToken,
  removeUser,
  removeToken,
} from "@/util/cookieMethods";

/* ---------------- Types ---------------- */
interface User {
  id: string;
  email: string;
  name: string;
  mobile: string;
  status: number;
  profileComplete: boolean;
  emirate?: string;
  address?: string;
  city?: string;
  licenseNumber?: string;
  emiratesId?: string;
  documentsUploaded?: boolean;
  isVerified?: boolean;
}
interface APIError {
  data?: { message?: string };
  message?: string;
}
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: {
    name: string;
    email: string;
    role: number;
    phoneNum: string;
    password: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
  completeProfile: (data: FormData) => Promise<unknown>;
  signInWithGoogle: (idToken: string) => Promise<void>;
}
/* --------------------------------------- */

type AnyRecord = Record<string, unknown>;
const isRecord = (v: unknown): v is AnyRecord =>
  typeof v === "object" && v !== null;

/* ---------- Narrowing helpers (no any) ---------- */
const isUser = (v: unknown): v is User => {
  if (!isRecord(v)) return false;
  return (
    typeof v.id === "string" &&
    typeof v.email === "string" &&
    typeof v.name === "string" &&
    typeof v.mobile === "string" &&
    typeof v.status === "number" &&
    typeof v.profileComplete === "boolean"
  );
};

const unwrapUserResponse = (v: unknown): User | null => {
  if (isUser(v)) return v;

  const candidates: unknown[] = [];
  if (isRecord(v)) {
    if (v.user) candidates.push(v.user as unknown);
    if (isRecord(v.data)) {
      const d = v.data as AnyRecord;
      if (d.user) candidates.push(d.user as unknown);
      if (isRecord(d.data) && (d.data as AnyRecord).user) {
        candidates.push((d.data as AnyRecord).user as unknown);
      }
      if (isRecord(d.profile)) candidates.push(d.profile as unknown);
    }
    if (isRecord(v.payload) && (v.payload as AnyRecord).user) {
      candidates.push((v.payload as AnyRecord).user as unknown);
    }
  }
  for (const c of candidates) if (isUser(c)) return c;
  return null;
};

const getMessage = (v: unknown, fallback: string): string => {
  if (isRecord(v) && typeof v.message === "string") return v.message;
  return fallback;
};

const getTokenFromResponse = (v: unknown): string | undefined => {
  if (!isRecord(v)) return undefined;
  if (typeof v.accessToken === "string") return v.accessToken;
  if (typeof v.token === "string") return v.token;
  if (typeof v.access_token === "string") return v.access_token;
  if (typeof v.jwt === "string") return v.jwt;

  const data: unknown = v.data;
  if (isRecord(data)) {
    if (typeof data.accessToken === "string") return data.accessToken;
    if (typeof data.token === "string") return data.token;
    if (typeof data.access_token === "string") return data.access_token;
    if (typeof data.jwt === "string") return data.jwt;
  }
  const auth: unknown = v.auth;
  if (isRecord(auth)) {
    if (typeof auth.accessToken === "string") return auth.accessToken;
    if (typeof auth.token === "string") return auth.token;
    if (typeof auth.access_token === "string") return auth.access_token;
    if (typeof auth.jwt === "string") return auth.jwt;
  }
  return undefined;
};
/* ----------------------------------------------- */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [registerUser] = useRegisterMutation();
  const [signInUser] = useLoginMutation();
  const [signOutUser] = useLogoutMutation();
  const [completeAcc] = useCompleteProfileMutation();
  const [getCurrentUser, { data: currentUser }] = useLazyGetCurrentUserQuery();
  const [googleAuth] = useGoogleAuthMutation();

  useEffect(() => {
    const token = getToken();
    if (token) getCurrentUser(undefined);
    else setIsLoading(false);
  }, [getCurrentUser]);

  useEffect(() => {
    if (typeof currentUser !== "undefined") {
      const u = unwrapUserResponse(currentUser as unknown);
      if (u) {
        setUser(u);
        setUserInCookies(u);
      }
      setIsLoading(false);
    }
  }, [currentUser]);

  const extractErrorMessage = (error: unknown, fallback: string): string => {
    if (typeof error === "string") return error;
    if (isRecord(error)) {
      const e = error as APIError;
      return e.data?.message || e.message || fallback;
    }
    return fallback;
  };

  /* ---------------- Email/password sign-in ---------------- */
  const signIn = async (email: string, password: string) => {
    const t = toast.loading("Signing In...");
    try {
      const res = await signInUser({ email, password }).unwrap();
      const token = getTokenFromResponse(res);
      if (token) {
        setToken(token);
        await getCurrentUser(undefined);
      }
      toast.success(getMessage(res, "Signed in successfully"), { id: t });
    } catch (err) {
      toast.error(extractErrorMessage(err, "Error signing in"), { id: t });
      throw err;
    }
  };

  /* ---------------- Sign-up ---------------- */
  const signUp = async (data: {
    name: string;
    email: string;
    phoneNum: string;
    role: number;
    password: string;
  }) => {
    const t = toast.loading("Creating account...");
    try {
      const res = await registerUser({
        name: data.name,
        email: data.email,
        phoneNum: data.phoneNum,
        role: data.role,
        password: data.password,
      }).unwrap();

      const token = getTokenFromResponse(res);
      if (token) {
        setToken(token);
        await getCurrentUser(undefined);
      }
      toast.success(getMessage(res, "Account created successfully"), { id: t });
    } catch (err) {
      toast.error(extractErrorMessage(err, "Error creating account"), {
        id: t,
      });
      throw err;
    }
  };

  /* ---------------- Google SSO sign-in ---------------- */
  const signInWithGoogle = async (idToken: string) => {
    const t = toast.loading("Signing in with Google...");
    try {
      const res = await googleAuth({ token: idToken }).unwrap();

      const token = getTokenFromResponse(res);
      if (token) setToken(token);

      await getCurrentUser(undefined);

      // If backend also returned {user}, hydrate quickly
      const maybeUser = unwrapUserResponse(res as unknown);
      if (maybeUser) {
        setUser(maybeUser);
        setUserInCookies(maybeUser);
      }

      toast.success(getMessage(res, "Signed in with Google"), { id: t });
    } catch (err) {
      toast.error(extractErrorMessage(err, "Google sign-in failed"), { id: t });
      throw err;
    }
  };

  /* ---------------- Sign-out ---------------- */
  const signOut = async () => {
    toast.promise(signOutUser(undefined).unwrap(), {
      loading: "Logging Out...",
      success: (res) => getMessage(res, "Logged out successfully"),
      error: (err: unknown) => extractErrorMessage(err, "Error logging out"),
    });
    removeToken();
    setUser(null);
    removeUser();
  };

  /* ---------------- Complete profile ---------------- */
  const completeProfile = async (data: FormData) => {
    const t = toast.loading("Submitting...");
    try {
      const res = await completeAcc(data).unwrap();
      const ok =
        isRecord(res) &&
        "success" in res &&
        typeof (res as AnyRecord).success === "boolean"
          ? Boolean((res as AnyRecord).success)
          : false;

      if (ok) {
        toast.success(getMessage(res, "Documents uploaded successfully"), {
          id: t,
        });
        await getCurrentUser(undefined);
      } else {
        toast.success(getMessage(res, "Submitted"), { id: t });
      }
      return res;
    } catch (err) {
      toast.error(extractErrorMessage(err, "Error completing profile"), {
        id: t,
      });
      throw err;
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      setUserInCookies(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        completeProfile,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
