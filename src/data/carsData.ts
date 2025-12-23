export interface Car {
  id: number;
  brand: string;
  name: string;
  year: number;
  images: string[];
  dailyPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  location: string;
  seats: number;
  transmission: string;
  fuelType: string;
  engine?: string;
  mileage: string;
  rating: number;
  reviews: number;
  providerName: string;
  providerLogo: string;
  isVerified: boolean;
  description?: string;
  features?: string[];
  insuranceIncluded?: boolean;
  deposit?: number;
  vat?: number;
  type: string;
  bodyType: string;
  color: string;
  noDeposit: boolean;
}

export const carsData: Car[] = [
  {
    id: 1,
    name: "Huracán EVO",
    brand: "Lamborghini",
    year: 2023,
    dailyPrice: 4500,
    weeklyPrice: 28000,
    monthlyPrice: 95000,
    images: [
      "https://images.pexels.com/photos/2127037/pexels-photo-2127037.jpeg?auto=compress&cs=tinysrgb&w=1920",
      "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=1920",
      "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1920",
    ],
    rating: 4.9,
    reviews: 127,
    seats: 2,
    transmission: "Auto",
    mileage: "5,000 km",
    fuelType: "Petrol",
    engine: "5.2L V10",
    providerName: "Elite Motors UAE",
    providerLogo:
      "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=100",
    isVerified: true,
    type: "Sports",
    bodyType: "Coupe",
    color: "Yellow",
    location: "Dubai",
    noDeposit: true,
    description:
      "Experience the ultimate supercar with the Lamborghini Huracán EVO. This masterpiece of Italian engineering combines breathtaking performance with stunning design.",
    features: [
      "Carbon Ceramic Brakes",
      "Launch Control",
      "Apple CarPlay",
      "Premium Sound System",
      "Parking Sensors",
      "Rear Camera",
      "Sport Exhaust",
      "Adaptive Suspension",
    ],
    insuranceIncluded: true,
    deposit: 10000,
    vat: 5,
  },
  {
    id: 2,
    name: "F8 Tributo",
    brand: "Ferrari",
    year: 2023,
    dailyPrice: 4200,
    weeklyPrice: 26000,
    monthlyPrice: 89000,
    images: [
      "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=1920",
      "https://images.pexels.com/photos/2127037/pexels-photo-2127037.jpeg?auto=compress&cs=tinysrgb&w=1920",
      "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1920",
    ],
    rating: 4.8,
    reviews: 98,
    seats: 2,
    transmission: "Auto",
    mileage: "3,200 km",
    fuelType: "Petrol",
    engine: "3.9L V8 Twin-Turbo",
    providerName: "Prestige Rentals",
    providerLogo:
      "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=100",
    isVerified: true,
    type: "Sports",
    bodyType: "Coupe",
    color: "Red",
    location: "Dubai",
    noDeposit: true,
    description:
      "The Ferrari F8 Tributo is the new mid-rear-engined sports car that represents the highest expression of the Prancing Horse's classic two-seater berlinetta.",
    features: [
      "F1-Derived Technology",
      "Side Slip Control",
      "Apple CarPlay",
      "JBL Sound System",
      "Parking Camera",
      "Carbon Fiber Interior",
      "Sport Exhaust",
      "Adaptive Suspension",
    ],
    insuranceIncluded: true,
    deposit: 12000,
    vat: 5,
  },
  {
    id: 3,
    name: "911 Turbo S",
    brand: "Porsche",
    year: 2024,
    dailyPrice: 3200,
    weeklyPrice: 20000,
    monthlyPrice: 68000,
    images: [
      "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1920",
      "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=1920",
      "https://images.pexels.com/photos/2127037/pexels-photo-2127037.jpeg?auto=compress&cs=tinysrgb&w=1920",
    ],
    rating: 4.9,
    reviews: 156,
    seats: 4,
    transmission: "Auto",
    mileage: "8,500 km",
    fuelType: "Petrol",
    engine: "3.8L Twin-Turbo",
    providerName: "Dubai Luxury Cars",
    providerLogo:
      "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=100",
    isVerified: true,
    type: "Sports",
    bodyType: "Coupe",
    color: "Silver",
    location: "Abu Dhabi",
    noDeposit: true,
    description:
      "The Porsche 911 Turbo S delivers phenomenal performance with everyday usability. It's the perfect blend of luxury and speed.",
    features: [
      "PDK Transmission",
      "Sport Chrono Package",
      "PASM Suspension",
      "Bose Sound System",
      "360 Camera",
      "Leather Interior",
      "Sport Exhaust",
      "Launch Control",
    ],
    insuranceIncluded: true,
    deposit: 8000,
    vat: 5,
  },
  {
    id: 4,
    name: "Continental GT",
    brand: "Bentley",
    year: 2023,
    dailyPrice: 3800,
    weeklyPrice: 24000,
    monthlyPrice: 82000,
    images: [
      "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1920",
      "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1920",
      "https://images.pexels.com/photos/2127037/pexels-photo-2127037.jpeg?auto=compress&cs=tinysrgb&w=1920",
    ],
    rating: 4.7,
    reviews: 89,
    seats: 4,
    transmission: "Auto",
    mileage: "12,000 km",
    fuelType: "Petrol",
    engine: "6.0L W12",
    providerName: "Royal Rides",
    providerLogo:
      "https://images.pexels.com/photos/2127037/pexels-photo-2127037.jpeg?auto=compress&cs=tinysrgb&w=100",
    isVerified: false,
    type: "Luxury",
    bodyType: "Coupe",
    color: "Black",
    location: "Dubai",
    noDeposit: false,
    description:
      "The Bentley Continental GT combines breathtaking performance with handcrafted luxury. Every journey is an occasion.",
    features: [
      "Naim Audio System",
      "Massage Seats",
      "Heads-Up Display",
      "Night Vision",
      "Parking Assist",
      "Handcrafted Leather",
      "Wood Veneer",
      "Adaptive Cruise",
    ],
    insuranceIncluded: true,
    deposit: 15000,
    vat: 5,
  },
  {
    id: 5,
    name: "Phantom",
    brand: "Rolls-Royce",
    year: 2024,
    dailyPrice: 5500,
    weeklyPrice: 34000,
    monthlyPrice: 115000,
    images: [
      "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1920",
      "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1920",
      "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=1920",
    ],
    rating: 5.0,
    reviews: 67,
    seats: 5,
    transmission: "Auto",
    mileage: "2,100 km",
    fuelType: "Petrol",
    engine: "6.75L V12",
    providerName: "Elite Motors UAE",
    providerLogo:
      "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=100",
    isVerified: true,
    type: "Luxury",
    bodyType: "Sedan",
    color: "White",
    location: "Dubai",
    noDeposit: false,
    description:
      "The Rolls-Royce Phantom represents the pinnacle of automotive luxury. Unparalleled craftsmanship meets cutting-edge technology.",
    features: [
      "Bespoke Audio",
      "Starlight Headliner",
      "Massage Seats",
      "Rear Entertainment",
      "Champagne Cooler",
      "Handcrafted Interior",
      "Self-Closing Doors",
      "Magic Carpet Ride",
    ],
    insuranceIncluded: true,
    deposit: 20000,
    vat: 5,
  },
];
