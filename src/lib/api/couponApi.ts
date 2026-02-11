import { baseApi } from "./baseApi";

/* ================= APPLY COUPON ================= */

export interface ApplyCouponRequest {
  code: string;
  orderAmount: number;
}

export interface ApplyCouponResponse {
  couponId: string;
  couponType: "PERCENTAGE" | "AMOUNT";
  originalAmount: number;
  discount: number;
  finalAmount: number;
}

/* ================= GET COUPONS ================= */

export interface Coupon {
  _id: string;
  code: string;
  couponType: "PERCENTAGE" | "AMOUNT";
  percentage?: number;
  amount?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validTill: string;
  isActive: boolean;
}

export interface CouponListResponse {
  success: boolean;
  data: Coupon[];
}

const couponApi = baseApi.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    applyCoupon: builder.mutation<
      { success: boolean; data: ApplyCouponResponse },
      ApplyCouponRequest
    >({
      query: (body) => ({
        url: "/apply-coupon",
        method: "POST",
        body,
      }),
    }),

    getCoupons: builder.query<CouponListResponse, void>({
      query: () => ({
        url: "/coupons", 
        method: "GET",
      }),
    }),

  }),
});

export const {
  useApplyCouponMutation,
  useGetCouponsQuery,   // ✅ export this
} = couponApi;

export default couponApi;
