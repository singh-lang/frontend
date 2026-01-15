"use client";

import { type CarTypes } from "@/types/homePageTypes";
import {
  CheckCircle,
  Coins,
  Gauge,
  RefreshCw,
  Shield,
  Truck,
} from "lucide-react";
import { useState } from "react";

interface PriceBlockProps {
  data: CarTypes;
  depositFreeDailyFee?: number; // 👈 add this
}

const PriceBlock = ({ data, depositFreeDailyFee = 0 }: PriceBlockProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");

  type Period = "daily" | "weekly" | "monthly";

  const getPriceForPeriod = () => {
    switch (selectedPeriod) {
      case "daily":
        return data?.rentPerDay ?? 0;
      case "weekly":
        return data?.rentPerWeek ?? 0;
      case "monthly":
        return data?.rentPerMonth ?? 0;
      default:
        return 0;
    }
  };
  const [useDepositFree, setUseDepositFree] = useState(false);

  // ✅ SAME LOGIC AS BOOKING PAGE
  const depositFreeFee = useDepositFree ? depositFreeDailyFee : 0;

  // ✅ Treat 0 or undefined as NO deposit, even if depositRequired is true
  const hasSecurityDeposit =
    !!data?.depositRequired && (data?.securityDeposit ?? 0) > 0;

  const getSecurityDeposit = () => {
    if (!hasSecurityDeposit) return 0;
    return data?.securityDeposit ?? 0;
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "daily":
        return "/day";
      case "weekly":
        return "/week";
      case "monthly":
        return "/month";
      default:
        return "";
    }
  };

  const baseRate = getPriceForPeriod();
  const deliveryFee = data?.deliveryCharges || 0;
  const securityDeposit = getSecurityDeposit();
  const estimatedTotal =
    baseRate + deliveryFee + (useDepositFree ? depositFreeDailyFee : 0);

  return (
    <>
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {(["daily", "weekly", "monthly"] as Period[]).map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-site-accent focus:ring-offset-2 ${
              selectedPeriod === period
                ? "bg-gradient-to-r from-site-accent to-slate-teal text-white shadow-lg"
                : "bg-soft-grey/20 text-dark-base hover:bg-soft-grey/30"
            }`}
            role="tab"
            aria-selected={selectedPeriod === period}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* LEFT CARD: Price breakdown */}
        <div className="relative bg-gradient-to-br from-off-white to-white border border-soft-grey/20 rounded-xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-sm text-grey font-medium mb-1">
                Rental Rate
              </div>
              <div className="text-3xl font-bold text-dark-base">
                AED {baseRate.toLocaleString()}
                <span className="text-base text-grey font-normal ml-2">
                  {getPeriodLabel()}
                </span>
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 bg-site-accent/10 text-site-accent px-3 py-1.5 rounded-bl-xl rounded-tr-xl text-xs font-bold border-l border-b border-site-accent/20">
            BEST RATE
          </div>

          <div className="mt-4 pt-4 border-t border-soft-grey/20">
            <div className="text-xs font-semibold text-dark-base mb-2">
              Price Breakdown
            </div>
            {/* DEPOSIT-FREE TOGGLE — ADD HERE */}
            {hasSecurityDeposit && depositFreeDailyFee > 0 && (
              <div className="mt-4 mb-3 flex items-center justify-between rounded-xl bg-soft-grey/20 p-3">
                <div>
                  <p className="text-sm font-semibold text-dark-base">
                    Deposit-Free Option
                  </p>
                  <p className="text-xs text-grey">
                    Pay AED {depositFreeDailyFee} instead of blocking deposit
                  </p>
                </div>

                <button
                  onClick={() => setUseDepositFree((v) => !v)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    useDepositFree ? "bg-site-accent" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      useDepositFree ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
            )}

            <div className="space-y-1.5 text-xs text-grey">
              <div className="flex justify-between">
                <span>Base Rate</span>
                <span className="font-semibold text-dark-base">
                  AED {baseRate.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Insurance</span>
                <span className="font-semibold text-success">Included</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-dark-base">
                  {deliveryFee > 0
                    ? `AED ${deliveryFee.toLocaleString()}`
                    : "Free"}
                </span>
              </div>

              <div className="flex justify-between pt-2 border-t border-soft-grey/20 font-bold text-dark-base">
                <span>Rental Total</span>
                <span>AED {estimatedTotal.toLocaleString()}</span>
              </div>

              {/* ✅ Only show Security Deposit row if deposit > 0 */}
              {hasSecurityDeposit && (
                <div className="flex justify-between pt-2 mt-2 border-t-2 border-warning/30 bg-warning/5 -mx-5 px-5 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-warning" />
                    <span className="font-bold text-warning">
                      {useDepositFree ? "Deposit-Free Fee" : "Security Deposit"}
                      {!useDepositFree && (
                        <span className="text-[10px] font-normal ml-1">
                          (refundable)
                        </span>
                      )}
                    </span>
                  </div>

                  <span className="font-bold text-warning text-sm">
                    {useDepositFree
                      ? `AED ${depositFreeDailyFee}`
                      : `AED ${securityDeposit.toLocaleString()}`}
                  </span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t-2 border-dark-base/20 bg-slate-teal/5 -mx-5 px-5 py-3 -mb-4 rounded-b-xl">
                <span className="font-bold text-dark-base text-sm">
                  Estimated Rental Cost
                </span>
                <span className="font-bold text-dark-base text-base">
                  AED {estimatedTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CARD: Included mileage & extra costs */}
        <div className="bg-gradient-to-br from-site-accent/5 to-slate-teal/5 border border-site-accent/20 rounded-xl p-5">
          <div className="text-sm font-semibold text-dark-base mb-4">
            Included Mileage & Rates
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center">
                  <Gauge className="w-4 h-4 text-site-accent" />
                </div>
                <div>
                  <div className="text-xs text-grey">Included Mileage</div>
                  <div className="text-sm font-bold text-dark-base">
                    {selectedPeriod === "daily" &&
                      `${data?.car?.dailyMileage || 250} km/day`}
                    {selectedPeriod === "weekly" &&
                      `${data?.car?.weeklyMileage || 1500} km/week`}
                    {selectedPeriod === "monthly" &&
                      `${data?.car?.monthlyMileage || 5000} km/month`}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-slate-teal" />
                </div>
                <div>
                  <div className="text-xs text-grey">Extra Mileage Rate</div>
                  <div className="text-sm font-bold text-dark-base">
                    {data?.extraMileageRate
                      ? `AED ${data.extraMileageRate}/km`
                      : "Contact vendor"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-site-accent/20">
            <div className="text-sm font-semibold text-dark-base mb-4">
              Additional Costs
            </div>

            <div className="space-y-3">
              {data?.tollCharges && data?.tollCharges > 0 && (
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center flex-shrink-0">
                      <Coins className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <div className="text-xs text-grey">Toll Charges</div>
                      <div className="text-sm font-bold text-dark-base">
                        AED {data.tollCharges}/toll
                      </div>
                      <div className="text-[10px] text-grey mt-0.5">
                        Paid at rental end
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ✅ “No deposit” & “Free delivery” badges */}
          {(!hasSecurityDeposit ||
            (data?.deliveryCharges !== undefined &&
              data.deliveryCharges === 0)) && (
            <div className="pt-3 border-t border-site-accent/20 space-y-2.5">
              {!hasSecurityDeposit && (
                <div className="flex items-center gap-2 bg-success/10 -mx-5 px-5 py-3 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <div className="text-xs font-semibold text-success">
                    No Security Deposit Required
                  </div>
                </div>
              )}

              {data?.deliveryCharges !== undefined &&
                data.deliveryCharges === 0 && (
                  <div className="flex items-center gap-2 bg-success/10 -mx-5 px-5 py-3 rounded-lg">
                    <Truck className="w-5 h-5 text-success flex-shrink-0" />
                    <div className="text-xs font-semibold text-success">
                      Free Delivery
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PriceBlock;
