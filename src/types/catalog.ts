export type SearchParams = {
  [key: string]: string | string[] | undefined;
  brand?: string;
  bodyType?: string;
  location?: string;
  priceRange?: string;
  startDate?: string;
  endDate?: string;
  page?: string;
  sort?: string;
};

export type FilterValue =
  | string
  | number
  | boolean
  | string[]
  | null
  | undefined;
