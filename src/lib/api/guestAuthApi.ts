import { baseApi } from "./baseApi";

const guestAuthApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    /* ==================================
       SEND TEMP PASSWORD TO GUEST
       (Payment success page)
    ================================== */
    sendGuestTempPassword: builder.mutation<
      { success: boolean; message: string },
      { bookingId: string }
    >({
      query: (body) => ({
        url: "/auth/guest/send-temp-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSendGuestTempPasswordMutation } = guestAuthApi;

export default guestAuthApi;
