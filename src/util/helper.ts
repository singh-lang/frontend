import type { ApiCarResponse, FilterValues } from "@/lib/api/catalog";

/* -------------------------------------------------------
 * FILTER STATE (matching backend)
 * ------------------------------------------------------- */
export interface FilterState {
  search?: string; // ✅ ADD THIS
  category?: string[];
  brand?: string[];
  bodyType?: string[];
  noDeposit?: boolean;
  priceRange?: [number, number];
  location?: string;
  sort?: string;
  page?: number;

  regionalSpec?: string[];
  seatingCapacity?: string[];
  transmission?: string[];
  exteriorColor?: string[];
  interiorColor?: string[];
}

/* -------------------------------------------------------
 * CHECK ACTIVE FILTERS
 * ------------------------------------------------------- */
export const hasActiveFilters = (f: FilterState): boolean =>
  [
    f.search, // ✅ ADD THIS
    f.category?.length,
    f.brand?.length,
    f.bodyType?.length,
    f.noDeposit,
    f.priceRange && f.priceRange[1] > 0,
    f.location,
    f.sort,

    f.regionalSpec?.length,
    f.seatingCapacity?.length,
    f.transmission?.length,
    f.exteriorColor?.length,
    f.interiorColor?.length,
  ].some(Boolean);

/* -------------------------------------------------------
 * BUILD FINAL FILTER OBJECT FOR API
 * ------------------------------------------------------- */
export const getFilters = (f: FilterState): Record<string, FilterValues> => {
  const out: Record<string, FilterValues> = {};
  if (f.search) out.search = f.search; // ✅ ADD THIS
  if (f.category?.length) out.category = f.category;
  if (f.brand?.length) out.brand = f.brand;
  if (f.bodyType?.length) out.bodyType = f.bodyType;

  if (f.noDeposit) out.noDeposit = f.noDeposit;
  if (f.priceRange && f.priceRange[1] > 0) out.priceRange = f.priceRange[1]; // backend only wants max

  if (f.location) out.location = f.location;
  if (f.sort) out.sort = f.sort;
  if (f.page) out.page = f.page;

  /* NEW BACKEND FIELDS */
  if (f.regionalSpec?.length) out.regionalSpec = f.regionalSpec;
  if (f.seatingCapacity?.length) out.seatingCapacity = f.seatingCapacity;
  if (f.transmission?.length) out.transmission = f.transmission;
  /** ⭐ FINAL & CORRECT COLOR HANDLING ⭐ */
  // ✅ correct
  if (f.exteriorColor?.length) out.exteriorColor = f.exteriorColor;
  if (f.interiorColor?.length) out.interiorColor = f.interiorColor;

  return out;
};

/* -------------------------------------------------------
 * URL SEARCH PARAMS
 * ------------------------------------------------------- */
export function getUrlSearchParams(
  searchParams: URLSearchParams,
  type: "object"
): Record<string, string>;
export function getUrlSearchParams(
  searchParams: URLSearchParams,
  type: "string"
): URLSearchParams;

export function getUrlSearchParams(
  searchParams: URLSearchParams,
  type: "object" | "string"
) {
  const keys = [
    "search", // ✅ ADD THIS
    "brand",
    "bodyType",
    "location",
    "priceRange",
    "startDate",
    "endDate",
  ];

  if (type === "string") {
    const p = new URLSearchParams();
    keys.forEach((key) => {
      const val = searchParams.get(key);
      if (val) p.set(key, val);
    });
    return p;
  }

  const obj: Record<string, string> = {};
  keys.forEach((key) => {
    const val = searchParams.get(key);
    if (val) obj[key] = val;
  });

  return obj;
}

/* -------------------------------------------------------
 * FETCH CARS (CLIENT SIDE)
 * ------------------------------------------------------- */
export function fetchCars(args: {
  getCars: (filters: Record<string, FilterValues>) => {
    unwrap: () => Promise<ApiCarResponse>;
  };

  getCatalogCars: (params: {
    filterType: string;
    filterId: string;
    page?: number;
    sort?: string;
  }) => { unwrap: () => Promise<ApiCarResponse> };

  router: { push: (url: string, opts?: { scroll: boolean }) => void };

  hasActive: boolean;
  filters: Record<string, FilterValues>;
  searchFilters: Record<string, string>;
  setCars: (data: ApiCarResponse["data"]) => void;

  filterType: string;
  filterId: string;
  page: number;
  sort?: string;

  searchParams: URLSearchParams;
}) {
  const {
    getCars,
    getCatalogCars,
    router,
    hasActive,
    filters,
    searchFilters,
    setCars,
    filterType,
    filterId,
    page,
    sort,
    searchParams,
  } = args;

  const params = new URLSearchParams(searchParams);
  params.set("page", String(page));
  if (sort) params.set("sort", sort);

  const finalUrl = `?${params.toString()}`;

  /* FILTER MODE */
  if (hasActive || Object.keys(searchFilters).length > 0) {
    const sendFilters = hasActive ? filters : { ...searchFilters, page, sort };

    getCars(sendFilters)
      .unwrap()
      .then((res) => {
        setCars(res.data);
        router.push(finalUrl, { scroll: false });
      });

    return;
  }

  /* NORMAL MODE */
  getCatalogCars({ filterType, filterId, page, sort })
    .unwrap()
    .then((res) => {
      setCars(res.data);
      router.push(finalUrl, { scroll: false });
    });
}
