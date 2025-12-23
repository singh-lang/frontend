"use client";

import Link from "next/link";
import BlogCard from "./blogcard";
import type { Blog } from "@/lib/api/blog";

interface HomeBlogSectionProps {
  blogs: Blog[];
  title?: string;
  subtitle?: string;
  showViewAllButton?: boolean;
  maxItems?: number; // how many cards to show (default 3)
}

const HomeBlogSection = ({
  blogs,
  title = "Latest from Our Blog",
  subtitle = "Insights, tips, and stories to help you get more out of every drive.",
  showViewAllButton = true,
  maxItems = 3,
}: HomeBlogSectionProps) => {
  if (!blogs || blogs.length === 0) return null;

  // Show only a few on home, you can control via maxItems prop
  const visibleBlogs = blogs.slice(0, maxItems);

  return (
    <section className="bg-off-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-teal mb-2">
              Blog
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-dark-base">
              {title}
            </h2>
            <p className="text-sm md:text-base text-grey mt-2 max-w-xl">
              {subtitle}
            </p>
          </div>

          {showViewAllButton && (
            <div className="flex justify-start sm:justify-end">
              <Link
                href="/blog"
                prefetch={false}
                className="inline-flex items-center justify-center rounded-lg border border-site-accent/40 px-4 py-2 text-xs md:text-sm font-semibold text-site-accent hover:bg-site-accent hover:text-white transition-all duration-300 hover:shadow-md"
              >
                View all blogs
              </Link>
            </div>
          )}
        </div>

        {/* Cards grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleBlogs.map((blog) => (
            <BlogCard key={blog._id} post={blog} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeBlogSection;
