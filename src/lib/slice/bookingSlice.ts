import { createSlice } from "@reduxjs/toolkit";

interface InitialStateType {
  carId: string;

  // 🔥 ADD THESE
  carBrandName?: string;
  location?: string;

  address: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  deliveryRequired?: boolean;
  priceType: string;
}

const initialState: InitialStateType = {
  carId: "",
  carBrandName: "",
  location: "",

  address: "",
  pickupDate: "",
  pickupTime: "",
  dropoffDate: "",
  dropoffTime: "",
  deliveryRequired: false,
  priceType: "daily",
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    addBookingData: (state, action) => {
      state.carId = action.payload.carId;

      // 🔥 NEW
      state.carBrandName = action.payload.carBrandName ?? state.carBrandName;
      state.location = action.payload.location ?? state.location;

      state.address = action.payload.address ?? state.address;
      state.pickupDate = action.payload.pickupDate;
      state.pickupTime = action.payload.pickupTime;
      state.dropoffDate = action.payload.dropoffDate;
      state.dropoffTime = action.payload.dropoffTime;
      state.priceType = action.payload.priceType ?? state.priceType;
      state.deliveryRequired =
        action.payload.deliveryRequired ?? state.deliveryRequired;
    },

    removeBookingData: () => initialState,
  },
});

export const { addBookingData, removeBookingData } = bookingSlice.actions;

export default bookingSlice.reducer;
