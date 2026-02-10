import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FilterState {
  noDeposit: boolean;
  category: string[];
  brand: string[];
  bodyType: string[];
  priceRange: [number, number];
  location: string;
   sort: string;
  hasUserSorted: boolean;
  isLoading: boolean;
  error: string | null;
  priceFrom?: number;
priceTo?: number;
  regionalSpec: string[]; // backend: regionalSpecs: [{_id,name}]
  seatingCapacity: string[]; // backend: seatingCapacities: [{_id,seats}]
  transmission: string[]; // backend: transmissions: [{_id,transmission}]
  // backend: carColors: [{_id,name}]

  interiorColor: string[]; // NEW — SAME LIST, DIFFERENT PURPOSE
  exteriorColor: string[];
}

const initialState: FilterState = {
  noDeposit: false,
  category: [],
  brand: [],
  bodyType: [],
  priceRange: [0, 0],
  location: "",
 sort: "newest",
   hasUserSorted: false,
   isLoading: false,
  error: null,
    priceFrom: undefined,
  priceTo: undefined,
  regionalSpec: [],
  seatingCapacity: [],
  transmission: [],
  interiorColor: [], // Must be NEW separate fields
  exteriorColor: [],
};

const catalogFiltersSlice = createSlice({
  name: "catalogFilters",
  initialState,
  reducers: {
    setCatalogFilters(state, action: PayloadAction<Partial<FilterState>>) {
      return { ...state, ...action.payload };
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    removeCatalogFilters() {
      return initialState;
    },
  },
});

export const { setCatalogFilters, setLoading, setError, removeCatalogFilters } =
  catalogFiltersSlice.actions;

export default catalogFiltersSlice.reducer;
