"use client";

import { Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Blog } from "@/lib/api/blog"; // 👈 adjust path if needed

interface BlogCardProps {
  post: Blog;
}

const BlogCard = ({ post }: BlogCardProps) => {
  // 👇 Prefer backend thumbnail, fallback to placeholder
  const [imgSrc, setImgSrc] = useState(
    post.thumbnail?.url || "/assets/blog_placeholder.jpg"
  );

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  // 👇 Build excerpt from content, strip basic markdown like **bold**
  const excerpt = useMemo(() => {
    if (!post.content) return "";
    const withoutBold = post.content.replace(/\*\*(.*?)\*\*/g, "$1");
    const singleLine = withoutBold.replace(/\s+/g, " ").trim();
    if (singleLine.length <= 140) return singleLine;
    return singleLine.slice(0, 140) + "...";
  }, [post.content]);

  return (
    <div className="flex-shrink-0 h-fit w-full sm:w-[340px] bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-out-cubic group border border-soft-grey/30">
      <Link href={`/blog/${post.slug}`} className="block" prefetch={false}>
        <div className="relative h-40 md:h-44 overflow-hidden bg-gradient-to-br from-slate-teal/5 to-transparent">
          <Image
            src={imgSrc}
            alt={post.title}
            className="w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out-cubic object-cover"
            height={960}
            width={1280}
          />

          {/* Optional badge / label */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-semibold text-slate-teal shadow-lg">
            Blog
          </div>
        </div>
      </Link>

      <div className="p-3 flex flex-col gap-2">
        {/* Title */}
        <Link href={`/blog/${post.slug}`} prefetch={false}>
          <h3 className="text-base font-bold text-dark-base mb-1 group-hover:text-slate-teal transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Meta (date + read time placeholder) */}
        <div className="flex items-center gap-3 text-[10px] text-grey mb-1">
          {formattedDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-teal" />
              <span>{formattedDate}</span>
            </div>
          )}
          {/* If later you compute read time in backend, you can use post.readTimeMinutes */}
        </div>

        {/* Content / Excerpt */}
        <p className="text-[11px] text-grey leading-relaxed line-clamp-3">
          {excerpt}
        </p>

        {/* Footer: Read more button */}
        <div className="mt-2 pt-2 border-t border-soft-grey/30">
          <Link
            href={`/blog/${post.slug}`}
            prefetch={false}
            className="inline-flex items-center justify-center gap-1 bg-gradient-to-r from-site-accent to-slate-teal hover:from-site-accent/90 hover:to-slate-teal text-white px-3 py-1.5 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg text-[11px] group/btn"
          >
            <span>Read More</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
