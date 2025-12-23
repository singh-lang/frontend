"use client";

import React, { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface Brand {
  _id: string;
  name: string;
  logo: { url: string };
}

interface BrandCarouselProps {
  data: Brand[];
  speed?: number; // px per second
}

const BrandCarousel = ({ data, speed = 60 }: BrandCarouselProps) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const resumeTimeoutRef = useRef<number | null>(null);

  // We'll render the data 3x to create a seamless loop
  const repeated = [...data, ...data, ...data];

  // Auto-scroll frame
  const step = useCallback(
    (timestamp: number) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      if (isPausedRef.current) {
        lastTimestampRef.current = timestamp;
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      if (lastTimestampRef.current == null)
        lastTimestampRef.current = timestamp;
      const dt = (timestamp - lastTimestampRef.current) / 1000; // seconds
      lastTimestampRef.current = timestamp;

      // move by speed px/sec
      scroller.scrollLeft += speed * dt;

      // when we've scrolled past one full data length (the first chunk),
      // reset back by original width to create a seamless loop.
      const singleWidth = scroller.scrollWidth / 3;
      if (scroller.scrollLeft >= singleWidth * 2) {
        // jump back by singleWidth
        scroller.scrollLeft -= singleWidth;
      }

      rafRef.current = requestAnimationFrame(step);
    },
    [speed]
  );

  useEffect(() => {
    // Start the loop
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resumeTimeoutRef.current)
        window.clearTimeout(resumeTimeoutRef.current);
    };
  }, [step]);

  // Pause helpers
  const pause = useCallback(() => {
    isPausedRef.current = true;
    // clear previous resume timer
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, []);

  const resume = useCallback(() => {
    // resume after short delay to avoid immediate autoplay fight with user
    if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = window.setTimeout(() => {
      isPausedRef.current = false;
    }, 500); // 500ms after interaction finishes
  }, []);

  // When user starts interacting (pointer/touch), pause; on end, resume
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // pointer events
    const onPointerDown = () => pause();
    const onPointerUp = () => resume();
    const onPointerCancel = () => resume();

    // mouse hover
    const onMouseEnter = () => pause();
    const onMouseLeave = () => resume();

    // wheel should pause for a bit
    const onWheel = () => {
      pause();
      // resume after a short delay
      if (resumeTimeoutRef.current)
        window.clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = window.setTimeout(() => {
        isPausedRef.current = false;
      }, 700);
    };

    scroller.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    scroller.addEventListener("pointercancel", onPointerCancel);

    scroller.addEventListener("mouseenter", onMouseEnter);
    scroller.addEventListener("mouseleave", onMouseLeave);

    scroller.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      scroller.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      scroller.removeEventListener("pointercancel", onPointerCancel);

      scroller.removeEventListener("mouseenter", onMouseEnter);
      scroller.removeEventListener("mouseleave", onMouseLeave);

      scroller.removeEventListener("wheel", onWheel);
    };
  }, [pause, resume]);

  // Optional: on mount, position scroll to the first chunk (so we can scroll forward/back seamlessly)
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const singleWidth = scroller.scrollWidth / 3;
    // set to the start of the middle chunk so users can scroll backward a bit as well
    scroller.scrollLeft = singleWidth;
  }, [data]);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      <div className="w-full text-center px-4 pb-10 md:pb-16">
        <span className="text-site-accent font-bold text-xs uppercase tracking-wider mb-2 block">
          Explore Our Collection
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-dark-base tracking-tight leading-tight mb-6">
          Browse by Brand
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Find the perfect vehicle from our curated collection of premium
          brands.
        </p>
      </div>

      {/* scroll container */}
      <div
        ref={scrollerRef}
        className="relative overflow-x-auto overflow-y-hidden whitespace-nowrap no-scrollbar px-4"
        style={{
          // smooth manual scrolling
          scrollBehavior: "auto",
          WebkitOverflowScrolling: "touch",
        }}
        aria-label="Brand carousel — scrollable"
      >
        <div className="flex items-center gap-5 py-4">
          {repeated.map((brand, idx) => (
            <div
              key={brand._id + "-" + idx}
              className="flex-shrink-0 w-28 text-center"
              style={{ scrollSnapAlign: "center" }}
            >
              <Link
                href={`/catalog/brands/${brand._id}`}
                className="flex flex-col items-center"
                onClick={() => {
                  // prevent click during drag if you want — optional
                }}
              >
                <div className="flex items-center justify-center w-28 h-28 rounded-xl bg-white shadow-lg hover:shadow-2xl transition cursor-pointer">
                  <Image
                    src={brand.logo.url}
                    alt={brand.name}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <p className="text-sm text-[#928B8B] mt-2">{brand.name}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        /* hide scrollbar (optional) */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default BrandCarousel;
