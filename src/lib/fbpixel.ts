import type { PixelParams } from "@/types/analytics";

export const initFacebookPixel = (id: string): void => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("init", id);
  }
};

export const trackFacebookEvent = (
  eventName: string,
  params?: PixelParams
): void => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, params);
  }
};
