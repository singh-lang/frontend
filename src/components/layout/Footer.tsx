"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div>
          <Link href="/" className="block mb-4 group">
            <Image
              src="/assets/footerlogo.svg"
              alt="The Drive Hub"
              height={100}
              width={100}
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-105 mt-[-10px]"
            />
          </Link>
          <p className="text-black/60 leading-relaxed mb-4 text-sm">
            Premium car rentals across the UAE with seamless booking and
            exceptional service.
          </p>

          {/* --- Social Media Icons --- */}
          <div className="flex gap-2">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/thedrivehubco"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-black/10 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-site-accent hover:to-slate-teal transition-all duration-300 hover:scale-110 group"
            >
              <Instagram className="w-4 h-4 transition-all duration-200 group-hover:text-white" />
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/thdrivehubco"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-black/10 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-site-accent hover:to-slate-teal transition-all duration-300 hover:scale-110 group"
            >
              <Facebook className="w-4 h-4 transition-all duration-200 group-hover:text-white" />
            </a>

            {/* Snapchat */}
            <a
              href="https://www.snapchat.com/@thedrivehub"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-black/10 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-site-accent hover:to-slate-teal transition-all duration-300 hover:scale-110 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-black transition-all duration-200 group-hover:text-white"
              >
                <path d="M12 0C8.02 0 5 3.02 5 6.97c0 1.25.36 2.46.97 3.47-.03.14-.05.27-.07.4-.32 1.84-1.4 3.25-3.26 3.65-.25.06-.39.3-.33.55.19.72.9 1.25 1.81 1.48.26.07.54.11.82.13.06.29.14.59.23.9.47 1.52 1.29 2.94 2.43 4.13C8.77 22.3 10.3 23 12 23s3.23-.7 4.43-1.97c1.14-1.19 1.96-2.61 2.43-4.13.09-.31.17-.61.23-.9.28-.02.56-.06.82-.13.91-.23 1.62-.76 1.81-1.48.07-.25-.08-.49-.33-.55-1.86-.4-2.94-1.81-3.26-3.65-.02-.13-.04-.26-.07-.4.61-1.01.97-2.22.97-3.47C19 3.02 15.98 0 12 0z" />
              </svg>
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@thedrivehubco"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-black/10 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-site-accent hover:to-slate-teal transition-all duration-300 hover:scale-110 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-black transition-all duration-200 group-hover:text-white"
              >
                <path d="M12.9 2c.2 2.4 1.9 4.4 4.3 4.8V9c-.8 0-1.6-.1-2.3-.4v6.1c0 2.6-2.1 4.7-4.7 4.7S5.5 17.3 5.5 14.7s2.1-4.7 4.7-4.7c.3 0 .6 0 .9.1v2.6c-.3-.1-.6-.2-.9-.2-1.1 0-2.1.9-2.1 2.1s.9 2.1 2.1 2.1 2.1-.9 2.1-2.1V2h2.6z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Explore Section */}
        <div>
          <h4 className="text-base font-bold mb-4 text-black">Explore</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="text-black/60 hover:text-slate-teal transition-colors text-sm"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/catalog/all/cars"
                className="text-black/60 hover:text-slate-teal transition-colors text-sm"
              >
                Browse Cars
              </Link>
            </li>
            <li>
              <Link
                href="/HowItWorks"
                className="text-black/60 hover:text-slate-teal transition-colors text-sm"
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-black/60 hover:text-slate-teal transition-colors text-sm"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="text-black/60 hover:text-slate-teal transition-colors text-sm"
              >
                Blogs
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h4 className="text-base font-bold mb-4 text-black">Support</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/contact"
                className="text-black/60 hover:text-slate-teal transition-colors text-sm"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                href="/idp"
                className="text-black/60 hover:text-slate-teal transition-colors text-sm"
              >
                IDP Requirements
              </Link>
            </li>
            <li>
              <Link
                href="/FAQs"
                className="text-black/60 hover:text-slate-teal transition-colors text-sm"
              >
                FAQs
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-black/60 hover:text-slate-teal transition-colors text-sm"
              >
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="text-black/60 hover:text-slate-teal transition-colors text-sm"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h4 className="text-base font-bold mb-4 text-black">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-slate-teal mt-0.5 flex-shrink-0" />
              <div>
                <a
                  href="tel:+971564727007"
                  className="text-black/60 font-medium text-sm hover:underline"
                  aria-label="Call +971 56 472 7007"
                >
                  +971 564727007
                </a>
                <p className="text-black/40 text-xs">24/7 Support</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-slate-teal mt-0.5 flex-shrink-0" />
              <a
                href="mailto:info@thedrivehub.com"
                className="text-black/60 hover:text-slate-teal transition-colors text-sm"
              >
                info@thedrivehub.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-teal mt-0.5 flex-shrink-0" />
              <p className="text-black/60 text-sm">Dubai , UAE</p>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-black/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-center sm:text-left text-black/40 text-xs">
          © 2025 The Drive Hub. All rights reserved.
        </p>

        {/* Invisible but clickable developer credit */}
        <a
          href="https://codxsoftwares.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[0px] opacity-0 pointer-events-auto"
          aria-label="Developed by Codx Softwares"
        >
          Developed by Codx Softwares
        </a>
      </div>
    </div>
  );
}
