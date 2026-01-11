import {
  createApi,
  fetchBaseQuery,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { getToken, removeToken, setToken } from "@/util/cookieMethods";

interface RefreshResponse {
  data: {
    token: string;
  };
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

/* ---------------- BASE QUERY ---------------- */
const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = getToken();

    // ✅ Only attach token if present
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

/* ---------------- HELPERS ---------------- */
const PUBLIC_ENDPOINTS = ["/booking/create", "/booking/calculation"];

/* ---------------- BASE QUERY WITH REAUTH ---------------- */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const url = typeof args === "string" ? args : (args.url as string);

  const isPublic = PUBLIC_ENDPOINTS.some((path) => url.includes(path));

  let result = await baseQuery(args, api, extraOptions);

  // ✅ DO NOT REFRESH FOR PUBLIC (GUEST) ROUTES
  if (isPublic) {
    return result;
  }

  // 🔐 ONLY FOR AUTHENTICATED ROUTES
  if (result.error && result.error.status === 401) {
    console.warn("Access token expired — attempting refresh...");

    const refreshResult = await baseQuery(
      { url: "/refresh", method: "POST", body: { role: 3 } },
      api,
      extraOptions
    );

    const refreshData = refreshResult.data as RefreshResponse | undefined;
    const newToken = refreshData?.data?.token;

    if (newToken) {
      setToken(newToken);

      // retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.warn("Refresh failed — clearing session");
      removeToken();
    }
  }

  return result;
};

/* ---------------- API ---------------- */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["AllBookings", "CarAddonsByCar"],
  endpoints: () => ({}),
});
