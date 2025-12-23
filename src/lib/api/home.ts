import { notFound } from "next/navigation";

export const fetchCategoryListings = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/home-page/categoryListings`,
      {
        next: { revalidate: 480 },
      }
    );
    if (res.status === 404) {
    }
    if (!res.ok) {
      throw new Error(`Failed to fetch listings. Status: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
};

export const fetchCategories = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/home-page/homePageCategories`,
      {
        next: { revalidate: 600 },
      }
    );
    if (res.status === 404) {
      notFound();
    }
    if (!res.ok) {
      throw new Error(`Failed to fetch listings. Status: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
};

export const fetchMasterData = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/home-page/homePageMasterData`,
      {
        next: { revalidate: 720 },
      }
    );
    if (res.status === 404) {
      notFound();
    }
    if (!res.ok) {
      throw new Error(`Failed to fetch listings. Status: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
};
