import type { PixelParams } from "./analytics";

export {};

declare global {
  interface Window {
    snaptr: (
      command: "init" | "track",
      eventOrId: string,
      params?: PixelParams
    ) => void;
  }
}