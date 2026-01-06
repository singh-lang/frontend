"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Truck, Store } from "lucide-react";
import { toast } from "sonner";
import DatePicker from "react-datepicker";
import {DateInput} from "@/components/ui/datePicker";
import {
  useCalculateBookingMutation,
  useCreateBookingMutation,
} from "@/lib/api/booking";
import ImportantInfo from "@/app/booking/[carId]/info";
import { useCalculatePickupReturnMutation } from "@/lib/api/pickupReturnApi";
import CatalogHeader from "@/components/catalogue/CatalogHeader";
import { getCar } from "@/lib/api/car";
import { type CarTypes } from "@/types/homePageTypes";
import Image from "next/image";

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
interface CarFetchProp {
  _id: string;
  data: CarTypes;
}

  
const ADDONS = {
  childSeat: { label: "Child Seat", price: 50 },
  babySeat: { label: "Baby Seat", price: 50 },
  gps: { label: "GPS Navigation", price: 30 },
  additionalDriver: { label: "Additional Driver", price: 100 },
};

const DEPOSIT_AMOUNT = 2000;
const DEPOSIT_FREE_FEE = 210;

type AddonKey = keyof typeof ADDONS;

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
 
  const carId = (params?.carId as string) || "";

  const [showDeliveryPolicy, setShowDeliveryPolicy] = useState<boolean>(false);
  const [priceType, setPriceType] = useState<PriceType>("daily");
  const [canPay, setCanPay] = useState(false);
  const [addonsOpen, setAddonsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("delivery");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffDate, setDropoffDate] = useState("");
  const [dropoffTime, setDropoffTime] = useState("10:00");
const [carLoading, setCarLoading] = useState(true);

  const [guestEmail, setGuestEmail] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
const [carData, setCarData] = useState<CarTypes | null>(null);

  const [address, setAddress] = useState("");
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const [pickupType, setPickupType] = useState<"PICKUP" | "DELIVERY">("PICKUP");

  const [returnType, setReturnType] = useState<"DROPOFF" | "RETURN">("DROPOFF");

  const [emirateId, setEmirateId] = useState<string>("");

  const [pickupReturnCharges, setPickupReturnCharges] = useState({
    pickup: 0,
    return: 0,
  });
  const [childSeat, setChildSeat] = useState(false);
  const [babySeat, setBabySeat] = useState(false);
  const [gps, setGps] = useState(false);
  const [additionalDriver, setAdditionalDriver] = useState(false);
const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
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
  const [depositFree, setDepositFree] = useState(false);
  const frontendTotal = rentalAmount + pickupFee + returnFee + addonsTotal;

  const frontendPayNow = calc
    ? Math.round((rentalAmount * calc.prepaymentPercent) / 100)
    : 0;

  const frontendPayLater = frontendTotal - frontendPayNow;

  useEffect(() => {
    loadPickupReturnCharges();
  }, [pickupType, returnType, emirateId]);
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
        isGuest: true, // ✅ ADD THIS

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
 // REQUIRED

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
              <p className={sectionTitle}>Dates & Time</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={fieldLabel}>Pickup Date</label>
                   <DatePicker
                  selected={pickupDate ? new Date(pickupDate) : null}
                  onChange={(date: Date | null) =>
                    setPickupDate(date ? date.toISOString().split("T")[0] : "")
                  }
                  minDate={new Date()}
                  placeholderText="dd-mm-yyyy"
                  dateFormat="dd-MM-yyyy"
                  customInput={<DateInput />}
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
                 <DatePicker
                    selected={dropoffDate ? new Date(dropoffDate) : null}
                    onChange={(date: Date | null) =>
                      setDropoffDate(date ? date.toISOString().split("T")[0] : "")
                    }
                    minDate={pickupDate ? new Date(pickupDate) : new Date()}
                    placeholderText="dd-mm-yyyy"
                    dateFormat="dd-MM-yyyy"
                      customInput={<DateInput />}
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

          <div className={card}>
  {/* TOP ROW */}
  <div className="flex items-center justify-between mb-2">
    {/* LEFT */}
    <p className="font-semibold text-dark-base">Pickup</p>

    {/* RIGHT OPTION */}
    <div className="flex items-center gap-2">
     

      <p
        className="px-3 py-1.5 rounded-lg text-dark-base  text-base font-semibold cursor-pointer underline"
        onClick={(e) => {
          e.stopPropagation();
          setShowDeliveryPolicy(true);
        }}
      >
        Pickup Delivery Policy
      </p>
    </div>
  </div>
{showDeliveryPolicy && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center">
    <div className="bg-white w-full h-[400px] sm:max-w-lg rounded p-6 flex flex-col">

      {/* CONTENT */}
      <div className="flex-1">
        <p className="text-base text-center font-medium">
          Pickup & Delivery Policy
        </p>
      </div>

      {/* CLOSE BUTTON */}
      <button
        onClick={() => setShowDeliveryPolicy(false)}
        className="mt-4 w-full rounded-2xl
                   bg-gradient-to-r from-site-accent to-slate-teal
                   shadow-[0_12px_28px_rgba(0,0,0,0.12)]
                   py-3 font-medium text-white"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              <div className="relative flex bg-soft-grey/30 rounded-2xl p-1 mb-5">
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
              {(pickupType === "DELIVERY" || returnType === "RETURN") && (
                <div>
                  <p className={sectionTitle}>Emirate</p>

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
                </div>
              )}
              {pickupType === "DELIVERY" && (
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
              <p className={sectionTitle}>Return</p>

<div className="relative flex bg-soft-grey/30 rounded-2xl p-1 mb-5">
  {/* SLIDER */}
  <div
    className={`absolute top-1 left-1 h-[calc(100%-0.5rem)] w-1/2 rounded-xl 
      bg-white shadow-sm transition-transform duration-300
      ${returnType === "RETURN" ? "translate-x-full" : ""}
    `}
  />

  {/* DROPOFF */}
  <button
    type="button"
    onClick={() => setReturnType("DROPOFF")}
    className="relative z-10 flex-1 flex items-center gap-3 px-4 py-3 rounded-xl text-left pl-5"
  >
    <div>
      <p className="font-semibold text-sm text-dark-base">
        Dropoff to vendor
      </p>
      <p className="text-xs text-grey">Free</p>
    </div>
  </button>

  {/* RETURN */}
  <button
    type="button"
    onClick={() => setReturnType("RETURN")}
    className="relative z-10 flex-1 flex items-center gap-3 px-4 py-3 rounded-xl text-left pl-5"
  >
    <div>
      <p className="font-semibold text-sm text-dark-base">
        Vendor collects car
      </p>
      <p className="text-xs text-grey">Paid (by emirate)</p>
    </div>
    {returnType === "RETURN" && ( <div className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-site-accent" /> )}
  </button>
</div>
  </div>
          
            <div className={card}>
  <div className="flex items-center justify-between mb-4">
    <div>
      <p className="font-semibold text-dark-base">Important Info</p>
      <p className="text-xs text-grey">Optional</p>
      </div>

                <button
                  type="button"
                  onClick={() => setInfoOpen((prev) => !prev)}
                  className={`
        relative w-11 h-6 rounded-full transition-colors
        ${infoOpen ? "bg-site-accent" : "bg-gray-300"}
      `}
                >
                  <span
                    className={`
          absolute top-0.5 left-0.5
          h-5 w-5 rounded-full bg-white shadow-sm
          transition-transform
          ${infoOpen ? "translate-x-5" : ""}
        `}
                  />
                </button>
              </div>

  {infoOpen && (
    <div className="mt-4 animate-in fade-in slide-in-from-top-2">
      <ImportantInfo />
    </div>
  )}
</div>
         
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

            <div className="space-y-4">
              <div className="flex gap-3">
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

          {/* RIGHT SUMMARY */}
          {/* RIGHT SUMMARY */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
              <p className="font-bold mb-4 text-dark-base">Booking Summary</p>

              <div className="space-y-4 text-sm">
             
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
                {calc && (
                  <div className="flex justify-between">
                    <span className="text-grey">Rental Plan</span>
                    <span className="font-semibold capitalize">
                      {priceType}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-grey">Method</span>
                  <span className="font-semibold">
                    {pickupType === "DELIVERY" && returnType === "RETURN"
                      ? "Delivery + Return"
                      : pickupType === "DELIVERY"
                      ? "Delivery"
                      : returnType === "RETURN"
                      ? "Pickup + Return"
                      : "Pickup"}
                  </span>
                </div>

                {pickupType === "DELIVERY" && address && (
                  <div className="text-xs text-grey bg-soft-grey/30 rounded-xl p-2">
                    {address}
                  </div>
                )}
                <div className="pt-3 border-t border-soft-grey/40 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-grey">Base Rental</span>
                    <span className="font-semibold">
                      AED {formatMoney(calc?.totalAmount || 0)}
                    </span>
                  </div>
                  {pickupReturnCharges.pickup > 0 && (
                    <div className="flex justify-between">
                      <span className="text-grey">Pickup charge</span>
                      <span className="font-semibold">
                        AED {formatMoney(pickupReturnCharges.pickup)}
                      </span>
                    </div>
                  )}

                  {pickupReturnCharges.return > 0 && (
                    <div className="flex justify-between">
                      <span className="text-grey">Return charge</span>
                      <span className="font-semibold">
                        AED {formatMoney(pickupReturnCharges.return)}
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
                <div className="pt-3 border-t border-soft-grey/60 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>AED {formatMoney(frontendTotal)}</span>
                </div>
                <div className="flex justify-between text-site-accent font-bold">
                  <span>To Book Pay Now</span>
                  <span>AED {formatMoney(frontendPayNow)}</span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-grey">
                    Pay This at the time of handover
                  </span>
                  <span className="font-semibold">
                    AED {formatMoney(frontendPayLater)}
                  </span>
                </div>
                   <button
                  onClick={handleCreateBooking}
                  disabled={!canPay || createLoading}
                  className={`flex-1 w-[380px]  rounded-2xl py-3 font-semibold text-white transition
        ${
          canPay
            ? "bg-gradient-to-r from-site-accent to-slate-teal shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
            : "bg-gray-300 cursor-not-allowed"
        }
      `}
                >
                  {createLoading ? "Redirecting..." : "Pay Now"}
                </button>
                <div className="flex gap-2 text-xs text-grey pt-3">
                  <CheckCircle2 className="text-site-accent w-4 h-4 mt-0.5" />
                  <p>
                    You’ll pay only the booking amount now. Remaining will be
                    paid at the time of delivery/pickup.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
