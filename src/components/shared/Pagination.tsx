"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  page: number;
  onPageChange?: (page: number) => void;
}

const Pagination = ({ totalPages, page, onPageChange }: PaginationProps) => {
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    onPageChange?.(newPage);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    const showLeftEllipsis = page > 4;
    const showRightEllipsis = page < totalPages - 3;

    pages.push(1);
    if (showLeftEllipsis) pages.push("…");

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (showRightEllipsis) pages.push("…");

    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-100 transition"
      >
        <ChevronLeft size={18} />
      </button>

      {pageNumbers.map((p, i) =>
        typeof p === "string" ? (
          <span
            key={`ellipsis-${i}`}
            className="px-3 py-2 text-gray-500 select-none"
          >
            {p}
          </span>
        ) : (
          <button
            key={`page-${p}`}
            onClick={() => handlePageChange(p)}
            className={`px-3 py-2 rounded-lg border text-sm transition ${
              p === page
                ? "bg-gradient-to-r from-site-accent to-slate-teal text-white border-transparent"
                : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-100 transition"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
