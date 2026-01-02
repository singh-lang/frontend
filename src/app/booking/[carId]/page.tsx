"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Truck, Store } from "lucide-react";
import DatePicker from "react-datepicker";
import { toast } from "sonner";
import { DateInput } from "@/components/ui/datePicker";

import {
  useCalculateBookingMutation,
  useCreateBookingMutation,
} from "@/lib/api/booking";
import { useCalculatePickupReturnMutation } from "@/lib/api/pickupReturnApi";
import { useGetCarByIdQuery } from "@/lib/api/car";

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
  const [selected, setSelected] = useState<"delivery" | "pickup">("pickup");

  /* ---------------- FORM STATE ---------------- */
  const [priceType, setPriceType] = useState<PriceType>("daily");
  const [canPay, setCanPay] = useState(false);
  const [addonsOpen, setAddonsOpen] = useState(false);

  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffDate, setDropoffDate] = useState("");
  const [dropoffTime, setDropoffTime] = useState("10:00");
  const [deliveryRequired, setDeliveryRequired] = useState(false);
  const [selectedOption, setSelectedOption] = useState("delivery");
  const [paused, setPaused] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [address, setAddress] = useState("");

  // NEW – Pickup / Return (Yango style)
  const [pickupType, setPickupType] = useState<"PICKUP" | "DELIVERY">("PICKUP");

  const [returnType, setReturnType] = useState<"DROPOFF" | "RETURN">("DROPOFF");

  const [emirateId, setEmirateId] = useState<string>("");

  const [pickupReturnCharges, setPickupReturnCharges] = useState({
    pickup: 0,
    return: 0,
  });

  /* ---------------- ADDONS ---------------- */
  const [childSeat, setChildSeat] = useState(false);
  const [babySeat, setBabySeat] = useState(false);
  const [gps, setGps] = useState(false);
  const [additionalDriver, setAdditionalDriver] = useState(false);

  /* ---------------- BACKEND ---------------- */
  const [calc, setCalc] = useState<BookingCalculation | null>(null);
  const [calculatePickupReturn] = useCalculatePickupReturnMutation();

  const [calculateBooking, { isLoading: calcLoading }] =
    useCalculateBookingMutation();
  const [createBooking, { isLoading: createLoading }] =
    useCreateBookingMutation();

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const formatMoney = (n: number) =>
    Number.isFinite(n) ? Math.round(n).toLocaleString() : "0";

  const hhmmValid = (t: string) => /^\d{2}:\d{2}$/.test(t);
  const loadPickupReturnCharges = async () => {
    if (!carId || !emirateId) return;

    try {
      const res = await calculatePickupReturn({
        carId,
        emirateId,
        pickupType,
        returnType,
      }).unwrap();

      setPickupReturnCharges({
        pickup: res.pickupCharge || 0,
        return: res.returnCharge || 0,
      });
    } catch (err) {
      console.error("Pickup/Return pricing failed", err);
    }
  };
  const validateForm = (): string | null => {
    if (!pickupDate) return "Pickup date is required";
    if (!dropoffDate) return "Dropoff date is required";
    if (!pickupTime || !hhmmValid(pickupTime))
      return "Pickup time must be HH:mm";
    if (!dropoffTime || !hhmmValid(dropoffTime))
      return "Dropoff time must be HH:mm";

    if (pickupType === "DELIVERY" && !address.trim())
      return "Delivery address is required";

    if ((pickupType === "DELIVERY" || returnType === "RETURN") && !emirateId)
      return "Please select emirate for delivery/return pricing";

    if (!guestName.trim()) return "Full name is required";
    if (!guestPhone.trim()) return "Phone number is required";
    if (!guestEmail.trim()) return "Email address is required";

    return null;
  };
  const addonsTotal = useMemo(() => {
    let total = 0;
    if (childSeat) total += ADDONS.childSeat.price;
    if (babySeat) total += ADDONS.babySeat.price;
    if (gps) total += ADDONS.gps.price;
    if (additionalDriver) total += ADDONS.additionalDriver.price;
    return total;
  }, [childSeat, babySeat, gps, additionalDriver]);

  const rentalAmount = calc?.totalAmount ?? 0;
  const pickupFee = pickupReturnCharges.pickup;
  const returnFee = pickupReturnCharges.return;

  const frontendTotal = rentalAmount + pickupFee + returnFee + addonsTotal;

  const frontendPayNow = calc
    ? Math.round((rentalAmount * calc.prepaymentPercent) / 100)
    : 0;

  const frontendPayLater = frontendTotal - frontendPayNow;

  useEffect(() => {
    loadPickupReturnCharges();
  }, [pickupType, returnType, emirateId, carId]);
  /* ---------------- ACTIONS ---------------- */
  const handleCalculate = async () => {
    const err = validateForm();
    if (err) return toast.error(err);

    try {
      const pricing = await calculatePickupReturn({
        carId,
        emirateId,
        pickupType,
        returnType,
      }).unwrap();

      setPickupReturnCharges({
        pickup: pricing.pickupCharge || 0,
        return: pricing.returnCharge || 0,
      });
      const res = await calculateBooking({
        carId,
        pickupDate,
        pickupTime,
        dropoffDate,
        dropoffTime,
        priceType,
        deliveryRequired: pickupType === "DELIVERY" || returnType === "RETURN",
        address: pickupType === "DELIVERY" ? address : undefined,
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
        pickupType,
        returnType,
        emirateId,
        deliveryRequired: pickupType === "DELIVERY" || returnType === "RETURN",
        address: pickupType === "DELIVERY" ? address : undefined,
        guestName,
        guestPhone,
        guestEmail,
        totalAmount: calc.totalAmount,
        prepaymentPercent: calc.prepaymentPercent,
        prepaymentAmount: frontendPayNow,
        remainingAmount: frontendPayLater,
      }).unwrap(); // ✅ REQUIRED

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
    setPickupReturnCharges({ pickup: 0, return: 0 }); // ✅ ADD THIS
  }, [pickupDate, pickupTime, dropoffDate, dropoffTime, priceType, address]);

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
  const { data: car, isLoading: carLoading } = useGetCarByIdQuery(carId, {
    skip: !carId,
  });

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const carImages = useMemo(() => {
    if (!car?.car) return [];

    const images: string[] = [];
    if (car.car.coverImage?.url) {
      images.push(
        car.car.coverImage.url.startsWith("http")
          ? car.car.coverImage.url
          : `${BASE_URL}${car.car.coverImage.url}`
      );
    }

    if (Array.isArray(car.car.images)) {
      car.car.images.forEach((img) => {
        if (img?.url) {
          images.push(
            img.url.startsWith("http") ? img.url : `${BASE_URL}${img.url}`
          );
        }
      });
    }

    return images;
  }, [car]);
  useEffect(() => {
    if (paused || carImages.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === carImages.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [paused, carImages.length]);

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
          <div className="space-y-6">
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
            <div className={card}>
              <p className={sectionTitle}>Pickup</p>
              <div className="relative flex bg-soft-grey/30 rounded-2xl p-1 mb-5">
                {/* SLIDER */}
                <div
                  className={`absolute top-1 left-1 h-[calc(100%-0.5rem)] w-1/2 rounded-xl 
                bg-white shadow-sm transition-transform duration-300
                ${pickupType === "DELIVERY" ? "translate-x-full" : ""}
              `}
                />
                <button
                  type="button"
                  onClick={() => setPickupType("PICKUP")}
                  className="relative z-10 flex-1 flex items-center gap-3 px-4 py-3 rounded-xl text-left"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition
                  ${
                    pickupType === "PICKUP"
                      ? "bg-site-accent text-white"
                      : "bg-soft-grey/40 text-dark-base"
                  }
                `}
                  >
                    <Store size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Pickup from vendor</p>
                    <p className="text-xs text-grey">Free</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPickupType("DELIVERY")}
                  className="relative z-10 flex-1 flex items-center gap-3 px-4 py-3 rounded-xl text-left"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition
        ${
          pickupType === "DELIVERY"
            ? "bg-site-accent text-white"
            : "bg-soft-grey/40 text-dark-base"
        }
      `}
                  >
                    <Truck size={18} />
                  </div>

                  <div>
                    <p className="font-semibold text-sm">Delivery to address</p>
                    <p className="text-xs text-grey">Paid (by emirate)</p>
                  </div>
                </button>
              </div>

              {pickupType === "DELIVERY" && (
                <div>
                  <select
                    className={inputBase}
                    value={emirateId}
                    onChange={(e) => setEmirateId(e.target.value)}
                  >
                    <option value="">Select Emirate</option>

                    <option value="6953ce30ad7fb6b0b43ee72c">Dubai</option>
                    <option value="6953ce30ad7fb6b0b43ee729">Abu Dhabi</option>
                    <option value="6953ce31ad7fb6b0b43ee72f">Sharjah</option>
                    <option value="6953ce31ad7fb6b0b43ee732">Ajman</option>
                    <option value="6953ce32ad7fb6b0b43ee735">
                      Umm Al Quwain
                    </option>
                    <option value="6953ce32ad7fb6b0b43ee738">
                      Ras Al Khaimah
                    </option>
                    <option value="6953ce33ad7fb6b0b43ee73b">Fujairah</option>
                  </select>
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
                </div>
              )}
            </div>

            {pickupType === "PICKUP" && (
              <div className={card}>
                <p className={sectionTitle}>Return</p>

                <div className="grid grid-cols-2 gap-4">
                  {/* DROPOFF – FREE */}
                  <button
                    type="button"
                    onClick={() => setReturnType("DROPOFF")}
                    className={`relative rounded-2xl p-4 text-left transition ${
                      returnType === "DROPOFF"
                        ? "bg-site-accent/5"
                        : "bg-soft-grey/30 hover:bg-soft-grey/45"
                    }`}
                  >
                    <p className="font-semibold text-sm text-dark-base">
                      Dropoff to vendor
                    </p>
                    <p className="text-xs text-grey">Free</p>

                    {returnType === "DROPOFF" && (
                      <div className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-site-accent" />
                    )}
                  </button>

                  {/* RETURN – PAID */}
                  <button
                    type="button"
                    onClick={() => setReturnType("RETURN")}
                    className={`relative rounded-2xl p-4 text-left transition ${
                      returnType === "RETURN"
                        ? "bg-site-accent/5"
                        : "bg-soft-grey/30 hover:bg-soft-grey/45"
                    }`}
                  >
                    <p className="font-semibold text-sm text-dark-base">
                      Vendor collects car
                    </p>
                    <p className="text-xs text-grey">Paid (by emirate)</p>

                    {returnType === "RETURN" && (
                      <div className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-site-accent" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className={card}>
              <p className={sectionTitle}>Dates & Time</p>

              <div className="grid grid-cols-2 gap-3">
                {/* Pickup Date */}
                <div>
                  <label className={fieldLabel}>Pickup Date</label>
                  <div>
                    <DatePicker
                      selected={pickupDate ? new Date(pickupDate) : null}
                      onChange={(date: Date | null) =>
                        setPickupDate(
                          date ? date.toISOString().split("T")[0] : ""
                        )
                      }
                      minDate={new Date()}
                      placeholderText="dd-mm-yyyy"
                      customInput={<DateInput />}
                    />
                  </div>
                </div>

                {/* Pickup Time (unchanged) */}
                <div>
                  <label className={fieldLabel}>Pickup Time</label>
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className={inputBase}
                  />
                </div>

                {/* Dropoff Date */}
                <div>
                  <label className={fieldLabel}>Dropoff Date</label>
                  <DatePicker
                    selected={dropoffDate ? new Date(dropoffDate) : null}
                    onChange={(date: Date | null) =>
                      setDropoffDate(
                        date ? date.toISOString().split("T")[0] : ""
                      )
                    }
                    minDate={pickupDate ? new Date(pickupDate) : new Date()}
                    placeholderText="dd-mm-yyyy"
                    customInput={<DateInput />}
                  />
                </div>

                {/* Dropoff Time (unchanged) */}
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
                <div>
                  <p className="font-semibold text-dark-base">Add-ons</p>
                  <p className="text-xs text-grey">
                    {addonsTotal > 0
                      ? `AED ${formatMoney(addonsTotal)}`
                      : "Optional"}
                  </p>
                </div>

                {/* TOGGLE SWITCH */}
                <button
                  type="button"
                  onClick={() => setAddonsOpen((prev) => !prev)}
                  className={`
                    relative w-11 h-6 rounded-full transition-colors
                    ${addonsOpen ? "bg-site-accent" : "bg-gray-300"}
                  `}
                >
                  <span
                    className={`
                      absolute top-0.5 left-0.5
                      h-5 w-5 rounded-full bg-white shadow-sm
                      transition-transform
                      ${addonsOpen ? "translate-x-5" : ""}
                    `}
                  />
                </button>
              </div>

              {/* BODY */}
              {addonsOpen && (
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

                    const [checked, setter] = map[key as AddonKey];

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

                        {/* CHECKBOX (UNCHANGED) */}
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
              )}
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
              </div>
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
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
              <p className="font-bold mb-4 text-dark-base">Booking Summary</p>

              <div className="space-y-4 text-sm">
                {carImages.length > 0 && (
                  <div
                    className="relative w-full overflow-hidden rounded-2xl"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                  >
                    {/* IMAGE TRACK */}
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${activeIndex * 100}%)`,
                      }}
                    >
                      {carImages.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Car image ${index + 1}`}
                          className="w-full h-45 object-cover flex-shrink-0"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="max-w-xl">
                  {/* Title */}
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Pickup & return location
                  </h2>
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Bring the car to me
                    </p>

                    <div
                      onClick={() => setSelectedOption("delivery")}
                      className={`flex items-center justify-between rounded-xl px-4 py-4 cursor-pointer
                    ${
                      selectedOption === "delivery"
                        ? "bg-blue-50 border border-blue-500"
                        : "bg-gray-100"
                    }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* CHECKBOX / RADIO */}
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center
                        ${
                          selectedOption === "delivery"
                            ? "border-blue-600"
                            : "border-gray-300"
                        }`}
                        >
                          {selectedOption === "delivery" && (
                            <div className="w-3 h-3 rounded-full bg-blue-600" />
                          )}
                        </div>

                        <div>
                          <p className="font-medium text-gray-900">
                            Select delivery address
                          </p>
                          <p className="text-sm text-blue-600 cursor-pointer">
                            Delivery policy
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ================= Free pickup locations ================= */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Free pickup locations
                    </p>

                    <div
                      onClick={() => setSelectedOption("pickup")}
                      className={`flex items-start justify-between rounded-xl px-4 py-4 cursor-pointer
            ${
              selectedOption === "pickup"
                ? "bg-blue-50 border border-blue-500"
                : "bg-gray-100"
            }`}
                    >
                      <div className="flex gap-3">
                        {/* CHECKBOX / RADIO */}
                        <div
                          className={`w-5 h-5 mt-1 rounded-full border flex items-center justify-center
                ${
                  selectedOption === "pickup"
                    ? "border-blue-600"
                    : "border-gray-300"
                }`}
                        >
                          {selectedOption === "pickup" && (
                            <div className="w-3 h-3 rounded-full bg-blue-600" />
                          )}
                        </div>

                        <div>
                          <p className="font-medium text-gray-900 leading-snug">
                            Pickup from location.
                          </p>
                          <div className="text-sm text-blue-600 cursor-pointer mt-1">
                            Pickup Instruction
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 max-w-xl">
                  {/* TAKE THE CAR FROM ME */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Take the car from me
                    </p>

                    <div
                      onClick={() => setSelected("delivery")}
                      className={`flex items-center gap-4 rounded-2xl px-5 py-4 cursor-pointer transition
            ${
              selected === "delivery"
                ? "bg-blue-50 border border-blue-500"
                : "bg-gray-100"
            }`}
                    >
                      {/* RADIO */}
                      <div
                        className={`h-5 w-5 rounded-full border flex items-center justify-center
              ${
                selected === "delivery" ? "border-blue-600" : "border-gray-300"
              }`}
                      >
                        {selected === "delivery" && (
                          <div className="h-3 w-3 rounded-full bg-blue-600" />
                        )}
                      </div>

                      {/* TEXT */}
                      <div>
                        <p className="font-medium text-gray-900">
                          Select return delivery address
                        </p>
                        <p className="text-sm text-blue-600 cursor-pointer">
                          Return policy
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* FREE DROPOFF LOCATIONS */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Free dropoff locations
                    </p>

                    <div
                      onClick={() => setSelected("pickup")}
                      className={`flex justify-between gap-4 rounded-2xl px-5 py-4 cursor-pointer transition
            ${
              selected === "pickup"
                ? "bg-blue-50 border border-blue-500"
                : "bg-gray-100"
            }`}
                    >
                      <div className="flex gap-4">
                        {/* RADIO */}
                        <div
                          className={`mt-1 h-5 w-5 rounded-full border flex items-center justify-center
                ${
                  selected === "pickup" ? "border-blue-600" : "border-gray-300"
                }`}
                        >
                          {selected === "pickup" && (
                            <div className="h-3 w-3 rounded-full bg-blue-600" />
                          )}
                        </div>

                        {/* ADDRESS */}
                        <div>
                          <p className="font-medium text-gray-900 leading-snug">
                            select return drop-off location
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            <span className="text-blue-600 cursor-pointer">
                              Drop-off instructions
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
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
                <button
                  onClick={handleCreateBooking}
                  disabled={!canPay || createLoading}
                  className={`w-[380px] rounded-2xl py-3 font-semibold text-white transition
        ${
          canPay
            ? "bg-gradient-to-r from-site-accent to-slate-teal shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
            : "bg-gray-300 cursor-not-allowed"
        }
      `}
                >
                  {createLoading ? "Redirecting..." : "Pay Now"}
                </button>
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
