"use client";

import Head from "next/head";
import { useState } from "react";
import { Mail, Phone, MessageCircle } from "lucide-react";

import SectionHeader from "@/components/shared/SectionHeader";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import CTABand from "@/components/shared/CTABand";
import Navbar from "@/components/home/Navbar";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsSubmitting(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });

    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone",
      info: "+971 56 472 7007",
      description: "Mon-Sun, 8:00 AM - 10:00 PM",
      action: "Call Now",
      link: "tel:+971564727007",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      info: "+971 56 472 7007",
      description: "Available 24/7",
      action: "Chat on WhatsApp",
      link: "https://wa.me/971564727007",
    },
    {
      icon: Mail,
      title: "Email",
      info: "info@thedrivehub.com",
      description: "We respond within 24 hours",
      action: "Send Email",
      link: "mailto:info@thedrivehub.com",
    },
  ];

  return (
    <>
      {/* ✅ SEO Head */}
     
      {/* ✅ Page Content */}
      <div className="min-h-screen bg-off-white">
        <Navbar />
        <div className="pt-32 pb-24">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <SectionHeader
                eyebrow="Get In Touch"
                title="Contact Us"
                subtitle="Have questions? We're here to help. Reach out through any of the channels below."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
              {contactMethods.map((method, index) => (
                <Card key={index} hover padding="lg">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-site-accent/10 via-slate-teal/15 to-slate-teal/10 flex items-center justify-center mx-auto mb-6">
                      <method.icon className="w-8 h-8 text-site-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-dark-base mb-2">
                      {method.title}
                    </h3>
                    <p className="text-lg font-semibold text-site-accent mb-2">
                      {method.info}
                    </p>
                    <p className="text-sm text-grey mb-6">
                      {method.description}
                    </p>
                    <Button
                      href={method.link}
                      variant="secondary"
                      size="sm"
                      fullWidth
                    >
                      {method.action}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="bg-gradient-to-br from-site-primary via-site-primary/95 to-slate-teal/40 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden mb-24">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(9,180,198,0.2),rgba(89,120,124,0.1)_40%,transparent_70%)] pointer-events-none"></div>

              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Need Immediate Assistance?
                </h2>
                <p className="text-white/90 text-lg mb-8">
                  Our 24/7 support team is always available to help you with
                  urgent matters, roadside assistance, and booking questions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    href="tel:+971564727007"
                    size="lg"
                    className="bg-site-accent hover:bg-site-accent/90 focus:ring-white focus:ring-offset-site-primary"
                    icon={Phone}
                  >
                    Call Emergency Line
                  </Button>
                  <Button
                    href="https://wa.me/971564727007"
                    size="lg"
                    className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-2 border-white/30 focus:ring-white focus:ring-offset-site-primary"
                    icon={MessageCircle}
                  >
                    WhatsApp Support
                  </Button>
                </div>
              </div>
            </div>

            <CTABand
              title="Ready to Hit the Road?"
              subtitle="Browse our collection of premium vehicles and book your perfect car today."
              primaryText="Browse Cars"
              primaryLink="/catalog/all/cars"
              secondaryText="View FAQs"
              secondaryLink="/FAQs"
            />
          </div>
        </div>
      </div>
    </>
  );
}
