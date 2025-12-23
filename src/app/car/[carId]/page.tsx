import {
  Star,
  Shield,
  MapPin,
  Clock,
  Users,
  Gauge,
  Fuel,
  Zap,
  CreditCard,
  RefreshCw,
  Headphones as HeadphonesIcon,
} from "lucide-react";
import CatalogHeader from "@/components/catalogue/CatalogHeader";
import VerifiedBadge from "@/components/home/VerifiedBadge";
import ImageBox from "@/components/car/ImageBox";
import PriceBlock from "@/components/car/PriceBlock";
import Image from "next/image";
import TabsSection from "@/components/car/TabsSection";
import ButtonsSection from "@/components/car/ButtonsSection";
import Link from "next/link";
import { getCar } from "@/lib/api/car";
import { getFilterMasterData } from "@/lib/api/catalog";
// import SignInPrompt from "../components/auth/SignInPrompt";
// import AuthModal from "../components/auth/AuthModal";
// import ProfileSetup from "../components/auth/ProfileSetup";
// import DateSelectionModal from "../components/booking/DateSelectionModal";
// import PDFPreviewModal from "../components/booking/PDFPreviewModal";
// import BookingSuccessModal from "../components/booking/BookingSuccessModal";
// import LeaveReview from "../components/shared/LeaveReview";

interface ParamProps {
  params: { carId: string };
}

const HEADER_HEIGHT = 128;

const CarDetail = async ({ params }: ParamProps) => {
  const urlParam = await params;

  const car = await getCar(urlParam.carId);
  const headerData = await getFilterMasterData();

  console.log("page:car", car);

  // const [isTabBarSticky, setIsTabBarSticky] = useState(false);

  // const [showLeaveReview, setShowLeaveReview] = useState(false);

  return (
    <div className="min-h-screen bg-off-white">
      <CatalogHeader data={headerData?.data} />
      <div
        className="max-w-7xl mx-auto px-4 md:px-6 pt-4 md:pt-5"
        style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }}
      >
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
            <span className="text-accent font-semibold text-base md:text-lg">
              {car?.data?.car?.carBrand?.name}
            </span>
            <span className="text-grey">·</span>
            <span className="text-dark-base text-base md:text-lg">
              {car?.data?.car?.modelYear}
            </span>
            {/* {car.isVerified && ( */}
            <div className="flex items-center gap-1.5 bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20">
              <VerifiedBadge className="w-3.5 h-3.5" />
              <span className="text-xs text-dark-base font-semibold">
                Verified
              </span>
            </div>
            {/* )} */}
            <div className="flex items-center gap-1 md:gap-1.5 ml-auto">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-dark-base text-sm md:text-base font-bold">
                4.7
              </span>
              {/* <span className="text-grey text-xs md:text-sm">
                ({car.reviews})
              </span> */}
            </div>
          </div>

          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-base mb-4 leading-tight"
            style={{ fontFamily: "Stretch Pro, sans-serif" }}
          >
            {car?.data?.title}
          </h1>
        </div>

        <ImageBox data={car?.data} />

        <div className="bg-white rounded-2xl p-6 mb-8 border border-soft-grey/20 shadow-lg">
          <h3 className="text-xl font-bold text-dark-base mb-6">
            Rental Pricing
          </h3>

          <PriceBlock data={car?.data} />
          <ButtonsSection car={car?.data} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {[
            {
              icon: Users,
              label: "Seats",
              value: car?.data?.car?.seatingCapacity,
            },
            {
              icon: Gauge,
              label: "Transmission",
              value: car?.data?.car?.transmission,
            },
            { icon: Fuel, label: "Fuel Type", value: car?.data?.car?.fuelType },
            {
              icon: Zap,
              label: "Engine",
              value: car?.data?.car?.horsePower || "N/A",
            },
            { icon: Shield, label: "Insurance", value: "Included" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-5 flex flex-col items-center text-center gap-3 group hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg border border-soft-grey/20"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/10 via-slate-teal/15 to-slate-teal/10 flex items-center justify-center group-hover:from-accent/20 group-hover:to-slate-teal/20 transition-all">
                <item.icon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-xs text-grey font-medium mb-1">
                  {item.label}
                </div>
                <div className="text-sm font-bold text-dark-base">
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 mb-12 shadow-md border border-soft-grey/20">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Image
              src={
                car?.data?.vendor?.profilePicture?.url ||
                "/assets/car_placeholder.png"
              }
              alt={
                car?.data?.vendor?.vendorDetails?.businessName ||
                "vendor profile"
              }
              className="w-24 h-24 rounded-xl object-cover shadow-md border border-soft-grey/30"
              width={100}
              height={100}
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl font-bold text-dark-base">
                  {car?.data?.vendor?.vendorDetails?.businessName}
                </h3>
                {/* {car.isVerified && ( */}
                <div className="flex items-center gap-1.5 bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
                  <VerifiedBadge className="w-4 h-4" />
                  <span className="text-xs text-dark-base font-semibold">
                    Verified
                  </span>
                </div>
                {/* )} */}
              </div>
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(4.7)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-soft-grey"
                      }`}
                    />
                  ))}
                </div>
                {/* <span className="text-sm text-grey font-medium">
                  ({car.reviews} reviews)
                </span> */}
              </div>
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2 text-sm text-grey">
                  <Clock className="w-5 h-5 text-accent" />
                  <span>Responds in ~2 hours</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-grey">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span>Free delivery available</span>
                </div>
              </div>
              <Link
                href={`/catalog/vendor-cars/${car?.data?.vendor?._id}`}
                className="px-6 py-3 border-2 border-site-accent text-site-accent rounded-xl font-semibold hover:bg-site-accent hover:text-white transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                View all vendor cars
              </Link>
            </div>
          </div>
        </div>

        <TabsSection car={car?.data} headerHeight={HEADER_HEIGHT} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 py-12 border-y border-soft-grey/20">
          {[
            { icon: CreditCard, label: "Secure Payments" },
            { icon: RefreshCw, label: "Smart Compare" },
            { icon: HeadphonesIcon, label: "24/7 Support" },
            { icon: Shield, label: "Insurance Included" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/10 via-slate-teal/15 to-slate-teal/10 flex items-center justify-center shadow-md">
                <item.icon className="w-8 h-8 text-accent" />
              </div>
              <span className="text-sm text-dark-base font-semibold">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Similar Cars Div */}

        {/* <div className="pb-16">
          <h2
            className="text-3xl md:text-4xl font-bold text-dark-base mb-8"
            style={{ fontFamily: "Stretch Pro, sans-serif" }}
          >
            Similar Cars You May Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {carsData
              .filter((c) => c.id !== car.id)
              .slice(0, 3)
              .map((similarCar) => (
                <Link
                  key={similarCar.id}
                  href={`/car/${similarCar.id}`}
                  className="bg-white rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-soft-grey/20"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={similarCar.images[0].url}
                      alt={`${similarCar.brand} ${similarCar.name}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-dark-base mb-3">
                      {similarCar.brand} {similarCar.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold text-accent">
                        AED {similarCar.dailyPrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-grey">/day</span>
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-accent to-slate-teal text-white rounded-xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      View Details
                    </button>
                  </div>
                </Link>
              ))}
          </div>
        </div> */}
      </div>

      {/* 

      {showLeaveReview && car && (
        <LeaveReview
          carName={`${car.brand} ${car.name}`}
          onSubmit={handleReviewSubmit}
          onClose={() => setShowLeaveReview(false)}
        />
      )} */}
    </div>
  );
};

export default CarDetail;
