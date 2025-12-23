import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import catalogFiltersReducer from "./slice/catalogFiltersSlice";
import catalogCarsReducer from "./slice/catalogCarsSlice";
import bookingReducer from "./slice/bookingSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      catalogFilters: catalogFiltersReducer,
      catalogCars: catalogCarsReducer,
      booking: bookingReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
