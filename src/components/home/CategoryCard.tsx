import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CarTypes } from "@/types/homePageTypes";

interface CategoryCardProps {
  // category: {
  //   link: string;
  //   image: string;
  //   count: string;
  //   name: string;
  //   description: string;
  // };
  category: {
    _id: string;
    name: string;
    cars: CarTypes[];
    totalCars: number;
  };
  image: string;
  
  index: number;
}

const CategoryCard = ({ category,  image, index }: CategoryCardProps) => {
  const getCarCountLabel = (totalCars: number): string => {
    if (totalCars === 0) return "0";

    const thresholds = [
      2, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
      95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150,
    ];

    // If totalCars is less than the first threshold
    if (totalCars < thresholds[0]) return `${thresholds[0]}+`;

    // Find the largest threshold less than or equal to totalCars
    const matched = thresholds.filter((t) => totalCars >= t).pop();

    // If totalCars exceeds all thresholds
    if (totalCars > thresholds[thresholds.length - 1]) {
      return `${thresholds[thresholds.length - 1]}+`;
    }

    return `${matched}+`;
  };

  return (
    <Link
      href={`catalog/categories/${category._id}`}
      className="flex-shrink-0 group relative h-[280px] sm:h-[320px] lg:h-[360px] w-[250px] sm:w-[285px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] animate-scale-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{
          backgroundImage: `url(${image})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-dark-base/80 to-dark-base/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-teal/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative h-full flex flex-col justify-between p-6">
        <div className="flex justify-end">
         
        </div>

        <div className="transform transition-all duration-500 group-hover:-translate-y-2">
          <div className="min-h-[50px]">
            <div className="inline-block px-3 py-1 bg-gradient-to-r from-site-accent to-slate-teal backdrop-blur-sm rounded-full text-white text-xs font-semibold mb-4">
              {`${getCarCountLabel(category.totalCars)} Cars`}
            </div>
          <h3 className="text-lg sm:text-2xl font-bold text-white mb-3 leading-tight">
          {category.name}
        </h3>

            {/* <p className="text-white/90 text-base mb-4 font-medium">
              {category.description}
            </p> */}
          </div>
          <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all duration-300">
            <span className="text-sm">Explore Collection</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-slate-teal to-site-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </Link>
  );
};

export default CategoryCard;
