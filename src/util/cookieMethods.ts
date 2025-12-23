import Cookies from "js-cookie";

// ---------- Local Storage Helpers ----------

export const setItem = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

export const setObjectInLocalStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// export const getItem = <T = any>(key: string): T | null => {
//   const val = localStorage.getItem(key);
//   try {
//     return val ? (JSON.parse(val) as T) : null;
//   } catch {
//     return null;
//   }
// };

export const getSingleItem = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const removeItem = (key: string): void => {
  localStorage.removeItem(key);
};

// ---------- Cookie Helpers (Tokens, User, Roles) ----------

export const setToken = (token: string): void => {
  Cookies.set("customer-token", token, { expires: 1 });
};

export const getToken = (): string | null => {
  return Cookies.get("customer-token") || null;
};

export const removeToken = (): void => {
  Cookies.remove("customer-token");
  Cookies.remove("customerRefreshToken");
};

export const setUser = (user: object): void => {
  Cookies.set("user-customer", JSON.stringify(user), { expires: 1 });
};

export const getUser = <T = unknown>(): T | null => {
  const user = Cookies.get("user-customer");
  if (!user) return null;
  try {
    return JSON.parse(user) as T;
  } catch {
    return null;
  }
};

export const removeUser = (): void => {
  Cookies.remove("user-customer");
};

export const setUserRole = (role: string | number): void => {
  Cookies.set("customer-role", role.toString(), { expires: 1 });
};

export const getUserRole = (): number | null => {
  const role = Cookies.get("customer-role");
  return role ? parseInt(role, 10) : null;
};

export const removeUserRole = (): void => {
  Cookies.remove("customer-role");
};
