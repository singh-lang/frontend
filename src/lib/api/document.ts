// src/lib/api/documentsApi.js
import { baseApi } from "./baseApi";

export const documentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDocuments: build.query({
      query: () => ({
        url: "/user-profile/documents",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDocumentsQuery, useLazyGetDocumentsQuery } = documentsApi;
