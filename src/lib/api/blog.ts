import { baseApi } from "./baseApi";

export interface BlogThumbnail {
  url: string;
  key: string;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: BlogThumbnail; // 👈 NEW optional field
  __v?: number;
}

interface BlogListApiResponse {
  success: boolean;
  data: {
    docs: Blog[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
}

interface BlogSingleApiResponse {
  success: boolean;
  data: Blog;
}

export const blogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /blogs
    getBlogs: build.query<Blog[], void>({
      query: () => ({
        url: "/blogs",
        method: "GET",
      }),
      transformResponse: (response: BlogListApiResponse) => {
        // you now get thumbnail inside each Blog if present
        return response.data.docs;
      },
    }),

    // GET /blog/:slug
    getBlogBySlug: build.query<Blog, string>({
      query: (slug) => ({
        url: `/blog/${slug}`,
        method: "GET",
      }),
      transformResponse: (response: BlogSingleApiResponse) => {
        return response.data;
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetBlogsQuery, useGetBlogBySlugQuery } = blogApi;
