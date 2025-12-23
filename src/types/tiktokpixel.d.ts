import type { PixelParams } from "./analytics";

export {};

declare global {
  interface Window {
    ttq: {
      load: (id: string, options?: Record<string, unknown>) => void;
      page: () => void;
      track: (eventName: string, params?: PixelParams) => void;
      identify: (userId: string, traits?: PixelParams) => void;
      instance: (id: string) => unknown;
    };
  }
}
