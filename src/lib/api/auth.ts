// src/lib/api/auth.ts
import { baseApi } from "./baseApi";
import { setToken, removeToken } from "@/util/cookieMethods";

/** Match your app's user shape (kept minimal) */
export interface ApiUser {
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
}

/** Helper types */
type GoogleAuthResponse = { accessToken?: string; user?: ApiUser };
type GoogleAuthRaw =
  | { accessToken?: string; user?: ApiUser }
  | { data?: { token?: string; user?: ApiUser } };

type AnyRecord = Record<string, unknown>;
const isRecord = (v: unknown): v is AnyRecord =>
  typeof v === "object" && v !== null;

/* ---------------- Google SSO normalizer ---------------- */
const normalizeGoogleAuth = (raw: unknown): GoogleAuthResponse => {
  if (isRecord(raw) && typeof raw.accessToken === "string") {
    return {
      accessToken: raw.accessToken,
      user: (raw.user as ApiUser | undefined) ?? undefined,
    };
  }
  if (isRecord(raw) && isRecord(raw.data)) {
    const d = raw.data as AnyRecord;
    const token = typeof d.token === "string" ? d.token : undefined;
    const user = isRecord(d.user) ? (d.user as unknown as ApiUser) : undefined;
    return { accessToken: token, user };
  }
  return {};
};
/* ------------------------------------------------------- */

/* -------- getCurrentUser normalizer (critical fix) ----- */
const pickString = (...vals: unknown[]): string | undefined => {
  for (const v of vals) if (typeof v === "string" && v.trim()) return v;
  return undefined;
};
const pickNumber = (...vals: unknown[]): number | undefined => {
  for (const v of vals) {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) {
      return Number(v);
    }
  }
  return undefined;
};
const pickBool = (...vals: unknown[]): boolean | undefined => {
  for (const v of vals) if (typeof v === "boolean") return v;
  return undefined;
};

const toApiUser = (raw: unknown): ApiUser | null => {
  if (!isRecord(raw)) return null;
  const r = raw as AnyRecord;

  const contact: AnyRecord | undefined = isRecord(r.contact)
    ? (r.contact as AnyRecord)
    : undefined;

  const id = pickString(r.id, r._id, r.userId, r.uid);
  const name = pickString(
    r.name,
    r.fullName,
    typeof r.firstName === "string" || typeof r.lastName === "string"
      ? `${String(r.firstName ?? "")} ${String(r.lastName ?? "")}`.trim()
      : undefined
  );
  const email = pickString(r.email, r.mail as string | undefined);
  const mobile =
    pickString(
      r.mobile,
      r.phone,
      r.phoneNum,
      contact?.phoneNum,
      contact?.phone
    ) ?? "";

  const status = pickNumber(r.status, r.accountStatus) ?? 1;

  // derive profileComplete if server not sending it flat
  const documents: AnyRecord | undefined = isRecord(r.documents)
    ? (r.documents as AnyRecord)
    : undefined;
  const hasAnyDoc = documents
    ? Object.values(documents).some((v) => Boolean(v))
    : false;
  const profileComplete =
    pickBool(r.profileComplete, r.isProfileComplete) ?? hasAnyDoc;

  if (!id || !name || !email) return null;

  return {
    id,
    name,
    email,
    mobile,
    status,
    profileComplete,
    emirate: (pickString(r.emirate, contact?.emirate) ?? "") as string,
    address: (pickString(r.address, contact?.address) ?? "") as string,
    city: (pickString(r.city, contact?.city) ?? "") as string,
    licenseNumber: (pickString(r.licenseNumber, contact?.licenseNumber) ??
      "") as string,
    emiratesId: (pickString(r.emiratesId, contact?.emiratesId) ?? "") as string,
  };
};

/** Accepts: plain user, {user}, {data:{user}}, or {data:{...flat user}} */
const normalizeUser = (raw: unknown): unknown => {
  const r = raw as unknown;
  const candidates: unknown[] = [
    r,
    isRecord(r) ? (r as AnyRecord).user : undefined,
    isRecord(r) && isRecord((r as AnyRecord).data)
      ? ((r as AnyRecord).data as AnyRecord).user
      : undefined,
    isRecord(r) ? (r as AnyRecord).data : undefined,
  ];
  for (const c of candidates) {
    const u = toApiUser(c);
    if (u) return u;
  }
  return raw;
};
/* ------------------------------------------------------- */

const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    register: builder.mutation<
      unknown,
      {
        name: string;
        email: string;
        phoneNum: string;
        role: number;
        password: string;
      }
    >({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
    }),

    completeProfile: builder.mutation<unknown, FormData>({
      query: (data) => ({
        url: "/complete-profile",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation<unknown, { email: string; password: string }>({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),

    googleAuth: builder.mutation<GoogleAuthResponse, { token: string }>({
      query: (body) => ({
        url: "/googleAuth",
        method: "POST",
        body, // { token }
      }),
      transformResponse: (raw: unknown) => normalizeGoogleAuth(raw),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.accessToken) setToken(data.accessToken);
        } catch {
          removeToken();
        }
      },
    }),

    getCurrentUser: builder.query<unknown, void>({
      query: () => ({
        url: "/getCurrentUser",
        method: "GET",
      }),
      transformResponse: (raw: unknown) => normalizeUser(raw),
    }),

    logout: builder.mutation<unknown, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useCompleteProfileMutation,
  useLoginMutation,
  useGoogleAuthMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useLogoutMutation,
} = authApi;
