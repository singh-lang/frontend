"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Truck, Store } from "lucide-react";
import { toast } from "sonner";

import {
  useCalculateBookingMutation,
  useCreateBookingMutation,
} from "@/lib/api/booking";

/* ================= TYPES ================= */

type PriceType = "daily" | "weekly" | "monthly";

interface BookingCalculation {
  totalAmount: number;
  deliveryCharges: number;
  prepaymentPercent: number;
}

interface ApiError {
  data?: {
    message?: string;
  };
}

/* ---------------- DUMMY ADD-ONS (FRONTEND ONLY) ---------------- */
const ADDONS = {
  childSeat: { label: "Child Seat", price: 50 },
  babySeat: { label: "Baby Seat", price: 50 },
  gps: { label: "GPS Navigation", price: 30 },
  additionalDriver: { label: "Additional Driver", price: 100 },
};

type AddonKey = keyof typeof ADDONS;

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const carId = (params?.carId as string) || "";

  /* ---------------- FORM STATE ---------------- */
  const [priceType, setPriceType] = useState<PriceType>("daily");
  const [canPay, setCanPay] = useState(false);

  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffDate, setDropoffDate] = useState("");
  const [dropoffTime, setDropoffTime] = useState("10:00");

  const [guestEmail, setGuestEmail] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const [deliveryRequired, setDeliveryRequired] = useState(false);
  const [address, setAddress] = useState("");

  /* ---------------- ADDONS ---------------- */
  const [childSeat, setChildSeat] = useState(false);
  const [babySeat, setBabySeat] = useState(false);
  const [gps, setGps] = useState(false);
  const [additionalDriver, setAdditionalDriver] = useState(false);

  /* ---------------- BACKEND ---------------- */
  const [calc, setCalc] = useState<BookingCalculation | null>(null);

  const [calculateBooking, { isLoading: calcLoading }] =
    useCalculateBookingMutation();
  const [createBooking, { isLoading: createLoading }] =
    useCreateBookingMutation();

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  /* ---------------- HELPERS ---------------- */
  const formatMoney = (n: number) =>
    Number.isFinite(n) ? Math.round(n).toLocaleString() : "0";

  const hhmmValid = (t: string) => /^\d{2}:\d{2}$/.test(t);

  const validateForm = (): string | null => {
    if (!pickupDate) return "Pickup date is required";
    if (!dropoffDate) return "Dropoff date is required";
    if (!pickupTime || !hhmmValid(pickupTime))
      return "Pickup time must be HH:mm";
    if (!dropoffTime || !hhmmValid(dropoffTime))
      return "Dropoff time must be HH:mm";
    if (deliveryRequired && !address.trim())
      return "Delivery address is required";
    if (!guestName.trim()) return "Full name is required";
    if (!guestPhone.trim()) return "Phone number is required";
    if (!guestEmail.trim()) return "Email address is required";
    return null;
  };

  /* ---------------- ADDONS TOTAL ---------------- */
  const addonsTotal = useMemo(() => {
    let total = 0;
    if (childSeat) total += ADDONS.childSeat.price;
    if (babySeat) total += ADDONS.babySeat.price;
    if (gps) total += ADDONS.gps.price;
    if (additionalDriver) total += ADDONS.additionalDriver.price;
    return total;
  }, [childSeat, babySeat, gps, additionalDriver]);

  const baseAmount = calc?.totalAmount ?? 0;
  const deliveryFee = calc?.deliveryCharges ?? 0;

  const frontendTotal = baseAmount + deliveryFee + addonsTotal;

  const frontendPayNow = calc
    ? Math.round((frontendTotal * calc.prepaymentPercent) / 100)
    : 0;

  const frontendPayLater = frontendTotal - frontendPayNow;

  /* ---------------- ACTIONS ---------------- */
  const handleCalculate = async () => {
    const err = validateForm();
    if (err) return toast.error(err);

    try {
      const res = await calculateBooking({
        carId,
        pickupDate,
        pickupTime,
        dropoffDate,
        dropoffTime,
        priceType,
        deliveryRequired,
        address: deliveryRequired ? address : undefined,
      }).unwrap();

      setCalc(res?.data ?? null);
      setCanPay(true);
      toast.success("Price calculated");
    } catch (error: unknown) {
      const e = error as ApiError;
      toast.error(e?.data?.message || "Calculation failed");
    }
  };

  const handleCreateBooking = async () => {
    const err = validateForm();
    if (err) return toast.error(err);
    if (!calc) return toast.error("Please calculate price first");

    try {
      const res = await createBooking({
        carId,
        pickupDate,
        pickupTime,
        dropoffDate,
        dropoffTime,
        priceType,
        deliveryRequired,
        address: deliveryRequired ? address : undefined,
        guestName,
        guestPhone,
        guestEmail,
        totalAmount: frontendTotal,
        prepaymentPercent: calc.prepaymentPercent,
        prepaymentAmount: frontendPayNow,
        remainingAmount: frontendPayLater,
      }).unwrap();

      const bookingId = res?.data?._id;
      if (!bookingId) return toast.error("Booking created but ID missing");

      const paymentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payments/rental/${bookingId}?token=${res.data.paymentToken}`;
      window.location.href = paymentUrl;
    } catch (error: unknown) {
      const e = error as ApiError;
      toast.error(e?.data?.message || "Booking failed");
    }
  };

  useEffect(() => {
    setCalc(null);
    setCanPay(false);
  }, [
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime,
    priceType,
    deliveryRequired,
    address,
  ]);

  // Premium UI tokens
  const card = "bg-white rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.05)]";
  const sectionTitle = "font-semibold text-dark-base mb-4";
  const inputBase =
    "w-full rounded-xl bg-soft-grey/30 p-3 text-sm outline-none transition focus:bg-white focus:shadow-sm";
  const fieldLabel = "text-xs font-medium text-grey mb-1 block";

  const addonMap: Record<
    AddonKey,
    [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  > = {
    childSeat: [childSeat, setChildSeat],
    babySeat: [babySeat, setBabySeat],
    gps: [gps, setGps],
    additionalDriver: [additionalDriver, setAdditionalDriver],
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-1 text-dark-base">
          Complete your booking
        </h1>
        <p className="text-sm text-grey mb-6">
          Select dates, add-ons & details — pay partially now.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Rental plan */}
            <div className={card}>
              <p className={sectionTitle}>Rental Plan</p>

              <div className="grid grid-cols-3 bg-soft-grey/30 p-1.5 rounded-2xl">
                {(["daily", "weekly", "monthly"] as PriceType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setPriceType(t)}
                    className={`py-2.5 rounded-xl font-semibold capitalize text-sm transition ${
                      priceType === t
                        ? "bg-white shadow-sm text-site-accent"
                        : "text-dark-base/60 hover:text-dark-base"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Pickup / Delivery */}
            <div className={card}>
              <p className={sectionTitle}>Pickup Method</p>

              <div className="grid grid-cols-2 gap-4">
                {/* Pickup */}
                <button
                  type="button"
                  onClick={() => setDeliveryRequired(false)}
                  className={`relative rounded-2xl p-4 text-left transition ${
                    !deliveryRequired
                      ? "bg-site-accent/5"
                      : "bg-soft-grey/30 hover:bg-soft-grey/45"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
                        !deliveryRequired
                          ? "bg-site-accent text-white"
                          : "bg-white text-dark-base shadow-sm"
                      }`}
                    >
                      <Store size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-dark-base">
                        Pickup
                      </p>
                      <p className="text-xs text-grey">
                        Collect from vendor location
                      </p>
                    </div>
                  </div>

                  {!deliveryRequired && (
                    <div className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-site-accent" />
                  )}
                </button>

                {/* Delivery */}
                <button
                  type="button"
                  onClick={() => setDeliveryRequired(true)}
                  className={`relative rounded-2xl p-4 text-left transition ${
                    deliveryRequired
                      ? "bg-site-accent/5"
                      : "bg-soft-grey/30 hover:bg-soft-grey/45"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
                        deliveryRequired
                          ? "bg-site-accent text-white"
                          : "bg-white text-dark-base shadow-sm"
                      }`}
                    >
                      <Truck size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-dark-base">
                        Delivery
                      </p>
                      <p className="text-xs text-grey">
                        Delivered to your address
                      </p>
                    </div>
                  </div>

                  {deliveryRequired && (
                    <div className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-site-accent" />
                  )}
                </button>
              </div>

              {deliveryRequired && (
                <div className="mt-4">
                  <label className={fieldLabel}>Delivery Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Building, street, area, city"
                    rows={3}
                    className={inputBase}
                  />
                </div>
              )}
            </div>

            {/* Dates & Time */}
            <div className={card}>
              <p className={sectionTitle}>Dates & Time</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={fieldLabel}>Pickup Date</label>
                  <input
                    type="date"
                    min={today}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className={inputBase}
                  />
                </div>

                <div>
                  <label className={fieldLabel}>Pickup Time</label>
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className={inputBase}
                  />
                </div>

                <div>
                  <label className={fieldLabel}>Dropoff Date</label>
                  <input
                    type="date"
                    min={pickupDate || today}
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                    className={inputBase}
                  />
                </div>

                <div>
                  <label className={fieldLabel}>Dropoff Time</label>
                  <input
                    type="time"
                    value={dropoffTime}
                    onChange={(e) => setDropoffTime(e.target.value)}
                    className={inputBase}
                  />
                </div>
              </div>
            </div>

            {/* Add-ons */}
            <div className={card}>
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-dark-base">Add-ons</p>
                <p className="text-xs text-grey">
                  {addonsTotal > 0
                    ? `AED ${formatMoney(addonsTotal)}`
                    : "Optional"}
                </p>
              </div>

              <div className="space-y-2">
                {Object.entries(ADDONS).map(([key, item]) => {
                  type AddonKey = keyof typeof ADDONS;

                  const map: Record<
                    AddonKey,
                    [boolean, React.Dispatch<React.SetStateAction<boolean>>]
                  > = {
                    childSeat: [childSeat, setChildSeat],
                    babySeat: [babySeat, setBabySeat],
                    gps: [gps, setGps],
                    additionalDriver: [additionalDriver, setAdditionalDriver],
                  };

                  const [checked, setter] = map[key];

                  return (
                    <label
                      key={key}
                      className={`flex justify-between items-center rounded-2xl p-4 transition cursor-pointer ${
                        checked
                          ? "bg-site-accent/5"
                          : "bg-soft-grey/30 hover:bg-soft-grey/45"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-sm text-dark-base">
                          {item.label}
                        </p>
                        <p className="text-xs text-grey">AED {item.price}</p>
                      </div>

                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => setter(e.target.checked)}
                        className="h-5 w-5 accent-[var(--site-accent)]"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Your details */}
            <div className={card}>
              <p className={sectionTitle}>Your Details</p>

              <div className="space-y-3">
                <div>
                  <label className={fieldLabel}>Full Name</label>
                  <input
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter your full name"
                    className={inputBase}
                  />
                </div>

                <div>
                  <label className={fieldLabel}>Mobile Number</label>

                  <div className="flex items-center rounded-xl bg-soft-grey/30 p-3 focus-within:bg-white focus-within:shadow-sm">
                    <span className="text-sm font-semibold text-dark-base mr-2">
                      +971
                    </span>

                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => {
                        const val = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 9);
                        setGuestPhone(val);
                      }}
                      placeholder="50XXXXXXX"
                      className="flex-1 bg-transparent outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className={fieldLabel}>Email Address</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className={inputBase}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {/* ACTION BUTTONS */}
              <div className="flex gap-3">
                {/* CONTINUE */}
                {!canPay && (
                  <button
                    onClick={handleCalculate}
                    disabled={calcLoading}
                    className="flex-1 rounded-2xl py-3 font-semibold text-site-accent bg-site-accent/10 hover:bg-site-accent/15 transition disabled:opacity-60"
                  >
                    {calcLoading ? "Calculating..." : "Continue"}
                  </button>
                )}

                {/* PAY NOW */}
                <button
                  onClick={handleCreateBooking}
                  disabled={!canPay || createLoading}
                  className={`flex-1 rounded-2xl py-3 font-semibold text-white transition
        ${
          canPay
            ? "bg-gradient-to-r from-site-accent to-slate-teal shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
            : "bg-gray-300 cursor-not-allowed"
        }
      `}
                >
                  {createLoading ? "Redirecting..." : "Pay Now"}
                </button>
              </div>

              {/* BACK TO CAR */}
              <button
                onClick={() => router.push(`/car/${carId}`)}
                className="
    mx-auto flex items-center gap-2
    rounded-2xl px-6 py-2.5
    text-sm font-semibold
    text-dark-base
    bg-soft-grey/40
    hover:bg-soft-grey/60 hover:text-site-accent
    transition
  "
              >
                ← Back to car
              </button>
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          {/* RIGHT SUMMARY */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
              <p className="font-bold mb-4 text-dark-base">Booking Summary</p>

              <div className="space-y-4 text-sm">
                {/* Vehicle */}
                <div className="flex justify-between">
                  <span className="text-grey">Vehicle</span>
                  <span className="font-semibold text-dark-base">
                    Selected Car
                  </span>
                </div>

                {/* Pickup / Dropoff */}
                <div className="rounded-xl bg-soft-grey/30 p-3">
                  <p className="text-xs text-grey mb-1">Pickup</p>
                  <p className="font-semibold text-dark-base">
                    {pickupDate || "—"} • {pickupTime}
                  </p>

                  <p className="text-xs text-grey mt-3 mb-1">Dropoff</p>
                  <p className="font-semibold text-dark-base">
                    {dropoffDate || "—"} • {dropoffTime}
                  </p>
                </div>

                {/* Rental Plan */}
                {calc && (
                  <div className="flex justify-between">
                    <span className="text-grey">Rental Plan</span>
                    <span className="font-semibold capitalize">
                      {priceType}
                    </span>
                  </div>
                )}

                {/* Method */}
                <div className="flex justify-between">
                  <span className="text-grey">Method</span>
                  <span className="font-semibold">
                    {deliveryRequired ? "Delivery" : "Pickup"}
                  </span>
                </div>

                {deliveryRequired && address && (
                  <div className="text-xs text-grey bg-soft-grey/30 rounded-xl p-2">
                    {address}
                  </div>
                )}

                {/* Pricing */}
                <div className="pt-3 border-t border-soft-grey/40 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-grey">Base Rental</span>
                    <span className="font-semibold">
                      AED {formatMoney(calc?.totalAmount || 0)}
                    </span>
                  </div>
                  {(calc?.deliveryCharges ?? 0) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-grey">Delivery Fee</span>
                      <span className="font-semibold">
                        AED {formatMoney(calc?.deliveryCharges ?? 0)}
                      </span>
                    </div>
                  )}

                  {addonsTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-grey">Add-ons</span>
                      <span className="font-semibold">
                        AED {formatMoney(addonsTotal)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-soft-grey/60 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>AED {formatMoney(frontendTotal)}</span>
                </div>

                {/* Pay Now */}
                <div className="flex justify-between text-site-accent font-bold">
                  <span>Pay Now ({calc?.prepaymentPercent || 0}%)</span>
                  <span>AED {formatMoney(frontendPayNow)}</span>
                </div>

                {/* Pay Later */}
                <div className="flex justify-between text-xs">
                  <span className="text-grey">Pay Later</span>
                  <span className="font-semibold">
                    AED {formatMoney(frontendPayLater)}
                  </span>
                </div>

                {/* Info */}
                <div className="flex gap-2 text-xs text-grey pt-3">
                  <CheckCircle2 className="text-site-accent w-4 h-4 mt-0.5" />
                  <p>
                    You’ll pay only the partial amount now. Remaining will be
                    handled after vendor approval.
                  </p>
                </div>
              </div>

              {!calc && (
                <p className="text-xs text-grey text-center mt-4">
                  Calculate price to see full summary
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
