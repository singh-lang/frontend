"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import CategoryCard from "./CategoryCard";
import { useEffect, useRef, useState } from "react";
import { type CarTypes } from "@/types/homePageTypes";

interface CategoriesProps {
  data: [
    {
      _id: string;
      name: string;
      cars: CarTypes[];
      totalCars: number;
    }
  ];
}

const categories = [
  {
    name: "Luxury Cars",
    description: "Experience ultimate sophistication",
    count: "120+ Cars",
    image:
      "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800",
    link: "#",
  },
  {
    name: "Sports Cars",
    description: "Unleash pure performance",
    count: "60+ Cars",
    image:
      "https://images.pexels.com/photos/2127037/pexels-photo-2127037.jpeg?auto=compress&cs=tinysrgb&w=800",
    link: "#",
  },
  {
    name: "SUVs",
    description: "Space meets luxury",
    count: "95+ Cars",
    image:
      "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=800",
    link: "#",
  },
  {
    name: "Premium Sedans",
    description: "Elegance in every detail",
    count: "80+ Cars",
    image:
      "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800",
    link: "#",
  },
  {
    name: "Luxury Cars",
    description: "Experience ultimate sophistication",
    count: "120+ Cars",
    image:
      "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800",
    link: "#",
  },
  {
    name: "Sports Cars",
    description: "Unleash pure performance",
    count: "60+ Cars",
    image:
      "https://images.pexels.com/photos/2127037/pexels-photo-2127037.jpeg?auto=compress&cs=tinysrgb&w=800",
    link: "#",
  },
  {
    name: "SUVs",
    description: "Space meets luxury",
    count: "95+ Cars",
    image:
      "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=800",
    link: "#",
  },
];

const CategoriesSection = ({ data }: CategoriesProps) => {
  const [
    ,
    // scrollPosition
    setScrollPosition,
  ] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const carouselSectionRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (typeof window === "undefined" || !carouselSectionRef.current) return;

    const scrollAmount = window.innerWidth < 640 ? window.innerWidth - 8 : 305;
    const newPosition =
      direction === "left"
        ? carouselSectionRef.current.scrollLeft - scrollAmount
        : carouselSectionRef.current.scrollLeft + scrollAmount;

    carouselSectionRef.current.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
  };

  // keep track of scroll state
  useEffect(() => {
    const el = carouselSectionRef.current;
    if (!el) return;

    const handleScroll = () => {
      setScrollPosition(el.scrollLeft);

      // check if at start
      setIsAtStart(el.scrollLeft <= 0);

      // check if at end
      const maxScroll = el.scrollWidth - el.clientWidth;
      setIsAtEnd(el.scrollLeft >= maxScroll - 2); // add a small buffer
    };

    // fire once on mount in case it's already scrolled
    handleScroll();

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="absolute top-20 right-0 w-96 h-96 bg-slate-teal/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center animate-slide-up">
          <span className="text-site-accent font-bold text-xs uppercase tracking-wider mb-2 block">
            Explore Our Collection
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-dark-base mb-4 tracking-tight leading-tight">
            Browse by Category
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-grey mx-auto">
            Find the perfect vehicle from our curated collection of premium
            automobiles
          </p>
        </div>

        <div className="flex justify-end gap-3 animate-fade-in mb-10">
          <button
            onClick={() => scroll("left")}
            disabled={isAtStart}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl  text-slate-teal bg-[#fff]
            ${
              isAtStart
                ? "opacity-50 !cursor-not-allowed"
                : `hover:bg-site-accent hover:text-white hover:shadow-xl hover:scale-110`
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={isAtEnd}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl  text-slate-teal bg-[#fff]
              ${
                isAtEnd
                  ? "opacity-50 !cursor-not-allowed"
                  : `hover:bg-site-accent hover:text-white hover:shadow-xl hover:scale-110`
              }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div
          ref={carouselSectionRef}
          //   className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {data.map((category, index) => {
            const image = categories[index]?.image;
            return (
              <CategoryCard
                key={index}
                category={category}
                image={image}
                index={index}
              />
            );
          })}
        </div>

        <div className="mt-8 text-center animate-fade-in">
          <Link
            href="catalog/all/cars"
            className="inline-flex items-center gap-2  bg-gradient-to-r from-site-accent to-slate-teal  text-white px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-xl hover:scale-105 group"
          >
            <span>View All Vehicles</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default CategoriesSection;
