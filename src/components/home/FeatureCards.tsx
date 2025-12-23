import { Shield, Clock, Star, RefreshCw } from "lucide-react";

const FeatureCards = () => {
  const values = [
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Bank-grade encryption",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Always here to help",
    },
    {
      icon: Star,
      title: "Premium Cars",
      description: "Luxury fleet only",
    },
    {
      icon: RefreshCw,
      title: "Smart Compare",
      description: "Side-by-Side insights",
    },
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

        {values.map((value, index) => {
          const Icon = value.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-off-white transition-all duration-300 group cursor-pointer"
            >
              <div className="w-14 h-14 bg-site-accent/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-site-accent group-hover:scale-110 transition-all duration-300">
                <Icon className="w-7 h-7 text-site-accent group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-base  text-site-grey mb-1">
                {value.title}
              </h3>
              <p className="text-secondary text-xs">{value.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureCards;
