import { DollarSign, TrendingUp, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
const VendorBanner = () => {
  return (
    <div className="bg-gradient-to-r from-site-accent to-slate-teal rounded-3xl overflow-hidden shadow-2xl">
      <div className="relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJWMzZoLTJ6bS0yIDJoMnYyaC0ydi0yem0yIDJoMnYyaC0ydi0yem0yLTJoMnYyaC0ydi0yem0wLTJoMnYyaC0ydi0yem0tNCAwaC0ydjJoMnYtMnptMC0yaC0ydjJoMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

        <div className="relative px-6 md:px-12 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 mb-4">
                <DollarSign className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  For Vendors
                </span>
              </div>

              <h2
                className="text-3xl md:text-5xl font-bold text-white mb-4"
                style={{ fontFamily: "Stretch Pro, sans-serif" }}
              >
                Turn Your Cars Into
                <br />
                Passive Income
              </h2>

              <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed">
                Join hundreds of successful vendors on The Drive Hub. List your
                vehicles and start earning today.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Image
                      src="/assets/dirham.svg"
                      alt="Dirham Icon"
                      width={20}
                      height={20}
                      className="w-5 h-5 invert brightness-0"
                    />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      Make upto AED 15k{" "}
                    </div>
                    <div className="text-xs text-white/80">
                      in monthly earnings
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">500+</div>
                    <div className="text-xs text-white/80">
                      Verified Rental Partners
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">100%</div>
                    <div className="text-xs text-white/80">
                      Secure Payments & Customer Trust
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/becomevendor"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-site-accent rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  Become a Vendor
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="lg:w-96 hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/30"></div>
                <div className="relative p-6 space-y-3">
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-sm font-bold">✓</span>
                    </div>
                    <span className="text-sm font-semibold">
                      No listing fees
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-sm font-bold">✓</span>
                    </div>
                    <span className="text-sm font-semibold">
                      Set your own rates
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-sm font-bold">✓</span>
                    </div>
                    <span className="text-sm font-semibold">
                      Full insurance coverage
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-sm font-bold">✓</span>
                    </div>
                    <span className="text-sm font-semibold">
                      24/7 vendor support
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-sm font-bold">✓</span>
                    </div>
                    <span className="text-sm font-semibold">
                      Easy dashboard management
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-sm font-bold">✓</span>
                    </div>
                    <span className="text-sm font-semibold">
                      Verified renters only
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorBanner;
