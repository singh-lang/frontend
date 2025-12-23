"use client";

import Head from "next/head";
import {
  Users,
  Award,
  Shield,
  Heart,
  Sparkles,
  TrendingUp,
  Globe,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/home/Navbar";
import SectionHeader from "@/components/shared/SectionHeader";
import ComparisonBar from "@/components/shared/ComparisonBar";

export default function AboutPage() {
  // ✅ SEO Info
 
  const values = [
    {
      icon: Shield,
      title: "Trust & Safety",
      description:
        "Every vehicle is verified and maintained to the highest standards. Your safety is our top priority.",
    },
    {
      icon: Award,
      title: "Premium Quality",
      description:
        "We offer only the finest vehicles from top brands, ensuring an exceptional driving experience.",
    },
    {
      icon: Users,
      title: "Customer First",
      description:
        "Our dedicated team works tirelessly to provide you with personalized service and 24/7 support.",
    },
    {
      icon: Heart,
      title: "Passion for Cars",
      description:
        "We are car enthusiasts who understand the joy of driving and sharing amazing vehicles.",
    },
  ];

  const stats = [
    { number: "5,000+", label: "Happy Customers", icon: Users },
    { number: "500+", label: "Premium Vehicles", icon: Award },
    { number: "7", label: "Emirates Covered", icon: Globe },
    { number: "4.8", label: "Average Rating", icon: Sparkles },
  ];

  return (
    <>
      {/* ✅ SEO HEAD SECTION */}
     
      {/* ✅ PAGE CONTENT */}
      <div className="min-h-screen bg-off-white">
        <Navbar />

        <div className="pt-32 pb-24">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <SectionHeader
                eyebrow="Our Story"
                title="About The Drive Hub"
                subtitle="Your premier destination for luxury car rentals across the UAE, connecting you with exceptional vehicles and unforgettable experiences."
              />
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="text-center p-4 md:p-6 lg:p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105 border border-soft-grey/30 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-site-accent/10 to-slate-teal/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-site-accent to-slate-teal bg-clip-text text-transparent mb-1">
                      {stat.number}
                    </div>
                    <div className="text-grey text-sm font-medium">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Our Story */}
            <div className="mb-20 max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-dark-base mb-4">
                  Building Trust, One Ride at a Time
                </h2>
                <p className="text-grey text-lg max-w-2xl mx-auto">
                  From a vision to the UAE&apos;s most trusted luxury car rental
                  platform.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-soft-grey/30">
                <p className="text-grey mb-6 leading-relaxed">
                  Founded in 2025, The Drive Hub was born from a passion for
                  exceptional automobiles and a vision to make luxury car
                  rentals accessible to everyone. We recognized that renting a
                  premium vehicle shouldn&apos;t be complicated or intimidating.
                </p>
                <p className="text-grey mb-6 leading-relaxed">
                  Today, we&apos;re proud to be one of the UAE&apos;s most
                  trusted car rental platforms, connecting thousands of
                  customers with their dream vehicles. Our platform brings
                  together a curated selection of luxury and sports cars, all
                  verified for quality and safety.
                </p>
                <p className="text-grey leading-relaxed">
                  Whether you need a car for a special occasion, business trip,
                  or simply to experience driving something extraordinary, The
                  Drive Hub makes it effortless.
                </p>
              </div>
            </div>

            {/* Core Values */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-dark-base mb-4">
                  Our Core Values
                </h2>
                <p className="text-grey text-lg max-w-3xl mx-auto">
                  The principles that guide everything we do.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <div
                      key={index}
                      className="group bg-white p-8 rounded-2xl shadow-lg border border-soft-grey/30 hover:border-accent/30 hover:shadow-xl transition-all"
                    >
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-site-accent/10 to-slate-teal/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-8 h-8 text-site-accent" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-dark-base mb-2 group-hover:text-site-accent transition-colors">
                            {value.title}
                          </h3>
                          <p className="text-grey leading-relaxed text-base">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-site-accent to-slate-teal rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -ml-32 -mt-32" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -mr-32 -mb-32" />
              </div>
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Experience Luxury?
                </h2>
                <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                  Join thousands of satisfied customers who trust The Drive Hub
                  for their luxury car rental needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/catalog/all/cars"
                    className="inline-flex items-center justify-center gap-2 bg-white text-site-accent px-8 py-4 rounded-xl font-bold transition hover:scale-105 hover:shadow-xl"
                  >
                    Browse Our Fleet
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition hover:scale-105"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ComparisonBar />
      </div>
    </>
  );
}
