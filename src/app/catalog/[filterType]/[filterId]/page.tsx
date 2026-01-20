export const dynamic = "force-dynamic";
export const revalidate = 0;

import type { Metadata } from "next";
import CatalogHeader from "@/components/catalogue/CatalogHeader";
import SortingBar from "@/components/catalogue/SortingBar";
import CarCards from "@/components/catalogue/CarCards";
import CatalogSearchBox from "@/components/catalogue/CatalogSearchBox";
import ComparisonBar from "@/components/shared/ComparisonBar";
import TopFiltersBar from "@/components/catalogue/TopFilterBar";
import MobileSearch from "@/components/catalogue/MobileSearch";
import { CarTypes } from "@/types/homePageTypes";

import {
  getCatalogData,
  getFilteredData,
  getFilterMasterData,
} from "@/lib/api/catalog";

import type { SearchParams } from "@/types/catalog";

interface PageProps {
  params: Promise<{ filterType: string; filterId: string }>;
  searchParams: Promise<SearchParams>;
}

/* --------------------- METADATA --------------------- */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { filterType, filterId } = await params;

  return {
    title: `${filterId} Cars for Rent`,
    description: `Find ${filterId} cars for rent in UAE`,
    robots: { index: true, follow: true },
  };
}

/* --------------------- PAGE --------------------- */
export default async function Page({ params, searchParams }: PageProps) {
  const { filterType, filterId } = await params;
  const sp = await searchParams;

  const masterData = (await getFilterMasterData())?.data;

  // SAFE PAGE VALUE
  const currentPage = sp.page && Number(sp.page) > 0 ? Number(sp.page) : 1;

  // CHECK ACTIVE FILTERS
  const hasFilters = [
    sp.brand,
    sp.bodyType,
    sp.location,
    sp.priceRange,
    sp.startDate,
    sp.endDate,
  ].some(Boolean);

  /* --------------------- FETCH CARS --------------------- */
  const apiRes = hasFilters
    ? await getFilteredData({ ...sp, page: String(currentPage) })
    : await getCatalogData(filterType, filterId, String(currentPage));

  const rawData = apiRes.data;

  /* --------------------- SAFE CASTING --------------------- */
  const data: { docs: CarTypes[]; page: number; totalPages: number } = {
    docs: rawData.docs as unknown as CarTypes[],
    page: rawData.page,
    totalPages: rawData.totalPages,
  };

  /* --------------------- UI --------------------- */
  return (
    <>
      <CatalogHeader data={masterData} />
      {/* ✅ MOBILE */}
      <div className="block md:hidden sticky top-0 z-9999">
        <div className="px-4 pt-3 pb-2  border-gray-200">
          <MobileSearch />
        </div>

        <div className="px-1 pb-3">
          <TopFiltersBar data={masterData} />
        </div>
      </div>

      {/* ✅ DESKTOP */}
      <div className="hidden md:block sticky top-0 mt-8 z-20">
        <TopFiltersBar data={masterData} />
      </div>

      <div className="max-w-480  mx-auto px-4 sm:px-6 py-8">
        <div className="w-full block sm:flex sm:gap-6">
          {/* LEFT FILTERS */}

          {/* RIGHT CONTENT */}
          <div className="max-w-7xl mx-auto px-4 -mt-8 pb-20 space-y-8">
            {/* <CatalogSearchBox /> */}
            {/* <SortingBar categories={masterData?.categories || []} /> */}
            <CarCards data={data} />
            <ComparisonBar />
          </div>
        </div>
      </div>
    </>
  );
}
