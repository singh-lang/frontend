// src/app/blog/page.tsx
"use client";

import { useGetBlogsQuery } from "@/lib/api/blog";
import HomeBlogSection from "@/components/blog/HomeBlogSection";
import type { Blog } from "@/lib/api/blog";

export default function BlogPage() {
  const { data: blogs, isLoading, isError } = useGetBlogsQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-off-white pt-32">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-sm text-grey">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (isError || !blogs) {
    return (
      <div className="min-h-screen bg-off-white pt-32">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-sm text-red-500">No blogs found.</p>
        </div>
      </div>
    );
  }

  return (
    <HomeBlogSection
      blogs={blogs as Blog[]}
      maxItems={blogs.length}
      showViewAllButton={false} // 👈 fixed
      title="All Articles"
      subtitle="Browse all our latest posts and insights."
    />
  );
}
