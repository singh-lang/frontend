// src/lib/gtag.ts

// Your Google Analytics 4 Measurement ID
export const GA_TRACKING_ID = "G-M0QBZYDVTS";

/**
 * Send a pageview event to Google Analytics
 */
export const pageview = (url: string): void => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

/**
 * Send a custom GA event
 * @param action - The event action (e.g. 'purchase')
 * @param category - The event category (e.g. 'ecommerce')
 * @param label - Optional event label
 * @param value - Optional event value
 */
interface GTagEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export const event = ({ action, category, label, value }: GTagEvent): void => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};
