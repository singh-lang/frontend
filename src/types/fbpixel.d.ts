import type { PixelParams } from "./analytics";

export {};

declare global {
  interface Window {
    fbq: (
      command: "init" | "track" | "trackCustom",
      eventNameOrId: string,
      params?: PixelParams
    ) => void;
  }
}
