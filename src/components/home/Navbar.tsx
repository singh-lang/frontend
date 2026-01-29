"use client";

import { Menu, X, User, LogOut, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import AuthModal from "../Auth/AuthModel";
import ProfileSetup from "../Auth/ProfileSetup";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (!user?.profileComplete) {
      setShowProfileSetup(true);
    }
  };

  const handleProfileComplete = () => {
    setShowProfileSetup(false);
  };

  const handleSignOut = async () => {
    signOut();
    setShowUserMenu(false);
  };

  return (
    <>
      <nav className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-dark-base/80 via-dark-base/40 to-transparent backdrop-blur-md transition-all duration-300">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-5">
           <Link href="/" className="flex items-center group">
  <Image
    src="/assets/logoo.svg"
    alt="The Drive Hub"
    height={40}
    width={40}
    className="h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
  />
</Link>


            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              <Link
                href="/catalog/all/cars"
                className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-300 font-medium"
                prefetch={false}
              >
                Browse Cars
              </Link>
              <Link
                href="/HowItWorks"
                className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-300 font-medium"
                prefetch={false}
              >
                How It Works
              </Link>
              <Link
                href="/about"
                className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-300 font-medium"
                prefetch={false}
              >
                About
              </Link>
              <Link
                href="/FAQs"
                className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-300 font-medium"
                prefetch={false}
              >
                FAQs
              </Link>
              <Link
                href="/contact"
                className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-300 font-medium"
                prefetch={false}
              >
                Contact
              </Link>
               <Link
                href="/becomevendor"
                className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-300 font-medium"
                prefetch={false}
              >
                Become a Vendor
              </Link>

              {isAuthenticated && user ? (
                <div className="relative ml-4">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 bg-gradient-to-r from-site-accent to-slate-teal text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <User className="w-4 h-4" />
                    <span>{user.name.split(" ")[0]}</span>
                    {user.status == 2 && (
                      <Shield className="w-4 h-4 text-site-accent" />
                    )}
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-2xl overflow-hidden animate-scale-in border border-soft-grey/30">
                      <div className="p-5 bg-gradient-to-br from-slate-teal/10 to-transparent border-b border-soft-grey/30">
                        <p className="font-semibold text-dark-base text-lg">
                          {user.name}
                        </p>
                        <p className="text-sm text-grey mt-1">{user.email}</p>
                        {user.status == 2 && (
                          <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-teal font-medium bg-slate-teal/10 px-3 py-1.5 rounded-full w-fit">
                            <Shield className="w-3.5 h-3.5" />
                            <span>Verified Account</span>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <Link
                          href="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="block w-full text-left px-4 py-3 hover:bg-slate-teal/5 rounded-lg text-dark-base transition-all duration-200 group"
                          prefetch={false}
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
                  className="ml-4 bg-gradient-to-r from-site-accent to-slate-teal text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-site-accent focus:ring-offset-2"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden bg-white/98 backdrop-blur-lg rounded-2xl p-6 mb-4 shadow-2xl animate-slide-up border border-soft-grey/30">
              <div className="flex flex-col gap-2">
                <Link
                  href="/catalog/all/cars"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-dark-base hover:text-slate-teal hover:bg-slate-teal/5 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                  prefetch={false}
                >
                  Browse Cars
                </Link>
                <Link
                  href="/HowItWorks"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-dark-base hover:text-slate-teal hover:bg-slate-teal/5 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                  prefetch={false}
                >
                  How It Works
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-dark-base hover:text-slate-teal hover:bg-slate-teal/5 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                  prefetch={false}
                >
                  About
                </Link>
                <Link
                  href="/FAQs"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-dark-base hover:text-slate-teal hover:bg-slate-teal/5 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                  prefetch={false}
                >
                  FAQs
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-dark-base hover:text-slate-teal hover:bg-slate-teal/5 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                  prefetch={false}
                >
                  Contact
                </Link>
                <Link
                  href="/becomevendor"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-dark-base hover:text-slate-teal hover:bg-slate-teal/5 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                  prefetch={false}
                >
                  Become a vendor
                </Link>

                {isAuthenticated && user ? (
                  <>
                    <div className="pt-4 mt-2 border-t border-soft-grey/30">
                      <div className="bg-gradient-to-br from-slate-teal/10 to-transparent p-4 rounded-lg mb-3">
                        <p className="font-semibold text-dark-base mb-1">
                          {user.name}
                        </p>
                        <p className="text-sm text-grey">{user.email}</p>
                        {user.status == 2 && (
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-teal font-medium">
                            <Shield className="w-3.5 h-3.5" />
                            <span>Verified Account</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          setShowProfileSetup(true);
                        }}
                        className="w-full bg-slate-teal/10 hover:bg-slate-teal/20 text-slate-teal px-6 py-3 rounded-lg font-semibold transition-all duration-200 mb-2"
                      >
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleSignOut();
                        }}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowAuthModal(true);
                    }}
                    className="mt-4 bg-slate-teal hover:bg-slate-teal/90 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Modals */}
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
}
