import {
  MapPin,
  Award,
  Zap,
  Headphones as HeadphonesIcon,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const WhatWeOffer = () => {
  const offerings = [
    {
      icon: MapPin,
      title: "UAE-Wide Coverage",
      description:
        "Rent and return your luxury car at any location across the UAE. From Dubai to Abu Dhabi, we have you covered with convenient pickup and drop-off points.",
      color: "#59787C",
      link: "/catalog",
    },
    {
      icon: Award,
      title: "Verified Premium Fleet",
      description:
        "Every vehicle in our collection is meticulously maintained and verified. We partner only with the most reputable luxury car providers to ensure excellence.",
      color: "#59787C",
      link: "/about",
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description:
        "Book your dream car in seconds with our streamlined process. No paperwork hassles, no waiting. Just choose, click, and drive away in style.",
      color: "#59787C",
      link: "/how-it-works",
    },
    {
      icon: HeadphonesIcon,
      title: "Concierge Service",
      description:
        "Our dedicated team is available 24/7 to assist with any request. From delivery to your doorstep to personalized recommendations, we are here to serve you.",
      color: "#59787C",
      link: "/help",
    },
  ];

  return (
    <>
      <div className="absolute top-0 left-0 w-96 h-96 bg-slate-teal/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-site-accent/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 md:mb-10 animate-slide-up">
          <span className="text-site-accent font-bold text-xs uppercase tracking-wider mb-1.5 block">
            Why Choose Us
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-dark-base mb-2 md:mb-3 leading-tight">
            What We Offer
          </h2>
          <p className="text-sm md:text-base text-grey max-w-3xl mx-auto leading-normal">
            Experience the pinnacle of luxury car rental with services designed
            for the discerning driver
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {offerings.map((offering, index) => {
            const Icon = offering.icon;
            return (
              <div
                key={index}
                className="group relative p-5 md:p-6 rounded-xl bg-white hover:bg-gradient-to-br hover:from-white hover:to-site-accent/5 shadow-md hover:shadow-lg transition-all duration-300 border border-soft-grey/30 hover:border-site-accent/30 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
           <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-site-accent/20 to-site-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 group-hover:shadow-md">
                <Icon className="w-5 h-5 text-site-accent transition-transform group-hover:scale-110" />
              </div>

              <h3 className="text-lg md:text-xl font-bold text-dark-base group-hover:text-site-accent transition-colors duration-300 leading-tight">
                {offering.title}
              </h3>
            </div>

            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-site-accent/0 group-hover:bg-gradient-to-r group-hover:from-site-accent group-hover:to-slate-teal transition-all duration-300">
              <ArrowRight className="w-3.5 h-3.5 text-transparent group-hover:text-white transition-colors duration-300" />
            </div>
          </div>

          <p className="text-grey  text-xs md:text-sm">
            {offering.description}
          </p>
          <Link
            href={offering.link}
            className="inline-flex items-center gap-2 text-site-accent font-semibold text-sm group-hover:gap-3 transition-all duration-300"
          >
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-site-accent/0 to-site-accent/0 group-hover:from-site-accent/5 group-hover:to-transparent transition-all duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 md:mt-10 text-center animate-fade-in">
          <Link
            href="/HowItWorks"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-site-accent to-slate-teal hover:from-site-accent/90 hover:to-slate-teal/90 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:scale-105 group"
          >
            <span>Discover How It Works</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default WhatWeOffer;
