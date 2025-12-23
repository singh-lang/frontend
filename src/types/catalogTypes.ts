export interface CarDoc {
  _id: string;
  name: string;
  // Add additional fields from API as needed
}

export interface PaginationResponse<T> {
  docs: T[];
  page: number;
  totalPages: number;
  totalDocs?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  nextPage?: number | null;
  prevPage?: number | null;
}

/* -------------------------------------------------------
 * UPDATED FILTER STATE ACCORDING TO BACKEND
 * ------------------------------------------------------- */
export interface FilterState {
  category: string[];
  brand: string[];
  bodyType: string[];

  noDeposit: boolean;

  // we store range internally BUT backend only takes priceRange = max
  priceRange: [number, number];

  location: string;
  sort: string;
  page?: number;

  /** Backend new filter fields */
  regionalSpec: string[];
  seatingCapacity: string[];
  transmission: string[];
  carColor: string[];
}
