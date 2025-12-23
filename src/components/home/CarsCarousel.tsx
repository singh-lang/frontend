"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import CarCard from "./CarCard";
import { type CarTypes } from "@/types/homePageTypes";
import Link from "next/link";

interface Cars {
  cars: CarTypes[];
  sectionTypeTitle?: boolean;
  sectionName: string;
  sectionId: string | number;
  sectionTitle: string;
  sectionDescription: string;
  bg?: string;
  buttonsColor: string;
}

export default function CarsCarousel({
  cars,
  sectionTypeTitle = false,
  sectionName,
  sectionId,
  sectionTitle,
  sectionDescription,
  // bg = "#fff",
  buttonsColor = "#fff",
}: Cars) {
  const [
    ,
    // scrollPosition
    setScrollPosition,
  ] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const carouselSectionRef = useRef<HTMLDivElement>(null);

  //   const scroll = (direction: "left" | "right") => {
  //     if (carouselSectionRef) {
  //       const scrollAmount = 420;
  //       const newPosition =
  //         direction === "left"
  //           ? scrollPosition - scrollAmount
  //           : scrollPosition + scrollAmount;

  //       carouselSectionRef.current?.scrollTo({
  //         left: newPosition,
  //         behavior: "smooth",
  //       });
  //       setScrollPosition(newPosition);
  //     }
  //   };

  //   const scroll = (direction: "left" | "right") => {
  //     if (!carouselSectionRef.current) return;

  //     const scrollAmount = 420;
  //     const newPosition =
  //       direction === "left"
  //         ? carouselSectionRef.current.scrollLeft - scrollAmount
  //         : carouselSectionRef.current.scrollLeft + scrollAmount;

  //     carouselSectionRef.current.scrollTo({
  //       left: newPosition,
  //       behavior: "smooth",
  //     });
  //   };

  const scroll = (direction: "left" | "right") => {
    if (typeof window === "undefined" || !carouselSectionRef.current) return;

    const scrollAmount = window.innerWidth < 640 ? window.innerWidth - 8 : 360;
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
      {sectionTypeTitle && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-teal/5 via-transparent to-transparent"></div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-6">
          {/* <div className="animate-slide-up">
            {sectionTypeTitle && (
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-teal to-slate-teal/80 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-slate-teal font-bold text-sm uppercase tracking-wider">
                  Premium Selection
                </span>
              </div>
            )}
            <h2
              className={`text-4xl ${
                sectionTypeTitle ? "lg:text-5xl" : ""
              } font-bold text-dark-base mb-3`}
            >
              {sectionTitle}
            </h2>
            <p
              className={`${
                sectionTypeTitle ? "text-grey" : "text-site-secondary"
              } text-lg max-w-2xl`}
            >
              {sectionDescription}
            </p>
          </div> */}
          <div className="animate-slide-up">
            {sectionTypeTitle && (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-site-accent to-slate-teal rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-site-accent font-bold text-xs uppercase tracking-wider">
                  Premium Selection
                </span>
              </div>
            )}
            <h2 className={"text-3xl font-bold  text-dark-base lg:text-4xl"}>
              {sectionTitle}
            </h2>
            <p className="text-grey text-base max-w-2xl">
              {sectionDescription}
            </p>
          </div>
          <div className="flex ml-auto gap-3 animate-fade-in">
            <button
              onClick={() => scroll("left")}
              disabled={isAtStart}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl  text-slate-teal ${
                buttonsColor == "#fff" ? "bg-[#fff]" : "bg-[#efeeea]"
              } ${
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
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl  text-slate-teal ${
                buttonsColor == "#fff" ? "bg-[#fff]" : "bg-[#efeeea]"
              } ${
                isAtEnd
                  ? "opacity-50 !cursor-not-allowed"
                  : `hover:bg-site-accent hover:text-white hover:shadow-xl hover:scale-110`
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div
          ref={carouselSectionRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {cars.map((car, index) => (
            // <div
            //   key={car.id}
            //   className="animate-slide-up w-full"
            //   style={{ animationDelay: `${index * 0.1}s` }}
            // >
            <CarCard key={index} car={car} />
            // </div>
          ))}
        </div>

        <div className="mt-8 text-center animate-fade-in">
          <Link
            href={`catalog/${sectionName}/${sectionId}`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-site-accent to-slate-teal hover:bg-slate-teal/90 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-xl hover:scale-105 group"
            prefetch={false}
          >
            <span>View All Cars</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </>
  );
}
