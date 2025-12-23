"use client";

import { User, ChevronDown, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import VerifiedBadge from "../home/VerifiedBadge";
import Image from "next/image";
import { usePathname } from "next/navigation";

import CategoryMegaMenu from "@/components/megamenu/CategoryMegaMenu";
import BrandMegaMenu from "@/components/megamenu/BrandMegaMenu";
import BudgetMegaMenu from "@/components/megamenu/BudgetMegaMenu";
import AuthModal from "../Auth/AuthModel";
import ProfileSetup from "../Auth/ProfileSetup";
import MobileMegaMenu from "./MegaMenu/MobileMegaMenu";

type MegaMenuType = "category" | "brand" | "budget" | null;

interface CatalogHeaderProps {
  data: {
    categories: [{ _id: string; name: string }];
    brands: [{ _id: string; name: string; logo: { url: string } }];
  };
}

const CatalogHeader = ({ data }: CatalogHeaderProps) => {
  const pathname = usePathname();
  const currentPath = pathname.split("/")[1];
  const { isAuthenticated, user, signOut } = useAuth();
  const [
    ,
    // scrolled
    setScrolled,
  ] = useState(false);
  const [
    searchData,
    // setSearchData
  ] = useState({
    brand: "",
    type: "",
    location: "",
    startDate: "",
    endDate: "",
  });
  const [activeMegaMenu, setActiveMegaMenu] = useState<MegaMenuType>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  // const [authModalTab, setAuthModalTab] = useState<"signin" | "register">(
  //   "signin"
  // );
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 120;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search:", searchData);
  };

  const handleMouseEnter = (menu: MegaMenuType) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMegaMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 200);
  };

  const closeMegaMenu = () => {
    setActiveMegaMenu(null);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMegaMenu(null);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyboard);
    return () => document.removeEventListener("keydown", handleKeyboard);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, menu: MegaMenuType) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveMegaMenu(activeMegaMenu === menu ? null : menu);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (!user?.profileComplete) {
      setShowProfileSetup(true);
    }
  };

  const handleProfileComplete = () => {
    setShowProfileSetup(false);
  };

  return (
    <>
      <header
        className={`${
          currentPath == "car" ? "sticky" : "relative"
        } top-0 z-[9999] bg-gradient-to-br from-site-primary via-site-primary/95 to-slate-teal/40 text-white shadow-2xl backdrop-blur-sm border-b border-site-accent/10 overflow-visible`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(9,180,198,0.2),rgba(89,120,124,0.1)_40%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-[1600px] mx-auto px-6">
          {/* navbar */}
          <div className="flex items-center justify-between py-4 border-b border-white/10 relative">
            <div className="absolute -bottom-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-accent/60 via-slate-teal/40 to-transparent"></div>
            <div className="flex items-center gap-12">
              <Link href="/" className="group">
                <Image
                  src="/assets/logoo.svg"
                  alt="The Drive Hub"
                  height={40}
                  width={40}
                  className="h-12 w-auto transition-transform duration-300 group-hover:scale-105 "
                />
              </Link>

              <nav className="hidden lg:flex items-center gap-2" role="menubar">
                <Link
                  href="/catalog/all/cars"
                  className="px-4 py-2 text-site-accent font-semibold hover:bg-white/10 rounded-lg transition-all duration-300"
                  role="menuitem"
                >
                  All Cars
                </Link>

                <div
                  className="relative"
                  onMouseEnter={() => handleMouseEnter("category")}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className="flex items-center gap-1 px-4 py-2 font-medium hover:text-site-accent hover:bg-white/10 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-site-accent focus:ring-offset-2"
                    aria-expanded={activeMegaMenu === "category"}
                    aria-haspopup="true"
                    role="menuitem"
                    onKeyDown={(e) => handleKeyDown(e, "category")}
                    tabIndex={0}
                  >
                    By Category
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        activeMegaMenu === "category" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                <div
                  className="relative"
                  onMouseEnter={() => handleMouseEnter("brand")}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className="flex items-center gap-1 px-4 py-2 font-medium hover:text-site-accent hover:bg-white/10 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-site-accent focus:ring-offset-2"
                    aria-expanded={activeMegaMenu === "brand"}
                    aria-haspopup="true"
                    role="menuitem"
                    onKeyDown={(e) => handleKeyDown(e, "brand")}
                    tabIndex={0}
                  >
                    By Brand
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        activeMegaMenu === "brand" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                <div
                  className="relative"
                  onMouseEnter={() => handleMouseEnter("budget")}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className="flex items-center gap-1 px-4 py-2 font-medium hover:text-site-accent hover:bg-white/10 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-site-accent focus:ring-offset-2"
                    aria-expanded={activeMegaMenu === "budget"}
                    aria-haspopup="true"
                    role="menuitem"
                    onKeyDown={(e) => handleKeyDown(e, "budget")}
                    tabIndex={0}
                  >
                    By Budget
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        activeMegaMenu === "budget" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                <Link
                  href="/contact"
                  className="px-4 py-2 font-medium hover:text-site-accent hover:bg-white/10 rounded-lg transition-all duration-300"
                  role="menuitem"
                >
                  Contact
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden lg:block">
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-3 rounded-xl transition-all duration-300 group"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-site-accent to-slate-teal flex items-center justify-center font-bold text-white shadow-lg group-hover:scale-105 transition-transform">
                        {user?.name?.charAt(0) || "U"}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-white">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-white/70">{user?.email}</p>
                      </div>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-soft-grey/20 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 bg-gradient-to-r from-site-accent/5 to-slate-teal/5 border-b border-soft-grey/20">
                          <p className="font-bold text-dark-base mb-1">
                            {user?.name}
                          </p>
                          <p className="text-sm text-grey">{user?.email}</p>
                          {user?.status == 2 && (
                            <div className="mt-2">
                              <VerifiedBadge />
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <Link
                            href="/profile"
                            onClick={() => setShowUserMenu(false)}
                            className="block w-full text-left px-4 py-3 hover:bg-slate-teal/5 rounded-lg text-dark-base transition-all duration-200 group"
                          >
                            <div className="flex items-center gap-3">
                              <User className="w-4 h-4 text-slate-teal group-hover:scale-110 transition-transform" />
                              <span className="font-medium">My Profile</span>
                            </div>
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="w-full text-left px-4 py-3 hover:bg-red-50 rounded-lg text-red-600 transition-all duration-200 group"
                          >
                            <div className="flex items-center gap-3">
                              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              <span className="font-medium">Sign Out</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-gradient-to-r from-site-accent to-slate-teal text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-site-accent focus:ring-offset-2"
                  >
                    Sign In
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 👇 ADDED MEGA MENU SECTION HERE */}
          {activeMegaMenu && (
            <div
              className="absolute left-0 right-0 top-full z-40"
              onMouseEnter={() => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
              }}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className={`transition-all duration-300 ${
                  activeMegaMenu
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4 pointer-events-none"
                }`}
                role="menu"
              >
                {activeMegaMenu === "category" && (
                  <CategoryMegaMenu
                    data={data?.categories}
                    onClose={closeMegaMenu}
                  />
                )}
                {activeMegaMenu === "brand" && (
                  <BrandMegaMenu data={data?.brands} onClose={closeMegaMenu} />
                )}
                {activeMegaMenu === "budget" && (
                  <BudgetMegaMenu onClose={closeMegaMenu} />
                )}
              </div>
            </div>
          )}

          {/* form */}
          <form onSubmit={handleSearch} className="py-4 md:py-6 relative">
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-site-accent/30 to-transparent"></div>
            <div className="flex flex-wrap items-end gap-3 md:gap-4">
              {/* form content remains unchanged */}
            </div>
          </form>
        </div>
      </header>
      <MobileMegaMenu
        data={data}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      <ProfileSetup
        isOpen={showProfileSetup}
        onClose={() => setShowProfileSetup(false)}
        onComplete={handleProfileComplete}
      />
    </>
  );
};

export default CatalogHeader;
