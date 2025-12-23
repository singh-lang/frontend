import { baseApi } from "./baseApi";

export const leadApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createVendorLead: build.mutation({
      query: (body) => ({
        url: "/lead/vendor",
        method: "POST",
        body, // expects { name, email, phone, carId, vendorId, etc. }
      }),
    }),
  }),
});

export const { useCreateVendorLeadMutation } = leadApi;
