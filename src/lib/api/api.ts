import { notFound } from "next/navigation";

// lib/api.ts
export interface ApiOptions extends RequestInit {
  auth?: boolean;
}

export const api = async (url: string, options: ApiOptions = {}) => {
  const accessToken = localStorage.getItem("accessToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // only attach Authorization header if auth=true
  if (options.auth !== false && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers,
    credentials: "include", // allows refresh cookies
  });

  // if route is public, just return result
  if (options.auth === false) {
    if (!res.ok) throw new Error("Network error");
    if (res.status === 404) {
      notFound();
    }
    return res.json();
  }

  // handle expired access token (401)
  if (res.status === 401) {
    const refreshRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      localStorage.setItem("accessToken", data.accessToken);

      // retry original request
      res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${data.accessToken}`,
        },
        credentials: "include",
      });
    } else {
      // refresh failed → logout
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      throw new Error("Session expired");
    }
  }

  if (!res.ok) throw new Error("Network error");
  return res.json();
};
