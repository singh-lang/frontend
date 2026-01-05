// lib/api/homeFlags.ts
export const fetchFlagListings = async (flag: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/allListings?${flag}=true&status=1&isActive=true`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch " + flag);
  return res.json();
};
