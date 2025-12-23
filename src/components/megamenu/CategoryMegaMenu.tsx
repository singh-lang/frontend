import { Car, Zap, Crown, Dumbbell, DollarSign } from "lucide-react";
import Link from "next/link";

interface CategoryMegaMenuProps {
  data: [{ _id: string; name: string }];
  onClose: () => void;
}

const categories = [
  {
    id: "economy",
    name: "Economy",
    icon: DollarSign,
    caption: "Budget-friendly daily drivers",
    path: "/catalog?category=economy",
  },
  {
    id: "sports",
    name: "Sports",
    icon: Dumbbell,
    caption: "High-performance vehicles",
    path: "/catalog?category=sports",
  },
  {
    id: "electric",
    name: "Electric",
    icon: Zap,
    caption: "Eco-friendly electric cars",
    path: "/catalog?category=electric",
  },
  {
    id: "luxury",
    name: "Luxury",
    icon: Crown,
    caption: "Premium comfort & style",
    path: "/catalog?category=luxury",
  },
  {
    id: "muscle",
    name: "Muscle",
    icon: Car,
    caption: "Raw power and presence",
    path: "/catalog?category=muscle",
  },
];

const CategoryMegaMenu = ({ data, onClose }: CategoryMegaMenuProps) => {
  return (
    <div className="w-full bg-white/95 backdrop-blur-xl shadow-2xl border-t border-soft-grey/20">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <h3 className="text-sm font-semibold text-site-secondary mb-6 uppercase tracking-wider">
          Browse by Category
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {data.slice(0, 5).map((category, i) => {
            const Icon = categories[i].icon;
            return (
              <Link
                key={category._id}
                href={`/catalog/categories/${category._id}`}
                onClick={onClose}
                className="group p-5 rounded-xl bg-gradient-to-br from-off-white/50 to-white border border-soft-grey/30 hover:border-site-accent/40 hover:shadow-xl hover:shadow-site-accent/10 transition-all duration-300 hover:-translate-y-1"
                role="menuitem"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-site-accent/10 via-slate-teal/15 to-slate-teal/10 flex items-center justify-center group-hover:from-site-accent/25 group-hover:via-site-accent/20 group-hover:to-slate-teal/25 transition-all duration-300 shadow-sm">
                    <Icon className="w-6 h-6 text-site-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-site-primary text-base mb-1 group-hover:bg-gradient-to-r group-hover:from-site-accent group-hover:to-slate-teal group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      {category.name}
                    </h4>
                    {/* <p className="text-xs text-site-secondary leading-relaxed">
                      {category.caption}
                    </p> */}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryMegaMenu;
