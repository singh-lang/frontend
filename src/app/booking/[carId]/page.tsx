"use client";
import { Stripe } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useApplyCouponMutation } from "@/lib/api/couponApi";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  CalendarDays,
  Clock,
  Timer,
  MapPin,
  Truck,
  Store,
  RotateCcw,
  Plus,
  User,
  Phone,
  Mail,
  Users,
  Settings,
  Building2,
} from "lucide-react";

import { DateInput } from "@/components/ui/datePicker";
import ImportantInfo from "@/app/booking/[carId]/info";
import { useCalculatePickupReturnMutation } from "@/lib/api/pickupReturnApi";
import {
  useCalculateBookingMutation,
  useCreateBookingMutation,
} from "@/lib/api/booking";
import { getCar } from "@/lib/api/allcarapi";
import type { CarTypes } from "@/types/homePageTypes";
import { useGetDepositFreePricingFrontendQuery } from "@/lib/api/depositFreeFrontendApi";
import { useGetAddonsByCarQuery } from "@/lib/api/carAddonsApi";
import Navbar from "@/components/home/Navbar";

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

const EMIRATES = [
  { id: "6953ce30ad7fb6b0b43ee72c", name: "Dubai" },
  { id: "6953ce30ad7fb6b0b43ee729", name: "Abu Dhabi" },
  { id: "6953ce31ad7fb6b0b43ee72f", name: "Sharjah" },
  { id: "6953ce31ad7fb6b0b43ee732", name: "Ajman" },
  { id: "6953ce32ad7fb6b0b43ee735", name: "Umm Al Quwain" },
  { id: "6953ce32ad7fb6b0b43ee738", name: "Ras Al Khaimah" },
  { id: "6953ce33ad7fb6b0b43ee73b", name: "Fujairah" },
];
// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
// );
// const [clientSecret, setClientSecret] = useState<string | null>(null);
// const [showStripe, setShowStripe] = useState(false);

// const [mounted, setMounted] = useState(false);

// useEffect(() => {
//   setMounted(true);
// }, []);
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function BookingPage() {
  const params = useParams();
  const carId = (params?.carId as string) || "";
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showStripe, setShowStripe] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [step, setStep] = useState(1);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    couponId: string;
    discount: number;
  } | null>(null);

  const [maxStepReached, setMaxStepReached] = useState(1);
  const [applyCoupon, { isLoading: couponLoading }] = useApplyCouponMutation();

  const [agree, setAgree] = useState(false);
  const steps = [
    { id: 1, label: "Rental Plan" },
    { id: 2, label: "Select Dates" },
    { id: 3, label: "Pickup & Drop off" },
    { id: 4, label: "Your Details" },
  ];

  // ---------- UI STATES ----------
  const [showDeliveryPolicy, setShowDeliveryPolicy] = useState(false);
  const [addonsOpen, setAddonsOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [depositFree, setDepositFree] = useState(true);
  const [mobileAddonsOpen, setMobileAddonsOpen] = useState(false);

  // ---------- FORM STATES ----------
  const [priceType, setPriceType] = useState<PriceType>("daily");

  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffDate, setDropoffDate] = useState("");
  const [dropoffTime, setDropoffTime] = useState("10:00");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("10:00");

  const [pickupType, setPickupType] = useState<"PICKUP" | "DELIVERY">("PICKUP");
  const [returnType, setReturnType] = useState<"DROPOFF" | "RETURN">("DROPOFF");

  const [emirateId, setEmirateId] = useState<string>("");
  const [address, setAddress] = useState("");
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  const [guestEmail, setGuestEmail] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  // ---------- ADDONS ----------
  const [childSeat, setChildSeat] = useState(false);
  const [babySeat, setBabySeat] = useState(false);
  const [gps, setGps] = useState(false);
  const [additionalDriver, setAdditionalDriver] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  // ---------- DATA ----------
  const [carLoading, setCarLoading] = useState(true);
  const [carData, setCarData] = useState<CarTypes | null>(null);

  const [calc, setCalc] = useState<BookingCalculation | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [mobileStep, setMobileStep] = useState<1 | 2 | 3>(1);

  const [pickupReturnCharges, setPickupReturnCharges] = useState({
    pickup: 0,
    return: 0,
  });

  const [calculatePickupReturn] = useCalculatePickupReturnMutation();
  const [calculateBooking, { isLoading: calcLoading }] =
    useCalculateBookingMutation();
  const [createBooking, { isLoading: createLoading }] =
    useCreateBookingMutation();

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  const validateMobileStep1 = (): string | null => {
    if (!startDate) return "Please select pickup date";
    if (!endDate) return "Please select drop-off date";
    if (!pickupTime) return "Please select pickup time";
    if (!dropoffTime) return "Please select drop-off time";
    if ((pickupType === "DELIVERY" || returnType === "RETURN") && !emirateId)
      return "Please select emirate for delivery/return pricing";
    if (pickupType === "DELIVERY" && !address.trim())
      return "Delivery address is required";
    return null;
  };
  const canPayFinal = useMemo(() => {
    // price must exist
    if (!calc || calc.totalAmount <= 0) return false;

    // user details
    if (!guestName.trim()) return false;
    if (!guestPhone.trim()) return false;
    if (!guestEmail.trim()) return false;

    // delivery rules
    if ((pickupType === "DELIVERY" || returnType === "RETURN") && !emirateId)
      return false;

    if (pickupType === "DELIVERY" && !address.trim()) return false;

    return true;
  }, [
    calc,
    guestName,
    guestPhone,
    guestEmail,
    pickupType,
    returnType,
    emirateId,
    address,
  ]);
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setCouponError(null);

    try {
      const res = await applyCoupon({
        code: couponCode,
        orderAmount: originalPayNow, // ✅ PAY NOW BASE
      }).unwrap();

      setAppliedCoupon({
        couponId: res.data.couponId,
        discount: res.data.discount,
      });

    toast.success(`Coupon applied! -AED ${res.data.discount}`);
} catch (err: unknown) {  // Using unknown for error type
  if (err instanceof Error) {  // TypeGuard to check if it's an Error object
    setAppliedCoupon(null);
    setCouponError(err?.message || "Invalid coupon");  // Accessing the message properly
  } else {
    // Fallback if the error is not of type Error
    setCouponError("Invalid coupon");
  }
}
  };

  const handleContinue = () => {
    const err = validateMobileStep1();
    if (err) {
      toast.error(err); // ✅ ab aayega
      return;
    }
    setMobileStep(2);
  };
  const validateMobileStep2 = (): string | null => {
    return null;
  };
  const handleNextStep = async () => {
    const err1 = validateMobileStep1();
    if (err1) {
      toast.error(err1);
      return;
    }

    const err2 = validateMobileStep2();
    setMobileStep(3);
  };
  const validateMobileStep3 = (): string | null => {
    if (!guestName.trim()) return "Full name is required";
    if (!guestPhone.trim()) return "Phone number is required";
    if (!guestEmail.trim()) return "Email address is required";
    return null;
  };
  const handleConfirmPayMobile = async () => {
    if (!agree) {
      toast.error("Please accept terms and conditions");
      return;
    }
    if (!canPayFinal) {
      toast.error("Please complete all required fields");
      return;
    }
    await handleCreateBooking(); // ✅ only after all validations
  };
  const { data: addonRes, isLoading: addonsLoading } = useGetAddonsByCarQuery(
    carId,
    {
      skip: !carId,
    },
  );
  const vendorAddons = addonRes?.data || [];
  const { data: depositFreeRes } = useGetDepositFreePricingFrontendQuery(
    carId,
    {
      skip: !carId,
    },
  );
  useEffect(() => {
  console.log("carData:", carData);
}, [carData]);

  const pageWrap = "min-h-screen bg-[#f5f7fb]";
  const container = "mx-auto max-w-6xl px-4 py-8";
  const card =
    "bg-white rounded-3xl border border-gray-200 shadow-[0_12px_40px_rgba(15,23,42,0.06)] p-6 mb-5";
  const sectionTitle = "text-sm font-semibold text-gray-700 mb-4 mt-4";
  const inputBase =
    "w-full font-semibold rounded-full border border-gray-200 bg-soft-grey/40 px-4 py-3 text-sm font-medium text-gray-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-site-accent/30";
  const fieldLabel = "text-sm font-semibold text-gray-500 mb-1 block";
  const primaryBtn =
    "w-full rounded-2xl bg-gradient-to-r from-site-accent to-slate-teal py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:opacity-95 transition disabled:opacity-50 disabled:cursor-not-allowed";
  const formatMoney = (n: number) =>
    Number.isFinite(n) ? Math.round(n).toLocaleString() : "0";
  const hhmmValid = (t: string) => /^\d{2}:\d{2}$/.test(t);
  const validateStep1 = (): string | null => {
    if (!pickupDate) return "Pickup date is required";
    if (!dropoffDate) return "Dropoff date is required";
    if (!pickupTime || !hhmmValid(pickupTime))
      return "Pickup time must be HH:mm";
    if (!dropoffTime || !hhmmValid(dropoffTime))
      return "Dropoff time must be HH:mm";
    return null;
  };

  const validateStep2 = (): string | null => {
    if ((pickupType === "DELIVERY" || returnType === "RETURN") && !emirateId)
      return "Please select emirate for delivery/return pricing";
    if (pickupType === "DELIVERY" && !address.trim())
      return "Delivery address is required";
    return null;
  };

  const validateStep3 = (): string | null => {
    if (!guestName.trim()) return "Full name is required";
    if (!guestPhone.trim()) return "Phone number is required";
    if (!guestEmail.trim()) return "Email address is required";
     if (!agree) return "Please accept terms and conditions";
    return null;
  };

  const validateAll = (): string | null => {
    return validateStep1() || validateStep2() || validateStep3();
  };

  const rentalDays = useMemo(() => {
    if (!pickupDate || !pickupTime || !dropoffDate || !dropoffTime) return 0;
    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${dropoffDate}T${dropoffTime}`);
    if (end <= start) return 0;
    const diffMs = end.getTime() - start.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return Math.max(Math.ceil(diffDays), 1);
  }, [pickupDate, pickupTime, dropoffDate, dropoffTime]);

  useEffect(() => {
    if (rentalDays <= 0) {
      setCalc(null);
      return;
    }

    const timer = setTimeout(() => {
      calculateBooking({
        carId,
        pickupDate,
        pickupTime,
        dropoffDate,
        dropoffTime,
        priceType,
        deliveryRequired: pickupType === "DELIVERY" || returnType === "RETURN",
        address: pickupType === "DELIVERY" ? address : undefined,
      })
        .unwrap()
        .then((res) => {
          setCalc(res.data);
        })
        .catch(() => {
          setCalc(null);
        });
    }, 300);
    return () => clearTimeout(timer);
  }, [rentalDays, pickupDate, pickupTime, dropoffDate, dropoffTime, priceType]);

  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>(
    {},
  );
  useEffect(() => {
    if (!vendorAddons.length) return;
    const map: Record<string, boolean> = {};
    vendorAddons.forEach((a) => {
      map[a._id] = false; // ✅ default unchecked
    });
    setSelectedAddons(map);
  }, [vendorAddons]);
  const addonsTotal = useMemo(() => {
    return vendorAddons.reduce((sum, addon) => {
      if (!selectedAddons[addon._id]) return sum;
      switch (addon.priceType) {
        case "per_day":
          return sum + addon.price;
        case "per_week":
          return sum + addon.price;
        case "per_month":
          return sum + addon.price;
        case "per_booking":
        default:
          return sum + addon.price;
      }
    }, 0);
  }, [vendorAddons, selectedAddons]);
  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const hasSecurityDeposit =
    !!carData?.depositRequired && (carData?.securityDeposit ?? 0) > 0;
  const depositFreeDailyFee = depositFreeRes?.data?.daily || 0;
  const securityDepositAmount = hasSecurityDeposit
    ? carData!.securityDeposit!
    : 0;
  const rentalAmount = calc?.totalAmount ?? 0;
  const pickupFee = pickupReturnCharges.pickup;
  const returnFee = pickupReturnCharges.return;
  const depositFreeFee = depositFree ? depositFreeDailyFee : 0;
  const depositFreeTotal = depositFreeDailyFee * rentalDays;

  const isDepositFree = depositFree;
  const frontendTotal =
    rentalAmount +
    pickupFee +
    returnFee +
    addonsTotal +
    (isDepositFree ? depositFreeTotal : securityDepositAmount);
  const couponDiscount = appliedCoupon?.discount ?? 0;
  const originalPayNow = calc
    ? Math.round((frontendTotal * calc.prepaymentPercent) / 100)
    : 0;

  const frontendPayNow = Math.max(
    originalPayNow - (appliedCoupon?.discount ?? 0),
    0,
  );

  const frontendPayLater = frontendTotal - originalPayNow;

  const depositAmount = depositFree
    ? depositFreeDailyFee * rentalDays // ✅ deposit-free → daily × days
    : securityDepositAmount; // ✅ ONE TIME
useEffect(() => {
  if (!carId) return;

  const fetchCar = async () => {
    try {
      setCarLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/cars/getAllListingsWithoutPagination`,
        { cache: "no-store" }
      );

      const json = await res.json();

      const car =
        json?.listings?.find((c: CarTypes) => c._id === carId) || null;

      setCarData(car);
    } catch (err) {
      console.error("Failed to fetch car", err);
      setCarData(null);
    } finally {
      setCarLoading(false);
    }
  };

  fetchCar();
}, [carId]);

const carTitle = useMemo(() => {
  if (!carData) return "";

  const brand = carData.car?.carBrand?.name ?? "";
  const model = carData.car?.carModel ?? "";
  const year = carData.car?.modelYear ?? "";

  return [brand, model, year].filter(Boolean).join(" ");
}, [carData]);
  const securityDeposit = hasSecurityDeposit
    ? (carData?.securityDeposit ?? 0)
    : 0;
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const carImages = useMemo(() => {
  if (!carData?.car) return [];

  const imgs: string[] = [];

  if (carData.car.coverImage?.url) {
    imgs.push(
      carData.car.coverImage.url.startsWith("http")
        ? carData.car.coverImage.url
        : `${BASE_URL}${carData.car.coverImage.url}`,
    );
  }

  carData.car.images?.forEach((img) => {
    if (img?.url) {
      imgs.push(
        img.url.startsWith("http") ? img.url : `${BASE_URL}${img.url}`,
      );
    }
  });

  return imgs;
}, [carData]);

  const loadPickupReturnCharges = async () => {
    if (!carId) return;
    if ((pickupType === "DELIVERY" || returnType === "RETURN") && !emirateId)
      return;

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
      setPickupReturnCharges({ pickup: 0, return: 0 });
    }
  };

  useEffect(() => {
    loadPickupReturnCharges();
  }, [pickupType, returnType, emirateId]);

  useEffect(() => {
    if (!pickupDate || !dropoffDate) return;
    setCalc(null);
  }, [pickupDate, pickupTime, dropoffDate, dropoffTime, priceType]);
  const rangeDays =
    startDate && endDate
      ? Math.max(
          1,
          Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
          ),
        )
      : 0;
  const handleCalculate = async (): Promise<boolean> => {
    const err = validateAll();
    if (err) {
      toast.error(err);
      return false;
    }
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
      toast.success("Price calculated");
      return true;
    } catch (error: unknown) {
      const e = error as ApiError;
      toast.error(e?.data?.message || "Calculation failed");
      return false;
    }
  };
  const handleCreateBooking = async () => {
    if (!calc || calc.totalAmount <= 0) {
      toast.error("Please calculate price first");
      return;
    }

    try {
      // 1️⃣ Create booking
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
      }).unwrap();

      const bookingId = res?.data?._id;
      if (!bookingId) {
        toast.error("Booking created but ID missing");
        return;
      }
      setCreatedBookingId(bookingId);

      // 2️⃣ Create PaymentIntent
      const paymentRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/payments/create-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId,
             amount: frontendPayNow , // AED → fils * 100
            currency: "aed",
          }),
        },
      );

      const paymentData = await paymentRes.json();

      if (!paymentData.clientSecret) {
        toast.error("Payment initialization failed");
        return;
      }

      // 3️⃣ SHOW STRIPE
      setClientSecret(paymentData.clientSecret);
      setShowStripe(true);
    } catch (err) {
      toast.error("Booking failed");
    }
  };
  const getStepCircle = (id: number) => {
    if (id === 1)
      return "bg-gradient-to-r from-site-accent to-slate-teal text-white";
    if (maxStepReached >= id)
      return "bg-gradient-to-r from-site-accent to-slate-teal text-white";
    if (step === id) return "bg-site-accent text-white border-site-accent";
    return "bg-white text-gray-600 border-gray-200";
  };

  const getStepText = (id: number) => {
    if (step === id) return "text-gray-900";
    if (maxStepReached >= id) return "text-gray-600";
    return "text-gray-500";
  };
  const [cityPickupCharges, setCityPickupCharges] = useState<
    Record<string, number>
  >({});
  useEffect(() => {
    if (!carId) return;

    const loadAllPickupCharges = async () => {
      const charges: Record<string, number> = {};
      for (const emirate of EMIRATES) {
        try {
          const res = await calculatePickupReturn({
            carId,
            emirateId: emirate.id,
            pickupType: "DELIVERY",
            returnType: "DROPOFF",
          }).unwrap();
          charges[emirate.id] = res.pickupCharge || 0;
        } catch {
          charges[emirate.id] = 0;
        }
      }
      setCityPickupCharges(charges);
    };
    loadAllPickupCharges();
  }, [carId]);
  return (
    
    <div className={pageWrap}>
 <div >
  <Navbar />
</div>

          <div className={container}>
        <div className="flex items-center justify-center mt-20 mb-8">
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
            {steps.map((s, index) => (
              <React.Fragment key={s.id}>
                <div className="flex items-center gap-2">
                  <span
                    className={`h-7 w-7 rounded-full border flex items-center justify-center text-xs font-bold transition ${getStepCircle(
                      s.id,
                    )}`}
                  >
                    {s.id === 1 || maxStepReached >= s.id ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      s.id
                    )}
                  </span>

                  <span className={`${getStepText(s.id)} transition`}>
                    {s.label}
                  </span>
                </div>

                {index !== steps.length - 1 && (
                  <div
                    className={`h-[2px] w-12 transition ${
                      maxStepReached > s.id ? "bg-gray-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className=" grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div className=" hidden md:block space-y-6">
            <div className={card}>
              <h2 className="text-2xl font-medium text-gray-700">
                Book Your Rental Car
              </h2>
              <p className={sectionTitle}>Select Rental Plan</p>
              <div className="grid grid-cols-3 bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
                {(["daily", "weekly", "monthly"] as PriceType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setPriceType(t)}
                    className={`py-2.5 rounded-xl font-bold capitalize text-sm transition ${
                      priceType === t
                        ? "bg-white shadow text-site-accent"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-6">
                <div className={card}>
                  <p className="text-lg mt-2 font-semibold text-gray-700">
                    Select Dates
                  </p>
                  <p className="text-sm font-semibold text-gray-500">
                    Choose pick-up and drop-off date & time.
                  </p>
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={fieldLabel}>Pick-up Date</label>
                      <DatePicker
                        selected={pickupDate ? new Date(pickupDate) : null}
                        onChange={(date: Date | null) => {
                          if (!date) return setPickupDate("");
                          const yyyy = date.getFullYear();
                          const mm = String(date.getMonth() + 1).padStart(
                            2,
                            "0",
                          );
                          const dd = String(date.getDate()).padStart(2, "0");
                          setPickupDate(`${yyyy}-${mm}-${dd}`); 
                        }}
                        minDate={new Date()}
                        placeholderText="dd-mm-yyyy"
                        dateFormat="dd-MM-yyyy"
                        customInput={<DateInput />}
                      />
                    </div>
                    <div>
                      <label className={fieldLabel}>Pick-up Time</label>
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label className={fieldLabel}>Drop-off Date</label>
                      <DatePicker
                        selected={dropoffDate ? new Date(dropoffDate) : null}
                        onChange={(date: Date | null) => {
                          if (!date) return setDropoffDate("");
                          const yyyy = date.getFullYear();
                          const mm = String(date.getMonth() + 1).padStart(
                            2,
                            "0",
                          );
                          const dd = String(date.getDate()).padStart(2, "0");
                          setDropoffDate(`${yyyy}-${mm}-${dd}`);
                        }}
                        minDate={pickupDate ? new Date(pickupDate) : new Date()}
                        placeholderText="dd-mm-yyyy"
                        dateFormat="dd-MM-yyyy"
                        customInput={<DateInput />}
                      />
                    </div>
                    <div>
                      <label className={fieldLabel}>Drop-off Time</label>
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
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-extrabold text-gray-900">
                        Important Info
                      </p>
                      <p className="text-xs font-semibold text-gray-500">
                        Optional
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setInfoOpen((prev) => !prev)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        infoOpen ? "bg-site-accent" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                          infoOpen ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {infoOpen && (
                    <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <ImportantInfo />
                      
               <div
                  className="
                    bg-white mt-4 rounded-3xl
                    border border-gray-200
                    shadow-[0_12px_40px_rgba(15,23,42,0.06)]
                    p-5
                    space-y-4
                  "
                >
                  {/* HEADER */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Deposit Option
                      </p>
                    
                    </div>

                    {/* TOGGLE */}
                    <button
                      onClick={() => setDepositFree((prev) => !prev)}
                      className={`relative w-12 h-6 rounded-full transition-colors
                        ${depositFree ? "bg-site-accent" : "bg-gray-300"}
                      `}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full
                          bg-white shadow transition-transform
                          ${depositFree ? "translate-x-6" : "translate-x-0"}
                        `}
                      />
                    </button>
                  </div>

                  {/* OPTION CARD */}
                  <div
                    className="
                      bg-gray-50 rounded-2xl
                      p-4
                      flex items-center justify-between
                      gap-4
                    "
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm
                                      flex items-center justify-center text-lg">
                        💳
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {depositFree ? "Deposit-free Fee" : "Security Deposit"}
                        </p>

                        <p className="text-xs text-gray-500 mt-0.5 max-w-[220px]">
                          {depositFree
                            ? "Charged per rental day to avoid paying a refundable deposit."
                            : "Fully refundable within 21 days after the car is returned."}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-medium">Amount</p>
                      <p className="text-lg font-bold text-site-accent">
                        AED{" "}
                        {depositFree
                          ? (depositFreeDailyFee * rentalDays).toLocaleString()
                          : securityDeposit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const err = validateStep1();
                    if (err) {
                      toast.error(err);
                      return;
                    }
                    setStep(2);
                    setMaxStepReached(2);
                  }}
                  className={primaryBtn}
                >
                  Next
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className={card}>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div>
                      <p className="text-lg font-semibold text-gray-700">
                        Pickup & Drop-off
                      </p>
                      <p className="text-sm font-semibold text-gray-500">
                        Choose how you want to receive and return the car.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowDeliveryPolicy(true)}
                      className="text-sm font-semibold underline text-site-accent"
                    >
                      Pickup Delivery Policy
                    </button>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-bold text-gray-500 mb-2">
                      Pick-up
                    </p>

                    <div className="relative flex bg-gray-100 rounded-2xl p-1 border border-gray-200">
                      <div
                        className={`absolute top-1 left-1 h-[calc(100%-0.5rem)] w-1/2 rounded-xl bg-white shadow-sm transition-transform duration-300 ${
                          pickupType === "DELIVERY" ? "translate-x-full" : ""
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() => setPickupType("PICKUP")}
                        className="relative z-10 flex-1 flex items-center gap-3 px-4 py-3 rounded-xl text-left"
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                            pickupType === "PICKUP"
                              ? "bg-site-accent text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          <Store size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">
                            Pick up at vendor
                          </p>
                          <p className="text-xs font-semibold text-gray-500">
                            Free
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPickupType("DELIVERY")}
                        className="relative z-10 flex-1 flex items-center gap-3 px-4 py-3 rounded-xl text-left"
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                            pickupType === "DELIVERY"
                              ? "bg-site-accent text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          <Truck size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">
                            Delivery to address
                          </p>
                          <p className="text-xs font-semibold text-gray-500">
                            Paid (by emirate)
                          </p>
                        </div>
                      </button>
                    </div>

                    {(pickupType === "DELIVERY" || returnType === "RETURN") && (
                      <div className="mt-4">
                        <label className={fieldLabel}>Select Emirate</label>
                        <select
                          className={inputBase}
                          value={emirateId}
                          onChange={(e) => setEmirateId(e.target.value)}
                        >
                          <option value="">Select Emirate</option>
                          {EMIRATES.map((e) => (
                            <option key={e.id} value={e.id}>
                              {e.name}
                            </option>
                          ))}
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
                          className={`${inputBase} resize-none`}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <p className="text-xs font-bold text-gray-500 mb-2">
                      Drop-off
                    </p>

                    <div className="relative flex bg-gray-100 rounded-2xl p-1 border border-gray-200">
                      <div
                        className={`absolute top-1 left-1 h-[calc(100%-0.5rem)] w-1/2 rounded-xl bg-white shadow-sm transition-transform duration-300 ${
                          returnType === "RETURN" ? "translate-x-full" : ""
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() => setReturnType("DROPOFF")}
                        className="relative z-10 flex-1 px-4 py-3 rounded-xl text-left"
                      >
                        <p className="font-semibold text-sm text-gray-900">
                          Dropoff to vendor
                        </p>
                        <p className="text-xs font-semibold text-gray-500">
                          Free
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReturnType("RETURN")}
                        className="relative z-10 flex-1 px-4 py-3 rounded-xl text-left"
                      >
                        <p className="font-semibold text-sm text-gray-900">
                          Vendor collects car
                        </p>
                        <p className="text-xs font-semibold text-gray-500">
                          Paid (by emirate)
                        </p>
                      </button>
                    </div>
                  </div>
                </div>

                <div className={card}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Enjoy a deposit-free ride for AED {depositFreeDailyFee}{" "}
                        per day
                      </p>
                      <p className="text-sm text-gray-600 p-2">
                        You can rent a car without any deposit by including the
                        additional service fee in your rental price
                      </p>
                    </div>

                    <button
                      onClick={() => setDepositFree((prev) => !prev)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        depositFree ? "bg-site-accent" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          depositFree ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                        💳
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">
                          {depositFree
                            ? "Deposit-free Fee"
                            : "Security Deposit"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {depositFree
                            ? "Applied per rental day"
                            : "Refunded within 21 days after you return the car"}
                        </p>
                      </div>
                    </div>

                    <p className="text-lg font-semibold text-site-accent">
                      AED{" "}
                      {depositFree
                        ? (depositFreeDailyFee * rentalDays).toLocaleString() // ✅ daily × days
                        : securityDeposit.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="h-12 w-1/2 rounded-2xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const err1 = validateStep1();
                      if (err1) return toast.error(err1);
                      const err2 = validateStep2();
                      if (err2) return toast.error(err2);
                      setStep(3);
                      setMaxStepReached(3);
                    }}
                    className={`${primaryBtn} h-12 w-1/2`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className={card}>
                  <p className={sectionTitle}>Your Details</p>
                  <div className="space-y-4">
                    <div>
                      <label className={fieldLabel}>Full Name</label>
                      <input
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Enter your full name"
                        className="
    w-full min-w-0
    rounded-full
    border border-gray-200
    bg-soft-grey/40
    px-4 py-3
    text-base md:text-sm
    font-medium text-gray-800
    outline-none transition
    focus:bg-white
    focus:ring-2 focus:ring-site-accent/30
  "
                      />
                    </div>
                    <div>
                      <label className={fieldLabel}>Mobile Number</label>
                      <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-site-accent/30">
                        <span className="text-sm font-extrabold text-gray-900 mr-2">
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
                          className="flex-1 bg-transparent outline-none text-sm font-semibold"
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
                <div className="bg-white rounded-3xl border border-gray-200 shadow-[0_12px_40px_rgba(15,23,42,0.06)] p-4">
                  <div className="flex items-center justify-between ">
                    <div>
                      <p className="font-semibold text-dark-base">Add-ons</p>
                      <p className="text-xs text-grey">
                        {addonsTotal > 0
                          ? `AED ${formatMoney(addonsTotal)}`
                          : vendorAddons.length === 0
                            ? "No add-ons available"
                            : "Optional"}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={vendorAddons.length === 0}
                      onClick={() => setAddonsOpen((prev) => !prev)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        vendorAddons.length === 0
                          ? "bg-gray-200 cursor-not-allowed"
                          : addonsOpen
                            ? "bg-site-accent"
                            : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                          addonsOpen ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </div>
                  {addonsOpen && (
                    <div className="space-y-2">
                      {vendorAddons.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No add-ons available for this car
                        </p>
                      ) : (
                        vendorAddons.map((addon) => {
                          const checked = !!selectedAddons[addon._id];
                          return (
                            <label
                              key={addon._id}
                              className={`flex justify-between items-center rounded-2xl p-4 cursor-pointer transition ${
                                checked
                                  ? "bg-site-accent/5"
                                  : "bg-soft-grey/30 hover:bg-soft-grey/45"
                              }`}
                            >
                              <div>
                                <p className="font-medium text-sm text-dark-base">
                                  {addon.name}
                                </p>
                                <p className="text-xs text-grey">
                                  AED {addon.price}
                                  {addon.priceType === "per_day" && " / day"}
                                  {addon.priceType === "per_week" && " / week"}
                                  {addon.priceType === "per_month" &&
                                    " / month"}
                                </p>
                              </div>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleAddon(addon._id)}
                                className="h-5 w-5 accent-[var(--site-accent)]"
                              />
                            </label>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
                 <div className={card}>
                    <h3 className="text-base font-extrabold text-gray-900 mb-3">
                      Agreement
                    </h3>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="mt-1 h-5 w-5 rounded border-gray-300 text-site-accent focus:ring-site-accent"
                      />
                      <div className="flex flex-col">
                        {/* Row 1 */}
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900">
                            I agree to the terms and conditions
                          </p>

                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                            i
                          </span>
                        </div>

                        {/* Row 2 */}
                        <p className="text-xs text-gray-500 mt-1">
                          I have reviewed the rental agreement and agree to all
                          stated terms and conditions
                        </p>
                      </div>
                    </label>
                    <div className="mt-4  border-t border-gray-200  p-3 flex gap-3">
                      <div className="text-yellow-500 text-lg">✍️</div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Physical Signature Required
                        </p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          A physical copy of this agreement must be signed upon
                          pickup or delivery of the vehicle. This digital
                          approval is for your convenience and does not replace
                          the physical signature requirement.
                        </p>
                      </div>
                    </div>
                  </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="h-12 w-full rounded-2xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  {/* <button
              type="button"
              onClick={async () => {
                const err = validateAll();
                await handleCalculate();
                  setMaxStepReached(4); // ✅ Your Details completed
                }}
                disabled={calcLoading}
                className={`${primaryBtn} h-12 w-1/2`}
                >
              {calcLoading ? "Calculating..." : "Calculate Price"}
          </button> */}
                </div>
              </div>
            )}
          </div>
          <div className="hidden md:block lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-[0_12px_40px_rgba(15,23,42,0.06)] p-5">
              <p className="text-sm font-extrabold text-gray-900 mb-4">
                Booking Summary
              </p>
              {carImages.length > 0 ? (
                <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                  <img
  src={carImages[0]}
  alt="car"
  className="w-full h-[160px] object-cover"
  onError={(e) => {
    e.currentTarget.src = "/placeholder-car.png";
  }}
/>

                </div>
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 h-[160px] flex items-center justify-center text-gray-400 font-bold">
                  No image
                </div>
              )}
              <div className="mt-4">
                <p className="text-lg font-extrabold text-gray-900">
                  {carLoading ? "Loading..." : carData?.title || "Car Name"}
                </p>
                <div className="mt-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm font-semibold">
                      Rental Plan
                    </span>
                    <span className="font-semibold text-sm capitalize">
                      {priceType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold w-full">
                    <span className="text-gray-500">Method</span>
                    <span className="font-semibold text-gray-900">
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
                    <div className="text-xs text-gray-500 bg-soft-grey/30 rounded-xl p-2">
                      {address}
                    </div>
                  )}
                  <div className="pt-3 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between text-sm font-semibold text-gray-700">
                      <span>Base Rental:</span>
                      <span className="text-gray-900">
                        AED{" "}
                        {formatMoney(
                          rentalDays > 0 ? (calc?.totalAmount ?? 0) : 0,
                        )}
                      </span>
                    </div>
                    {pickupReturnCharges.pickup > 0 && (
                      <div className="flex justify-between text-sm font-semibold text-gray-700">
                        <span>Pickup charge:</span>
                        <span className="text-gray-900">
                          AED {formatMoney(pickupReturnCharges.pickup)}
                        </span>
                      </div>
                    )}

                    {pickupReturnCharges.return > 0 && (
                      <div className="flex justify-between text-sm font-semibold text-gray-700">
                        <span>Return charge:</span>
                        <span className="text-gray-900">
                          AED {formatMoney(pickupReturnCharges.return)}
                        </span>
                      </div>
                    )}

                    {/* Deposit / Deposit-Free */}
                    {(depositFreeDailyFee > 0 || securityDeposit > 0) && (
                      <div className="flex justify-between text-sm font-semibold text-gray-700">
                        <span>
                          {isDepositFree
                            ? "Deposit-free fee"
                            : "Security Deposit"}
                        </span>

                        <span className="text-gray-900">
                          AED {formatMoney(depositAmount)}
                        </span>
                      </div>
                    )}

                    {addonsTotal > 0 && (
                      <div className="flex justify-between text-sm font-semibold text-gray-700">
                        <span>Add-ons:</span>
                        <span className="text-gray-900">
                          AED {formatMoney(addonsTotal)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between text-base font-extrabold text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total Price:</span>
                    <span>AED {formatMoney(frontendTotal)}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm font-bold text-site-accent">
                    <span>Pay Now</span>
                    <span>AED {formatMoney(frontendPayNow)}</span>
                  </div>
                  {/* COUPON */}
                  <div className="mt-4">
                    <label className="text-sm font-semibold text-gray-700">
                      Coupon Code
                    </label>

                    <div className="flex gap-2 mt-2">
                      <input
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        placeholder="Enter coupon"
                        className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold"
                      />

                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="rounded-xl bg-site-accent px-4 py-2 text-white text-sm font-bold"
                      >
                        {couponLoading ? "Applying..." : "Apply"}
                      </button>
                    </div>

                    {couponError && (
                      <p className="text-xs text-red-500 mt-1">{couponError}</p>
                    )}

                    {appliedCoupon && (
                      <p className="text-xs text-green-600 mt-1">
                        Coupon applied: −AED {appliedCoupon.discount}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between text-xs font-semibold text-gray-500">
                    <span>Pay later at handover</span>
                    <span className="text-gray-900 font-extrabold">
                      AED {formatMoney(frontendPayLater)}
                    </span>
                  </div>
                </div>

                {/* <button
                  onClick={handleCreateBooking}
                  disabled={!canPayFinal || createLoading}
                  className={`mt-4 ${primaryBtn}`}
                >
                  {createLoading ? "Redirecting..." : "Confirm & Pay"}
                </button> */}

                {/* {frontendTotal === 0 && (
                  <p className="mt-3 text-xs font-semibold text-gray-500">
                    Please complete steps and click{" "}
                    <span className="font-extrabold">Calculate Price</span>
                  </p>
                )} */}

                {/* {!showStripe ? (
                  <button
                    onClick={handleCreateBooking}
                    disabled={!canPayFinal || createLoading}
                    className={`mt-4 ${primaryBtn}`}
                  >
                    {createLoading ? "Preparing payment..." : "Confirm & Pay"}
                  </button>
                ) : (
                  clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <StripeCheckoutInline
                        onSuccess={() => {
                          toast.success("Booking confirmed");
                        }}
                      />
                    </Elements>
                  )
                )} */}
                {/* {!showStripe ? (
  <button
    onClick={handleCreateBooking}
    disabled={!canPayFinal || createLoading}
    className={`mt-4 ${primaryBtn}`}
  >
    {createLoading ? "Preparing payment..." : "Confirm & Pay"}
  </button>
) : (
  mounted &&
  clientSecret && (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripeCheckoutInline
        onSuccess={() => {
          toast.success("Booking confirmed");
        }}
      />
    </Elements>
  )
)}
{/* CONFIRM & PAY / STRIPE */}
                {!showStripe ? (
                  <button
                    onClick={handleCreateBooking}
                    disabled={!agree|| !canPayFinal || createLoading}
                    className={`mt-4 ${primaryBtn}`}
                  >
                    {createLoading ? "Preparing payment..." : "Confirm & Pay"}
                  </button>
                ) : (
                  mounted &&
                  clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <StripeCheckoutInline
                        onSuccess={() => {
                          toast.success("Booking confirmed");

                          if (!createdBookingId) {
                            toast.error("Booking ID missing");
                            return;
                          }
                         router.push(`/payments/rental/${createdBookingId}`);
                        }}
                      />
                    </Elements>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="lg:hidden  mt-20 fixed inset-0 bg-white z-40 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3">
                <div className="flex items-start gap-3">
                  {carImages.length > 0 ? (
                    <img
                      src={carImages[0]}
                      alt="car"
                      className="w-[120px] h-[90px] rounded-xl object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-[120px] h-[90px] rounded-xl flex items-center justify-center bg-gray-100 text-gray-400 font-bold border border-gray-200">
                      No Image
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="text-xs font-bold text-site-accent uppercase tracking-wide">
                      {carData?.car?.carBrand?.name || "Brand"}
                    </p>

                    <p className="text-base font-extrabold text-gray-900 leading-snug">
                      {carLoading ? "Loading..." : carData?.title || "Car Name"}
                    </p>

                    <p className="text-sm font-bold text-gray-700">
                      {carLoading ? "" : carData?.car?.modelYear || ""}
                    </p>
                    <div className="flex items-center gap-6">
                      <p className="text-xs font-extrabold text-gray-600 leading-snug flex items-center gap-2">
                        <Users className="w-3 h-3 text-site-accent" />
                        {carLoading
                          ? "Loading..."
                          : carData?.car?.seatingCapacity || "Car Name"}
                      </p>

                      <p className="text-xs font-extrabold text-gray-600 leading-snug flex items-center gap-2">
                        <Settings className="w-3 h-3 text-site-accent" />
                        {carLoading
                          ? "Loading..."
                          : carData?.car?.transmission || "Car Name"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 ">
              {mobileStep === 1 && (
                <>
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Select Rental Plan
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    {(["daily", "weekly", "monthly"] as PriceType[]).map(
                      (t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setPriceType(t)}
                          className={`py-2 rounded-xl font-bold capitalize text-sm transition ${
                            priceType === t
                              ? "text-white bg-gradient-to-r from-site-accent to-slate-teal shadow"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {t}
                        </button>
                      ),
                    )}
                  </div>
                  <p className="text-lg font-semibold text-gray-700 mt-6">
                    Delivery Option
                  </p>
                  <div className="mt-2">
                    <p className="text-sm font-bold text-gray-600 mb-2">
                      Pick-up
                    </p>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setPickupType("PICKUP")}
                        className={`flex-1 px-1 py-1 rounded-lg border transition ${
                          pickupType === "PICKUP"
                            ? "border-site-accent"
                            : "border-gray-400"
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center ">
                          <div className="w-9 h-9 rounded-full bg-site-accent flex items-center justify-center">
                            <Store className="w-4 h-4 text-white" />
                          </div>

                          <p className="font-semibold text-sm text-gray-900 text-center">
                            Pick up At Vendor
                          </p>

                          <p className="text-xs font-medium text-gray-500 text-center">
                            Free
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPickupType("DELIVERY")}
                        className={`flex-1 px-3 py-3 rounded-lg border transition ${
                          pickupType === "DELIVERY"
                            ? "border-site-accent"
                            : "border-gray-400"
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center ">
                          <div className="w-9 h-9 rounded-full bg-site-accent flex items-center justify-center">
                            <Truck className="w-4 h-4 text-white" />
                          </div>

                          <p className="font-semibold text-sm text-gray-900 text-center">
                            Delivery At Address
                          </p>

                          <p className="text-xs font-medium text-gray-500 text-center">
                            Paid (By Emirate)
                          </p>
                        </div>
                      </button>
                    </div>

                    {(pickupType === "DELIVERY" || returnType === "RETURN") && (
                      <div className="mt-4">
                        <label className="text-sm font-semibold text-gray-500 mb-1 block">
                          Select Emirate
                        </label>

                        <select
                          className="w-full rounded-2xl border border-gray-300  px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-site-accent/30"
                          value={emirateId}
                          onChange={(e) => setEmirateId(e.target.value)}
                        >
                          <option value="">Select Emirate</option>
                          {EMIRATES.map((e) => (
                            <option key={e.id} value={e.id}>
                              {e.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {pickupType === "DELIVERY" && (
                      <div className="mt-4">
                        <label className="text-sm font-semibold text-gray-500 mb-1 block">
                          Delivery Address
                        </label>

                        <textarea
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Building, street, area, city"
                          rows={3}
                          className="w-full rounded-2xl border border-gray-300  px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-site-accent/30 resize-none"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-bold text-gray-700 mb-2">
                      Drop-off
                    </p>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setReturnType("DROPOFF")}
                        className={`flex-1 px-3 py-3 rounded-lg border transition ${
                          returnType === "DROPOFF"
                            ? "border-site-accent"
                            : "border-gray-400"
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center ">
                          <div className="w-9 h-9 rounded-full bg-site-accent flex items-center justify-center">
                            <Store className="w-4 h-4 text-white" />
                          </div>

                          <p className="font-semibold text-sm text-gray-900 text-center">
                            Dropoff To Vendor
                          </p>

                          <p className="text-xs font-medium text-gray-500 text-center">
                            Free
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReturnType("RETURN")}
                        className={`flex-1 px-3 py-3 rounded-lg border transition ${
                          returnType === "RETURN"
                            ? "border-site-accent"
                            : "border-gray-400"
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-9 h-9 rounded-full bg-site-accent flex items-center justify-center">
                            <Truck className="w-4 h-4 text-white" />
                          </div>

                          <p className="font-semibold text-sm text-gray-900 text-center">
                            Vendor Collects Car
                          </p>

                          <p className="text-xs font-medium text-gray-500 text-center">
                            Paid (By Emirate)
                          </p>
                        </div>
                      </button>
                    </div>

                    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-3">
                      <p className="text-base font-extrabold text-gray-900">
                        Select Date & Time
                      </p>

                      {/* Time pill */}
                      <div className="mt-3 rounded-2xl bg-gray-200 px-3 py-2">
                        <div className="grid grid-cols-2 gap-2 items-center">
                          {/* Start */}
                          <div className="flex flex-col items-center">
                            <p className="text-sm font-semibold text-gray-500 mb-1">
                              Start Date
                            </p>
                            <p className="text-base md:text-lg font-extrabold text-gray-900 mb-2 md:mb-4">
                              {startDate
                                ? startDate.toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })
                                : ""}
                            </p>

                            <input
                              type="time"
                              value={pickupTime}
                              onChange={(e) => setPickupTime(e.target.value)}
                              className="
                              w-[150px]
                              bg-gray-100
                              text-sm
                              p-2
                              border-2 border-gray-300 rounded-2xl
                              font-semibold
                              text-gray-900
                              outline-none
                              text-center
                            "
                            />
                          </div>

                          {/* End */}
                          <div className="flex flex-col items-center">
                            <p className="text-sm font-semibold text-gray-500 mb-1">
                              End Date
                            </p>
                            <p className="text-base md:text-lg font-extrabold text-gray-900 mb-2 md:mb-4">
                              {endDate
                                ? endDate.toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })
                                : ""}
                            </p>
                            <input
                              type="time"
                              value={dropoffTime}
                              onChange={(e) => setDropoffTime(e.target.value)}
                              className="
                            w-[150px]
                            bg-gray-100
                            p-2
                            text-sm
                            border-2 border-gray-300 rounded-2xl
                            font-semibold
                            text-gray-900
                            outline-none
                            text-center
                          "
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center mt-4">
                        <DatePicker
                          inline
                          selectsRange
                          startDate={startDate}
                          endDate={endDate}
                          onChange={(update) => {
                            setDateRange(update);

                            const [s, e] = update;

                            if (s) {
                              const yyyy = s.getFullYear();
                              const mm = String(s.getMonth() + 1).padStart(
                                2,
                                "0",
                              );
                              const dd = String(s.getDate()).padStart(2, "0");
                              setPickupDate(`${yyyy}-${mm}-${dd}`);
                              setPickupTime(startTime);
                            }

                            if (e) {
                              const yyyy = e.getFullYear();
                              const mm = String(e.getMonth() + 1).padStart(
                                2,
                                "0",
                              );
                              const dd = String(e.getDate()).padStart(2, "0");
                              setDropoffDate(`${yyyy}-${mm}-${dd}`);
                              setDropoffTime(endTime);
                            }
                          }}
                          minDate={new Date()}
                          calendarClassName="mobileRangeCalendar"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {mobileStep === 2 && (
                <>
                  <div>
                    <p className="text-sm font-extrabold text-gray-900 mb-3 ">
                      Booking Summary
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-200  p-4">
                    <div className="space-y-3 text-sm font-semibold text-gray-700">
                      {/* START DATE */}
                      <div className="flex justify-between border-b border-gray-200 pb-3">
                        <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
                          <CalendarDays className="w-4 h-4 text-site-accent" />
                          <span>Start Date</span>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {startDate
                              ? startDate.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "-"}
                          </p>
                          <p className="text-xs font-bold text-text-gray-900 mt-0.5 flex items-center justify-end gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {startTime || "--:--"}
                          </p>
                        </div>
                      </div>

                      {/* END DATE */}
                      <div className="flex justify-between border-b border-gray-200 pb-3">
                        <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
                          <CalendarDays className="w-4 h-4 text-site-accent" />
                          <span>End Date</span>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {endDate
                              ? endDate.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "-"}
                          </p>
                          <p className="text-xs font-bold text-text-gray-900  mt-0.5 flex items-center justify-end gap-1">
                            <Clock className="w-3.5 h-3.5 " />
                            {endTime || "--:--"}
                          </p>
                        </div>
                      </div>

                      {/* DURATION */}
                      <div className="flex justify-between border-b border-gray-200 pb-3">
                        <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
                          <Timer className="w-4 h-4 text-site-accent" />
                          <span>Duration</span>
                        </div>

                        <span className="font-bold text-gray-900">
                          {rangeDays} days
                        </span>
                      </div>

                      {/* PICKUP OPTION */}
                      <div className="flex justify-between border-b border-gray-200 py-3">
                        <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
                          {pickupType === "DELIVERY" ? (
                            <Truck className="w-4 h-4 text-site-accent" />
                          ) : (
                            <Store className="w-4 h-4 text-site-accent" />
                          )}
                          <span>Pickup Option</span>
                        </div>

                        <p className="text-sm font-bold text-gray-900">
                          {pickupType === "DELIVERY" ? "Delivery" : "Pickup"}
                        </p>
                      </div>

                      {/* DELIVERY ADDRESS */}
                      {pickupType === "DELIVERY" && (
                        <div className="flex justify-between border-b border-gray-200 py-3">
                          <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
                            <MapPin className="w-4 h-4 text-site-accent" />
                            <span>Address</span>
                          </div>

                          <p className="text-sm font-bold text-gray-900 text-right max-w-[55%]">
                            {address || "-"}
                          </p>
                        </div>
                      )}

                      {/* DROPOFF OPTION */}
                      <div className="flex justify-between border-b border-gray-200 py-3">
                        <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
                          <RotateCcw className="w-4 h-4 text-site-accent" />
                          <span>Dropoff Option</span>
                        </div>

                        <span className="font-bold text-gray-900">
                          {returnType === "RETURN" ? "Return" : "Dropoff"}
                        </span>
                      </div>

                      {/* RETURN EMIRATE */}
                      {returnType === "RETURN" && (
                        <div className="flex justify-between border-b border-gray-200 py-3">
                          <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
                            <MapPin className="w-4 h-4 text-site-accent" />
                            <span>Emirate</span>
                          </div>

                          <p className="text-sm font-bold text-gray-900">
                            {EMIRATES.find((e) => e.id === emirateId)?.name ||
                              "-"}
                          </p>
                        </div>
                      )}
                      {vendorAddons.length > 0 && (
                        <>
                          {/* ADD-ONS HEADER */}
                          <div className="flex items-center justify-between border-b border-gray-200 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 flex items-center justify-center rounded-full border border-site-accent text-site-accent">
                                <Plus className="w-3 h-3" />
                              </div>

                              <div>
                                <p className="font-semibold text-dark-base">
                                  Add-ons
                                </p>
                                <p className="text-xs text-grey">
                                  {addonsTotal > 0
                                    ? `AED ${formatMoney(addonsTotal)}`
                                    : "Optional"}
                                </p>
                              </div>
                            </div>

                            {/* TOGGLE */}
                            <button
                              type="button"
                              onClick={() =>
                                setMobileAddonsOpen((prev) => !prev)
                              }
                              className={`relative w-11 h-6 rounded-full transition-colors ${
                                mobileAddonsOpen
                                  ? "bg-site-accent"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                                  mobileAddonsOpen ? "translate-x-5" : ""
                                }`}
                              />
                            </button>
                          </div>
                          {/* ADD-ONS LIST */}
                          {mobileAddonsOpen && (
                            <div className="mt-3 space-y-2">
                              {vendorAddons.map((addon) => {
                                const checked = !!selectedAddons[addon._id];

                                return (
                                  <label
                                    key={addon._id}
                                    className={`flex justify-between items-center rounded-2xl p-4 cursor-pointer transition ${
                                      checked
                                        ? "bg-site-accent/5 border border-site-accent"
                                        : "bg-soft-grey/30 hover:bg-soft-grey/45 border border-transparent"
                                    }`}
                                  >
                                    <div>
                                      <p className="font-medium text-sm text-dark-base">
                                        {addon.name}
                                      </p>
                                      <p className="text-xs text-grey">
                                        AED {addon.price}
                                        {addon.priceType === "per_day" &&
                                          " / day"}
                                        {addon.priceType === "per_week" &&
                                          " / week"}
                                        {addon.priceType === "per_month" &&
                                          " / month"}
                                      </p>
                                    </div>

                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => toggleAddon(addon._id)}
                                      className="h-5 w-5 accent-[var(--site-accent)]"
                                    />
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </>
                      )}
                  <div className="flex items-center justify-between   gap-4">
                    <div>
                      <p className="text-sm font-extrabold text-gray-900">
                        Important Info
                      </p>
                      <p className="text-xs font-semibold text-gray-500">
                        Optional
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setInfoOpen((prev) => !prev)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        infoOpen ? "bg-site-accent" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                          infoOpen ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {infoOpen && (
                    <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <ImportantInfo />
                    </div>
                  )}
                      <div className="flex items-center justify-between border-t py-3 border-gray-200 pb-3 mt-4">
                        <div>
                          <p className="font-semibold text-gray-900 pt-3">
                            Security Deposit
                          </p>

                          <p className="text-sm text-gray-600 p-2">
                            Refunded within 21 days after you return the car
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setDepositFree((prev) => !prev)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            depositFree ? "bg-site-accent" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                              depositFree ? "translate-x-6" : ""
                            }`}
                          />
                        </button>
                      </div>
                      {/* SECURITY DEPOSIT AMOUNT */}

                      <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                            💳
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {depositFree
                                ? "Deposit-free Fee"
                                : "Security Deposit"}
                            </p>
                            <p className="text-xs text-gray-500 max-w-[150px]">
                              {depositFree
                                ? "Applied per rental day"
                                : "Refunded within 21 days after you return the car"}
                            </p>
                          </div>
                        </div>

                        <p className="text-lg font-semibold text-site-accent">
                          AED{" "}
                          {depositFree
                            ? (
                                depositFreeDailyFee * rentalDays
                              ).toLocaleString() // ✅ daily × days
                            : securityDeposit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {mobileStep === 3 && (
                <>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-site-accent" />
                      <p className="text-sm font-extrabold text-gray-900">
                        Your Details
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4 mt-3">
                    <div>
                      <label className="text-gray-700 font-semibold text-sm">
                        Full Name
                      </label>
                      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-site-accent/30">
                        <User className="w-4 h-4 text-site-accent" />
                        <input
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Enter your full name"
                          className="
                            w-full min-w-0
                            bg-transparent
                            outline-none
                            text-base md:text-sm
                            font-semibold
                          "
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-700 font-semibold text-sm">
                        Mobile Number
                      </label>
                      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-site-accent/30">
                        <Phone className="w-4 h-4 text-site-accent" />
                        <span className="text-sm font-extrabold text-gray-900">
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
                          className="
                          w-full min-w-0
                          bg-transparent
                          outline-none
                          text-base md:text-sm
                          font-semibold
                        "
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-700 font-semibold text-sm">
                        Email Address
                      </label>
                      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-site-accent/30">
                        <Mail className="w-4 h-4 text-site-accent" />
                        <input
                          type="email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="
                            w-full min-w-0
                            bg-transparent
                            outline-none
                            text-base md:text-sm
                            font-semibold
                          "
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm font-semibold">
                        Rental Plan
                      </span>
                      <span className="font-semibold text-sm capitalize">
                        {priceType}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-semibold w-full">
                      <span className="text-gray-500">Method</span>
                      <span className="font-semibold text-gray-900">
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
                      <div className="text-xs text-gray-500 bg-soft-grey/30 rounded-xl p-2">
                        {address}
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-200 space-y-2">
                      <div className="flex justify-between text-sm font-semibold text-gray-700">
                        <span>Base Rental:</span>
                        <span className="text-gray-900">
                          AED {formatMoney(calc?.totalAmount || 0)}
                        </span>
                      </div>
                      {pickupReturnCharges.pickup > 0 && (
                        <div className="flex justify-between text-sm font-semibold text-gray-700">
                          <span>Pickup charge:</span>
                          <span className="text-gray-900">
                            AED {formatMoney(pickupReturnCharges.pickup)}
                          </span>
                        </div>
                      )}
                      {pickupReturnCharges.return > 0 && (
                        <div className="flex justify-between text-sm font-semibold text-gray-700">
                          <span>Return charge:</span>
                          <span className="text-gray-900">
                            AED {formatMoney(pickupReturnCharges.return)}
                          </span>
                        </div>
                      )}

                      {(depositFreeDailyFee > 0 || securityDeposit > 0) && (
                        <div className="flex justify-between text-sm font-semibold text-gray-700">
                          <span>
                            {isDepositFree
                              ? "Deposit-free fee"
                              : "Security Deposit"}
                          </span>

                          <span className="text-gray-900">
                            AED {formatMoney(depositAmount)}
                          </span>
                        </div>
                      )}
                      {addonsTotal > 0 && (
                        <div className="flex justify-between text-sm font-semibold text-gray-700">
                          <span>Add-ons:</span>
                          <span className="text-gray-900">
                            AED {formatMoney(addonsTotal)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-gray-900 pt-3 border-t border-gray-200">
                      <span>Total Price:</span>
                      <span>AED {formatMoney(frontendTotal)}</span>
                    </div>
                  </div>
                  <div className="mt-5 rounded-2xl border bg-gray-50 border-gray-200  p-4">
                    <h3 className="text-base font-extrabold text-gray-900 mb-3">
                      Agreement
                    </h3>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="mt-1 h-5 w-5 rounded border-gray-300 text-site-accent focus:ring-site-accent"
                      />
                      <div className="flex flex-col">
                        {/* Row 1 */}
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900">
                            I agree to the terms and conditions
                          </p>

                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                            i
                          </span>
                        </div>

                        {/* Row 2 */}
                        <p className="text-xs text-gray-500 mt-1">
                          I have reviewed the rental agreement and agree to all
                          stated terms and conditions
                        </p>
                      </div>
                    </label>
                    <div className="mt-4  border-t border-gray-200  p-3 flex gap-3">
                      <div className="text-yellow-500 text-lg">✍️</div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Physical Signature Required
                        </p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          A physical copy of this agreement must be signed upon
                          pickup or delivery of the vehicle. This digital
                          approval is for your convenience and does not replace
                          the physical signature requirement.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm font-bold text-site-accent">
                      <span>Pay Now</span>
                      <span>AED {formatMoney(frontendPayNow)}</span>
                    </div>
                       <div className="mt-4">
                    <label className="text-sm font-semibold text-gray-700">
                      Coupon Code
                    </label>

                    <div className="flex gap-2 mt-2">
                      <input
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        placeholder="Enter coupon"
                        className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold"
                      />

                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="rounded-xl bg-site-accent px-4 py-2 text-white text-sm font-bold"
                      >
                        {couponLoading ? "Applying..." : "Apply"}
                      </button>
                    </div>

                    {couponError && (
                      <p className="text-xs text-red-500 mt-1">{couponError}</p>
                    )}

                    {appliedCoupon && (
                      <p className="text-xs text-green-600 mt-1">
                        Coupon applied: −AED {appliedCoupon.discount}
                      </p>
                    )}
                  </div>
                    <div className="flex justify-between text-xs font-semibold text-gray-500">
                      <span>Pay later at handover</span>
                      <span className="text-gray-900 font-extrabold">
                        AED {formatMoney(frontendPayLater)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="border-t border-gray-200 bg-white p-2">
              {mobileStep === 1 && (
                <div className="px-4">
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="w-full rounded-full bg-gradient-to-r from-site-accent to-slate-teal py-3 text-white font-extrabold text-sm shadow-md"
                  >
                    Continue {startDate && endDate ? `(${rangeDays} days)` : ""}
                  </button>
                </div>
              )}
              {mobileStep === 2 && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileStep(1)}
                    className="w-1/2 rounded-full border border-gray-200 py-3 text-gray-800 font-extrabold text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-1/2 rounded-full  bg-gradient-to-r from-site-accent to-slate-teal py-3 text-white font-extrabold text-sm shadow-md"
                  >
                    Next
                  </button>
                </div>
              )}
              {mobileStep === 3 && (
            <div className="mt-1 flex gap-3 items-start">
              {/* ⬅️ Back button */}
              {!showStripe && (
                <button
                  type="button"
                  onClick={() => setMobileStep(2)}
                  className="w-1/2 rounded-full border border-gray-200 py-3
                            text-gray-800 font-extrabold text-sm"
                >
                  Back
                </button>
              )}

              {/* 💳 Confirm & Pay OR Stripe */}
              {!showStripe ? (
                <button
                  onClick={handleCreateBooking}
                  disabled={!agree || !canPayFinal || createLoading}
                  className={`w-1/2 rounded-full ${primaryBtn}`}
                >
                  {createLoading ? "Preparing payment..." : "Confirm & Pay"}
                </button>
              ) : (
                mounted &&
                clientSecret && (
                  <div
                    className="
                      w-full
                      max-h-[70vh]
                      overflow-y-auto
                      overscroll-contain
                      pb-6
                    "
                  >
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <StripeCheckoutInline
                        onSuccess={() => {
                          toast.success("Booking confirmed");

                          if (!createdBookingId) {
                            toast.error("Booking ID missing");
                            return;
                          }
                          router.push(`/payments/rental/${createdBookingId}`);
                        }}
                      />
                    </Elements>
                  </div>
                )
              )}
            </div>
              )}
            </div>
          </div>
        </div>
        {showDeliveryPolicy && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-gray-200 shadow-xl">
              <h2 className="text-lg font-semibold text-gray-700 text-center">
                Pickup Delivery Charges
              </h2>

              <div className="mt-5 space-y-3">
                {EMIRATES.map((city) => (
                  <div
                    key={city.id}
                    className="flex items-center justify-between"
                  >
                    <p className="text-sm font-semibold text-gray-700">
                      {city.name}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {" "}
                      AED {formatMoney(cityPickupCharges[city.id] || 0)}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowDeliveryPolicy(false)}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-site-accent to-slate-teal py-3 text-sm font-bold text-white shadow hover:opacity-95 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// function StripeCheckoutInline({ onSuccess }: { onSuccess: () => void }) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);

//   const handlePay = async () => {
//     if (!stripe || !elements) return;

//     setLoading(true);

//     const { error } = await stripe.confirmPayment({
//       elements,
//       redirect: "if_required",
//     });

//     if (error) {
//       toast.error(error.message || "Payment failed");
//     } else {
//       toast.success("Payment successful");
//       onSuccess();
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">
//       <PaymentElement />
//       <button
//         onClick={handlePay}
//         disabled={loading}
//         className="mt-4 w-full rounded-2xl bg-gradient-to-r from-site-accent to-slate-teal py-3 text-sm font-bold text-white"
//       >
//         {loading ? "Processing..." : "Pay Now"}
//       </button>
//     </div>
//   );
// }
// type StripeCheckoutInlineProps = {
//   onSuccess: () => void;
// };
type StripeCheckoutInlineProps = {
  onSuccess: () => void;
};

function StripeCheckoutInline({ onSuccess }: StripeCheckoutInlineProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      toast.success("Payment successful");
      onSuccess(); // ✅ tell parent only
    }

    setLoading(false);
  };

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">
      <PaymentElement />
      <button
        onClick={handlePay}
        disabled={loading}
        className="mt-4 w-full rounded-2xl bg-gradient-to-r from-site-accent to-slate-teal py-3 text-sm font-bold text-white"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}
