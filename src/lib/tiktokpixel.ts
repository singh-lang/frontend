import type { PixelParams } from "@/types/analytics";

export const initSnapPixel = (id: string): void => {
  if (typeof window !== "undefined" && window.snaptr) {
    window.snaptr("init", id);
  }
};

export const trackSnapEvent = (
  eventName: string,
  params?: PixelParams
): void => {
  if (typeof window !== "undefined" && window.snaptr) {
    window.snaptr("track", eventName, params);
  }
};
