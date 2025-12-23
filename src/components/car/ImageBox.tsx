"use client";

import { type CarTypes } from "@/types/homePageTypes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageBoxProps {
  data: CarTypes;
}

const ImageBox = ({ data }: ImageBoxProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? data?.car?.images?.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === data?.car?.images?.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      {/* Removed background + auto-fit images */}
      <div className="relative rounded-xl overflow-hidden mb-3 bg-transparent">
        <div className="relative w-full flex items-center justify-center bg-transparent">
          <Image
            src={
              data?.car?.images?.[currentImageIndex]?.url ||
              "/car_placeholder.png"
            }
            alt={`${data?.car?.carBrand?.name} ${data?.title}` || "car image"}
            className="w-full h-auto max-h-[500px] object-contain bg-transparent transition-all duration-300"
            loading="eager"
            width={100}
            height={50}
            unoptimized
          />

          {/* Prev Button */}
          <button
            onClick={handlePrevImage}
            aria-label="Previous image"
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 md:w-10 h-8 md:h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-dark-base hover:bg-site-accent hover:text-white transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-site-accent focus:ring-offset-2"
          >
            <ChevronLeft className="w-4 md:w-5 h-4 md:h-5" />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNextImage}
            aria-label="Next image"
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 md:w-10 h-8 md:h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-dark-base hover:bg-site-accent hover:text-white transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-site-accent focus:ring-offset-2"
          >
            <ChevronRight className="w-4 md:w-5 h-4 md:h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 md:bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {data?.car?.images?.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                aria-label={`View image ${idx + 1}`}
                className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ${
                  idx === currentImageIndex
                    ? "bg-site-accent w-6 md:w-8"
                    : "bg-white/70 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-thin scrollbar-thumb-soft-grey scrollbar-track-transparent">
        {data?.car?.images?.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImageIndex(idx)}
            className={`relative flex-shrink-0 w-16 md:w-20 h-12 md:h-16 rounded-lg overflow-hidden group transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-site-accent focus:ring-offset-2 ${
              currentImageIndex === idx
                ? "ring-2 ring-site-accent"
                : "ring-2 ring-transparent"
            }`}
            aria-label={`Thumbnail ${idx + 1}`}
          >
            <Image
              src={img?.url}
              alt={`View ${idx + 1}`}
              className="w-full h-full object-cover bg-transparent"
              loading="lazy"
              width={100}
              height={100}
              unoptimized
            />
            <div
              className={`absolute inset-0 transition-opacity ${
                currentImageIndex === idx
                  ? "bg-site-accent/30 opacity-100"
                  : "bg-dark-base/20 opacity-0 group-hover:opacity-100"
              }`}
            />
          </button>
        ))}
      </div>
    </>
  );
};

export default ImageBox;
