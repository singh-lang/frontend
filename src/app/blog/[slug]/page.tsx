// src/app/blog/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useGetBlogBySlugQuery } from "@/lib/api/blog";
import BlogDetailLayout from "@/components/blog/BlogDetailLayout";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: blog, isLoading, isError } = useGetBlogBySlugQuery(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-off-white pt-32">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-sm text-grey">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="min-h-screen bg-off-white pt-32">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-sm text-red-500">Blog not found.</p>
        </div>
      </div>
    );
  }

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  const wordCount = blog.content?.split(/\s+/).length || 0;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  const meta = formattedDate
    ? `${formattedDate} • ${readTime} min read`
    : `${readTime} min read`;

  return (
    <BlogDetailLayout title={blog.title} content={blog.content} meta={meta} />
  );
}
