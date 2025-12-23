"use client";

import { Users, Award, Shield, Heart, TrendingUp } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/home/Navbar";
import SectionHeader from "@/components/shared/SectionHeader";
import ComparisonBar from "@/components/shared/ComparisonBar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BlogDetailLayoutProps {
  title: string;
  content: string; // markdown string from API
  meta?: string; // e.g. "11 Nov 2025 • 5 min read"
}

const values = [
  {
    icon: Shield,
    title: "Trust & Safety",
    description:
      "Every vehicle is verified and maintained to the highest standards. Your safety is our top priority.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description:
      "We offer only the finest vehicles from top brands, ensuring an exceptional driving experience.",
  },
  {
    icon: Users,
    title: "Customer First",
    description:
      "Our dedicated team works tirelessly to provide you with personalized service and 24/7 support.",
  },
  {
    icon: Heart,
    title: "Passion for Cars",
    description:
      "We are car enthusiasts who understand the joy of driving and sharing amazing vehicles.",
  },
];

const BlogDetailLayout = ({ title, content, meta }: BlogDetailLayoutProps) => {
  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Page header */}
          <div className="text-center mb-16">
            <SectionHeader
              eyebrow="Blog"
              title={title}
              subtitle={meta || "Insights and stories from The Drive Hub."}
            />
          </div>

          {/* Blog Content */}
          <div className="mb-20 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-soft-grey/30">
              <article className="prose prose-sm md:prose-base max-w-none text-dark-base prose-headings:text-dark-base prose-strong:text-dark-base prose-a:text-site-accent prose-li:marker:text-slate-teal">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => (
                      <p className="mb-4 leading-relaxed text-grey">
                        {children}
                      </p>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </article>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-dark-base mb-4">
                Our Core Values
              </h2>
              <p className="text-grey text-lg max-w-3xl mx-auto">
                The principles that guide everything we do.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="group bg-white p-8 rounded-2xl shadow-lg border border-soft-grey/30 hover:border-accent/30 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-site-accent/10 to-slate-teal/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-8 h-8 text-site-accent" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-dark-base mb-2 group-hover:text-site-accent transition-colors">
                          {value.title}
                        </h3>
                        <p className="text-grey leading-relaxed text-base">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-site-accent to-slate-teal rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -ml-32 -mt-32" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -mr-32 -mb-32" />
            </div>
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Ready to Experience Luxury?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust The Drive Hub
                for their luxury car rental needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/catalog/all/cars"
                  className="inline-flex items-center justify-center gap-2 bg-white text-site-accent px-8 py-4 rounded-xl font-bold transition hover:scale-105 hover:shadow-xl"
                >
                  Browse Our Fleet
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition hover:scale-105"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ComparisonBar />
    </div>
  );
};

export default BlogDetailLayout;
