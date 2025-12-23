"use client";

import Head from "next/head";
import { useState, FormEvent } from "react";
import {
  DollarSign,
  TrendingUp,
  Shield,
  Users,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Building,
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";
import { useCreateVendorLeadMutation } from "@/lib/api/leadApi"; // 🧩 new import

export default function BecomeVendorPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    vehicleCount: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [createVendorLead, { isLoading }] = useCreateVendorLeadMutation(); // 🧩 new hook

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      name: formData.fullName,
      email: formData.email,
      phoneNum: formData.phone,
      businessName: formData.company || "N/A",
      fleetSize: Number(formData.vehicleCount.replace(/\D/g, "")) || 0,
      additionalInfo: formData.message || "",
    };

    try {
      const res = await createVendorLead(payload).unwrap();
      console.log("✅ Vendor lead created:", res);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          company: "",
          vehicleCount: "",
          message: "",
        });
      }, 3000);
    } catch (err) {
      console.error("❌ Error creating vendor lead:", err);
      alert(
        "Something went wrong while submitting your application. Please try again later."
      );
    }
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "Earn Extra Income",
      description:
        "Turn your idle vehicles into a consistent revenue stream. Set your own rates and maximize your earnings.",
      color: "site-accent",
    },
    {
      icon: TrendingUp,
      title: "Growing Market",
      description:
        "Join the fastest-growing car rental marketplace in the UAE with thousands of active renters.",
      color: "site-primary",
    },
    {
      icon: Shield,
      title: "Full Protection",
      description:
        "Comprehensive insurance coverage and secure payment processing protect you and your vehicles.",
      color: "site-slate-teal",
    },
    {
      icon: Users,
      title: "Verified Renters",
      description:
        "All renters go through strict verification. You have full control to accept or decline bookings.",
      color: "site-accent",
    },
    {
      icon: Clock,
      title: "Flexible Management",
      description:
        "Easy-to-use dashboard to manage bookings, availability, pricing, and vehicle listings.",
      color: "site-primary",
    },
    {
      icon: Star,
      title: "Build Your Reputation",
      description:
        "Earn verified badges and positive reviews to attract more customers and premium rates.",
      color: "site-slate-teal",
    },
  ];

  const stats = [
    { value: "500+", label: "Active Vendors" },
    { value: "AED 15K", label: "Avg Monthly Earnings" },
    { value: "95%", label: "Satisfaction Rate" },
    { value: "24/7", label: "Vendor Support" },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Submit Application",
      description:
        "Fill out the vendor application form with your details and vehicle information.",
    },
    {
      step: 2,
      title: "Verification",
      description:
        "Our team reviews your application and verifies your documents within 24-48 hours.",
    },
    {
      step: 3,
      title: "List Your Vehicles",
      description:
        "Upload vehicle photos, set your rates, and configure availability calendar.",
    },
    {
      step: 4,
      title: "Start Earning",
      description:
        "Accept bookings, manage rentals, and receive payments directly to your account.",
    },
  ];

  const features = [
    "Set your own daily, weekly, and monthly rates",
    "Real-time booking management dashboard",
    "Automated payment processing and payouts",
    "Insurance and damage protection included",
    "Marketing and promotion on our platform",
    "Direct communication with renters",
    "Performance analytics and insights",
    "Dedicated vendor support team",
    "No listing fees or hidden charges",
    "Flexible cancellation policies",
  ];

  return (
    <>
      {/* ✅ SEO HEAD */}
      <Head>
        <title>Become a Vendor | The Drive Hub</title>
        <meta
          name="description"
          content="Join The Drive Hub as a vendor and start earning by renting your cars in Dubai and across the UAE. Apply now!"
        />
      </Head>

      <div className="min-h-screen bg-site-off-white">
        <Navbar />

        <div className="pt-32 pb-24">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            {/* 🌟 HERO SECTION */}
            <section className="text-center mb-20 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-site-accent/5 to-transparent -z-10 rounded-3xl blur-3xl"></div>

              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-site-accent/10 to-slate-teal/10 px-4 py-2 rounded-full border border-site-accent/20 mb-6">
                <DollarSign className="w-4 h-4 text-site-accent" />
                <span className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-site-accent to-slate-teal bg-clip-text text-transparent">
                  Join Our Vendor Network
                </span>
              </div>

              <h1
                className="text-5xl md:text-7xl font-bold text-site-dark-base mb-6"
                style={{ fontFamily: "Stretch Pro, sans-serif" }}
              >
                Turn Your Cars Into <br />
                <span className="bg-gradient-to-r from-site-accent to-slate-teal bg-clip-text text-transparent">
                  Profit
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-site-grey max-w-3xl mx-auto leading-relaxed mb-8">
                List your vehicles on The Drive Hub and start earning passive
                income today. Join hundreds of successful vendors across the
                UAE.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#apply"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-site-accent to-slate-teal text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  Become a Vendor <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-site-accent text-site-accent rounded-xl font-semibold hover:bg-site-accent hover:text-white transition-all"
                >
                  Learn More
                </a>
              </div>
            </section>

            {/* 📈 STATS */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 shadow-xl border border-soft-grey/20 text-center hover:shadow-2xl transition-all"
                >
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-site-accent to-slate-teal bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-site-grey text-sm">{stat.label}</div>
                </div>
              ))}
            </section>

            {/* 💡 BENEFITS */}
            <section className="mb-24">
              <div className="text-center mb-12">
                <h2
                  className="text-4xl md:text-5xl font-bold text-site-dark-base mb-4"
                  style={{ fontFamily: "Stretch Pro, sans-serif" }}
                >
                  Why Choose The Drive Hub
                </h2>
                <p className="text-lg text-site-grey max-w-3xl mx-auto">
                  We provide everything you need to succeed as a vendor on our
                  platform
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.map(
                  ({ icon: Icon, title, description, color }, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-8 shadow-xl border border-site-soft-grey/20 hover:shadow-2xl transition-all group"
                    >
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${color}/10 to-slate-teal/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                      >
                        <Icon className={`w-7 h-7 text-${color}`} />
                      </div>
                      <h3 className="text-xl font-bold text-site-dark-base mb-3">
                        {title}
                      </h3>
                      <p className="text-site-grey leading-relaxed">
                        {description}
                      </p>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* ⚙️ HOW IT WORKS */}
            <section
              id="how-it-works"
              className="mb-24 bg-gradient-to-br from-site-accent/5 to-slate-teal/5 rounded-3xl p-8 md:p-12 border border-site-accent/10"
            >
              <div className="text-center mb-12">
                <h2
                  className="text-4xl md:text-5xl font-bold text-site-dark-base mb-4"
                  style={{ fontFamily: "Stretch Pro, sans-serif" }}
                >
                  How It Works
                </h2>
                <p className="text-lg text-site-grey max-w-3xl mx-auto">
                  Get started in four simple steps
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {howItWorks.map(({ step, title, description }) => (
                  <div
                    key={step}
                    className="bg-white rounded-xl p-6 shadow-md border border-soft-grey/20 relative"
                  >
                    <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-r from-site-accent to-slate-teal text-white flex items-center justify-center text-lg font-bold shadow-lg">
                      {step}
                    </div>
                    <h4 className="text-lg font-bold text-site-dark-base mb-3 mt-2">
                      {title}
                    </h4>
                    <p className="text-sm text-site-grey leading-relaxed">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 🧩 FEATURES */}
            <section className="mb-24">
              <div className="text-center mb-12">
                <h2
                  className="text-4xl md:text-5xl font-bold text-site-dark-base mb-4"
                  style={{ fontFamily: "Stretch Pro, sans-serif" }}
                >
                  What You Get
                </h2>
                <p className="text-lg text-site-grey max-w-3xl mx-auto">
                  Everything you need to manage and grow your vehicle rental
                  business
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-md border border-soft-grey/20"
                  >
                    <CheckCircle className="w-5 h-5 text-site-accent flex-shrink-0" />
                    <span className="text-dark-base">{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 📝 APPLICATION FORM */}
            <section
              id="apply"
              className="bg-white rounded-3xl shadow-2xl border border-site-soft-grey/20 p-8 md:p-12"
            >
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-site-dark-base mb-4">
                    Apply to Become a Vendor
                  </h2>
                  <p className="text-site-grey">
                    Fill out the form below and our team will get back to you
                    within 24 hours
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* LEFT STEPS */}
                  <aside className="md:col-span-1">
                    <div className="space-y-4">
                      {[
                        {
                          num: 1,
                          title: "Fill Your Details",
                          desc: "Tell us about you and your business so we can contact you quickly.",
                        },
                        {
                          num: 2,
                          title: "Fleet Information",
                          desc: "Select how many vehicles you plan to list on The Drive Hub.",
                        },
                        {
                          num: 3,
                          title: "Fast Verification",
                          desc: "Our team reviews your info and completes KYC within 24–48 hours.",
                        },
                        {
                          num: 4,
                          title: "Go Live & Earn",
                          desc: "Get dashboard access, list cars, set rates, and start getting bookings.",
                        },
                      ].map((s) => (
                        <div
                          key={s.num}
                          className="relative rounded-2xl border border-soft-grey/30 p-5 hover:shadow-lg transition"
                        >
                          <div className="absolute -left-3 -top-3 w-10 h-10 rounded-full bg-gradient-to-r from-site-accent to-slate-teal text-white flex items-center justify-center font-bold shadow-md">
                            {s.num}
                          </div>
                          <h4 className="font-semibold text-site-dark-base mb-1">
                            {s.title}
                          </h4>
                          <p className="text-sm text-site-grey">{s.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 rounded-2xl bg-site-accent/5 border border-site-accent/20 p-5">
                      <h5 className="font-semibold text-site-dark-base mb-2">
                        What happens next?
                      </h5>
                      <ul className="space-y-2 text-sm text-site-grey">
                        <li>• You’ll get a confirmation email/SMS.</li>
                        <li>
                          • A vendor specialist will contact you within 24–48
                          hours.
                        </li>
                        <li>
                          • We’ll share your dashboard login and onboarding
                          checklist.
                        </li>
                      </ul>
                    </div>
                  </aside>

                  {/* FORM */}
                  <div className="md:col-span-2">
                    {submitted ? (
                      <div className="bg-site-accent/5 border-2 border-site-accent/20 rounded-xl p-8 text-center">
                        <CheckCircle className="w-16 h-16 text-site-accent mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-site-dark-base mb-2">
                          Application Submitted!
                        </h3>
                        <p className="text-site-grey">
                          Thank you for your interest. Our team will review your
                          application and contact you within 24–48 hours.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-site-dark-base mb-2">
                              Full Name *
                            </label>
                            <Input
                              type="text"
                              value={formData.fullName}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  fullName: e.target.value,
                                })
                              }
                              required
                              placeholder="John Doe"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-site-dark-base mb-2">
                              Email Address *
                            </label>
                            <Input
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  email: e.target.value,
                                })
                              }
                              required
                              placeholder="john@example.com"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-site-dark-base mb-2">
                              Phone Number *
                            </label>
                            <Input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  phone: e.target.value,
                                })
                              }
                              required
                              placeholder="+971 50 123 4567"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-site-dark-base mb-2">
                              Company/Business Name
                            </label>
                            <Input
                              type="text"
                              value={formData.company}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  company: e.target.value,
                                })
                              }
                              placeholder="Your Company"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-site-dark-base mb-2">
                              Number of Vehicles *
                            </label>
                            <select
                              value={formData.vehicleCount}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  vehicleCount: e.target.value,
                                })
                              }
                              required
                              className="w-full px-4 py-3 border-2 border-site-soft-grey/30 rounded-xl focus:outline-none focus:border-site-accent transition-colors bg-white"
                            >
                              <option value="">Select...</option>
                              <option value="1-5">1-5 vehicles</option>
                              <option value="6-10">6-10 vehicles</option>
                              <option value="11-20">11-20 vehicles</option>
                              <option value="20+">20+ vehicles</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-site-dark-base mb-2">
                            Additional Information
                          </label>
                          <textarea
                            value={formData.message}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                message: e.target.value,
                              })
                            }
                            rows={4}
                            placeholder="Tell us about your vehicles, experience, and preferred payout method…"
                            className="w-full px-4 py-3 border-2 border-soft-grey/30 rounded-xl focus:outline-none focus:border-site-accent transition-colors resize-none"
                          />
                        </div>

                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            required
                            className="mt-1 h-4 w-4 rounded border-site-soft-grey/40"
                          />
                          <p className="text-sm text-site-grey">
                            I agree to The Drive Hub’s vendor terms and consent
                            to be contacted for verification.
                          </p>
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isLoading}
                        >
                          {isLoading ? "Submitting..." : "Submit Application"}
                        </Button>
                      </form>
                    )}

                    {/* 📞 CONTACT INFO */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-soft-grey/20">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-site-accent" />
                        <div>
                          <div className="text-xs text-site-grey">Call Us</div>
                          <div className="font-semibold text-dark-base">
                            +971 56 472 7007
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-site-accent" />
                        <div>
                          <div className="text-xs text-site-grey">Email Us</div>
                          <div className="font-semibold text-dark-base">
                            info@thedrivehub.com
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-site-accent" />
                        <div>
                          <div className="text-xs text-site-grey">Visit Us</div>
                          <div className="font-semibold text-dark-base">
                            Dubai, UAE
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
