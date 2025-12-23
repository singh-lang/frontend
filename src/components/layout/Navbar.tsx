"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";

import MultiStepForm from "@/components/MultiStepForm";
import signinSteps from "@/data/signinSteps";

export default function Navbar() {
  return (
    <div className="relative w-full mx-auto max-w-[1440px] z-[99]">
      <header className="absolute top-0 md:top-6 left-0 md:left-1/2 md:-translate-x-1/2 w-full md:w-[92%] h-[92px] md:h-[72px] flex items-center justify-between px-8 rounded-2xl backdrop-blur-md bg-white/10 border-b border-white/20 z-50">
        {/* Left Links */}
        <nav className="hidden lg:flex items-center space-x-8 text-white font-medium">
          <Link
            href="#"
            className="md:text-xs lg:text-sm xl:text-base flex items-center space-x-1 hover:text-gray-200"
          >
            <span>CATALOGUE</span>
            <span className="text-xs">▼</span>
          </Link>
          <Link
            href="#"
            className="md:text-xs lg:text-sm xl:text-base hover:text-gray-200"
          >
            ABOUT US
          </Link>
          <Link
            href="#"
            className="md:text-xs lg:text-sm xl:text-base hover:text-gray-200"
          >
            CONTACTS
          </Link>
        </nav>

        {/* Logo */}
        <div className="flex items-center">
          <Image src="/assets/dlogo.png" alt="Logo" width={140} height={80} />
        </div>

        {/* Right Side */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Search */}
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-3 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-white/50 bg-white text-gray-800"
            />
          </div>

          {/* ✅ Login Button as DialogTrigger */}
          {/* Login Button */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="bg-[#5c7c7c] text-white px-5 py-2 rounded-full font-semibold hover:bg-[#486464] cursor-pointer">
                Log In
              </button>
            </DialogTrigger>

            {/* Minimal dialog content, only showing the form */}
            <DialogContent className="bg-transparent p-0 shadow-none border-0">
              <DialogHeader>
                <div className="hidden">
                  <DialogTitle>LoremIpsum</DialogTitle>
                </div>
              </DialogHeader>
              <MultiStepForm
                title="Sign In"
                steps={signinSteps}
                onSubmit={(data) => console.log("Form submitted:", data)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Mobile Menu */}
        <button className="cursor-pointer block lg:hidden">
          <Image
            src="/assets/mobile-menu.svg"
            alt="mobile-menu"
            width={16}
            height={14}
          />
        </button>
      </header>
    </div>
  );
}
