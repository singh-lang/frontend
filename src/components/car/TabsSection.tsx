"use client";

// import { useAuth } from "@/contexts/AuthContext";
import { type CarTypes } from "@/types/homePageTypes";
import { Check, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TabsSectionProps {
  car: CarTypes;
  headerHeight: number;
}

const TabsSection = ({ car, headerHeight }: TabsSectionProps) => {
  //   const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isTabBarSticky, setIsTabBarSticky] = useState(false);
  //   const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  const tabBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (tabBarRef.current) {
        const rect = tabBarRef.current.getBoundingClientRect();
        setIsTabBarSticky(rect.top <= headerHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headerHeight]);

  return (
    <>
      <div className="mb-12">
        <div
          ref={tabBarRef}
          className={`${
            isTabBarSticky
              ? "sticky bg-white/95 backdrop-blur-md shadow-md border-b border-soft-grey/20 -mx-4 md:-mx-6 px-4 md:px-6"
              : "border-b border-soft-grey/20"
          } mb-8 transition-all`}
          style={{
            top: isTabBarSticky ? `${headerHeight}px` : "auto",
            zIndex: 40,
          }}
          role="tablist"
        >
          <div className="flex gap-8 overflow-x-auto py-4">
            {["overview", "specs", "reviews", "faqs"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-bold uppercase tracking-wide relative whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-site-accent focus:ring-offset-2 rounded ${
                  activeTab === tab
                    ? "text-site-accent"
                    : "text-grey hover:text-dark-base"
                }`}
                role="tab"
                aria-selected={activeTab === tab}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-site-accent to-slate-teal rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="animate-[fadeIn_0.3s_ease-out]">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <p className="text-grey leading-relaxed text-lg">
                {car?.description ||
                  "Experience luxury and performance with this exceptional vehicle."}
              </p>
              <div>
                <h3 className="text-2xl font-bold text-dark-base mb-6">
                  Technical Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(car?.car?.techFeatures || []).map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-grey bg-white p-4 rounded-xl shadow-sm border border-soft-grey/20"
                    >
                      <Check className="w-5 h-5 text-site-accent flex-shrink-0" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-dark-base mb-6">
                  Other Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(car?.car?.otherFeatures || []).map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-grey bg-white p-4 rounded-xl shadow-sm border border-soft-grey/20"
                    >
                      <Check className="w-5 h-5 text-site-accent flex-shrink-0" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="bg-white rounded-2xl p-6 shadow-md border border-soft-grey/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  ["Year", car?.car?.modelYear],
                  ["Seats", car?.car?.seatingCapacity],
                  ["Transmission", car?.car?.transmission],
                  ["Fuel Type", car?.car?.fuelType],
                  ["Engine", car?.car?.horsePower],
                ].map(([label, value], idx) => (
                  <div
                    key={idx}
                    className="flex justify-between py-4 border-b border-soft-grey/20 last:border-0"
                  >
                    <span className="text-grey font-medium">{label}</span>
                    <span className="text-dark-base font-bold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="bg-white rounded-2xl shadow-md border border-soft-grey/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-dark-base">
                  Customer Reviews
                </h3>
                {/* {isAuthenticated ? (
        <button
          onClick={() => setShowLeaveReview(true)}
          className="px-4 py-2 bg-gradient-to-r from-site-accent to-slate-teal text-white font-semibold rounded-lg hover:shadow-lg transition-all"
        >
          Leave a Review
        </button>
      ) : (
        <button
          onClick={() => setShowSignInPrompt(true)}
          className="px-4 py-2 bg-gradient-to-r from-site-accent to-slate-teal text-white font-semibold rounded-lg hover:shadow-lg transition-all"
        >
          Sign In to Review
        </button>
      )} */}
              </div>

              <div className="space-y-6">
                <div className="text-center text-grey py-8">
                  <Star className="w-8 h-8 mx-auto mb-2 text-site-accent" />
                  <p className="text-sm">
                    No reviews yet. Be the first to leave one!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "faqs" && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-soft-grey/20">
              <p className="text-grey text-lg">FAQs coming soon</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TabsSection;
