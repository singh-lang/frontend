// utils/whatsapp.ts
import type { CarTypes } from "@/types/homePageTypes";

/** ===== Helpers ===== */
function onlyDigits(n?: number | string): string {
  if (n === null || n === undefined) return "";
  return String(n).replace(/[^\d]/g, "");
}

function formatAED(n?: number | string): string {
  const digits = onlyDigits(n);
  if (!digits) return "";
  return Number(digits).toLocaleString("en-AE");
}

export function normalizeWhatsAppNumber(raw?: string, defaultCC = "971"): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  if (raw.startsWith("+")) return digits;
  if (digits.startsWith(defaultCC)) return digits;
  if (digits.startsWith("0")) return defaultCC + digits.slice(1); // 05... -> 9715...
  return defaultCC + digits; // 5... -> 9715...
}

/** If title lacks the model year, append it once. If it already ends with the year, don't duplicate. */
function ensureYearOnce(title: string, year?: number): string {
  if (!year) return title.trim();
  const y = String(year);
  const trimmed = title.trim();
  const tailYear = trimmed.match(/(\d{4})$/)?.[1];
  if (tailYear === y) return trimmed; // already there at end
  if (trimmed.includes(y)) return trimmed; // somewhere inside
  return `${trimmed} ${y}`;
}

/** Prefer vendor WhatsApp number, then mobile, then landline (all normalized). */
export function pickVendorPhone(car: CarTypes): string {
  const c = car?.vendor?.vendorDetails?.contact;
  const p =
    c?.whatsappNum?.trim() ||
    c?.mobileNum?.trim() ||
    c?.landlineNum?.trim() ||
    "";
  return normalizeWhatsAppNumber(p);
}

/** Canonical TDH listing URL */
export function buildListingUrl(car: CarTypes): string {
  return `https://thedrivehub.com/car/${car._id}?utm_source=whatsapp&utm_medium=share&utm_campaign=listing`;
}

/** ===== Main builder ===== */
type BuildOpts = {
  /** Override disclaimer; set to "" to omit completely */
  disclaimer?: string;
  /** If you want to override vendor name for special cases */
  vendorNameOverride?: string;
};

export function buildWhatsAppMessage(car: CarTypes, opts: BuildOpts = {}): string {
  const vendorRaw =
    opts.vendorNameOverride?.trim() ||
    car?.vendor?.vendorDetails?.businessName?.trim() ||
    "the vendor";

  // Vendor shown bold/italic in WhatsApp: *F10 Car Rental L.L.C.*
  const vendor = `*${vendorRaw}*`;

  // Use the given title as the model name container, ensure year appears once
  const title = car?.title?.trim() || car?.car?.carBrand?.name || "this car";
  const nameWithYear = ensureYearOnce(title, car?.car?.modelYear);

  const day   = formatAED(car?.rentPerDay);
  const week  = formatAED(car?.rentPerWeek);
  const month = formatAED(car?.rentPerMonth);

  const priceBits: string[] = [];
  if (day)   priceBits.push(`AED ${day}/day`);
  if (week)  priceBits.push(`AED ${week}/week`);
  if (month) priceBits.push(`AED ${month}/month`);

  const listingUrl = buildListingUrl(car);

  
  /**
   * Final structure:
   *
   * Hi there,
   *
   * I would like to rent a car listed by *F10 Car Rental L.L.C.*
   * Rolls Royce Cullinan Black Badge 2023 •
   *
   * *Price: AED 3,200/day, AED 19,500/week, AED 71,000/month*
   *
   * Listing Link:
   * https://thedrivehub.com/car/...
   *
   * Any changes made to this message will result in the inquiry not being sent to the dealer.-By The Drive Hub
   */
  const lines: string[] = [
    "Hi there,",
    "",
    `I would like to rent a car listed by ${vendor}`,
    `${nameWithYear} •`,
    "",
  ];

  if (priceBits.length) {
    lines.push(`*Price: ${priceBits.join(", ")}*`, "");
  }

  lines.push("Listing Link:", listingUrl);

 

  return lines.join("\n");
}

export function buildWhatsAppUrl(phone?: string, message: string = ""): string {
  const p = normalizeWhatsAppNumber(phone || "");
  const t = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${p}&text=${t}`;
}

/** Convenience: get phone + message + url */
export function getWADeepLinkForCar(car: CarTypes, opts: BuildOpts = {}) {
  const message = buildWhatsAppMessage(car, opts);
  const phone = pickVendorPhone(car);
  return {
    phone,
    message,
    url: buildWhatsAppUrl(phone, message),
  };
}
