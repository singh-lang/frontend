export interface CarTypes {
  addons: boolean;
  _id: string;
  vendor: {
    _id: string;
      name?: string;
    email?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      mapUrl?: string;
    };
   

    profilePicture: {
      url: string;
    };
    vendorDetails: {
      contact: {
        whatsappNum: string;
        landlineNum: string;
        mobileNum: string;
      };
      businessName: string;
      stripeOnboardingCompleted: boolean;
    };
  };
  rentPerDay: number;
  rentPerWeek: number;
  rentPerMonth: number;
  // ✅ OFFER PRICES (NEW)
  offerRentPerDay?: number | null;
  offerRentPerWeek?: number | null;
  offerRentPerMonth?: number | null;

  extraMileageRate: number;
  title: string;
  description: string;
  deliveryCharges: number;
  securityDeposit: number;
  tollCharges: number;
  depositRequired: boolean;
  minRentalDays: number;
  isPremium: boolean;
  location: string;
  car: {
    airBags: string;
    regionalSpecs: string;
    warranty: string;
    extraKmCharge: number;
    carModel: string;
    carTrim: string;
    bodyType: string;
    doors: string;
    interiorColor: string;
    exteriorColor: string;
    carBrand: {
      name: string;
      logo: {
        url: string;
      };
    };
    category: string;
    tankCapacity: number;
    transmission: string;
    seatingCapacity: number;
    carInsurance: string;
    dailyMileage: number;
    weeklyMileage: number;
    monthlyMileage: number;

    modelYear: number;
    mileage: number;
    horsePower: number;
    fuelType: string;
    techFeatures: string[];
    otherFeatures: string[];
    coverImage: { url: string };
    images: [{ url: string }];
  };
}

export interface Car {
  id: number;
  name: string;
  brand: string;
  dailyPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  image: string;
  rating: number;
  reviews: number;
  seats: number;
  transmission: string;
  providerName: string;
  providerLogo: string;
  isVerified: boolean;
}
