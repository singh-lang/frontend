import { CarTypes } from "@/types/homePageTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CatalogCarsState {
  carsData: CarTypes[];
  isLoading: boolean;
}
const initialState: CatalogCarsState = {
  carsData: [],
  isLoading: false,
};

const catalogCarsSlice = createSlice({
  name: "catalogCars",
  initialState,
  reducers: {
    setCatalogCars: (
      state,
      action: PayloadAction<{ carsData: CarTypes[] }>
    ) => {
      state.carsData = action.payload.carsData;
      state.isLoading = false;
    },

    setCarsLoading: (
      state,
      action: PayloadAction<{ isLoading: boolean }>
    ) => {
      state.isLoading = action.payload.isLoading;
    },

    clearCatalogCars: (state) => {
      state.carsData = [];
    },
  },
});


export const { setCatalogCars, setCarsLoading } = catalogCarsSlice.actions;
export default catalogCarsSlice.reducer;
