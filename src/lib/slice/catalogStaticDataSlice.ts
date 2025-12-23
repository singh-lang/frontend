import { createSlice } from "@reduxjs/toolkit";

const catalogStaticDataSlice = createSlice({
  name: "catalogStaticData",
  initialState: { categories: [], brands: [], bodyTypes: [] },
  reducers: {
    setCatalogStaticData: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setCatalogStaticData } = catalogStaticDataSlice.actions;
export default catalogStaticDataSlice.reducer;
