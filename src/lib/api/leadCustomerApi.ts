import { baseApi } from "./baseApi";

export const leadCustomerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createCustomerLead: build.mutation({
      query: (body) => ({
        url: "/lead/customer",
        method: "POST",
        body, // expects lead data object
      }),
    }),
  }),
});

export const { useCreateCustomerLeadMutation } = leadCustomerApi;
