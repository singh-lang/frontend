import { CarTypes } from "@/types/homePageTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CatalogCarsState {
  carsData: CarTypes[];

  page: number;
  totalPages: number;
  isLoading: boolean;
}

const initialState: CatalogCarsState = {
  carsData: [],
  page: 1,
  totalPages: 1,
  isLoading: false,
};

const catalogCarsSlice = createSlice({
  name: "catalogCars",
  initialState,
  reducers: {
    setCatalogCars: (
      state,
      action: PayloadAction<{
        carsData: CarTypes[];
        page: number;
        totalPages: number;
      }>
    ) => {
      state.carsData = action.payload.carsData;
      state.page = action.payload.page;
      state.totalPages = action.payload.totalPages;
      state.isLoading = false;
    },

    setCarsLoading: (state, action: PayloadAction<{ isLoading: boolean }>) => {
      state.isLoading = action.payload.isLoading;
    },
  },
});

export const { setCatalogCars, setCarsLoading } = catalogCarsSlice.actions;
export default catalogCarsSlice.reducer;
