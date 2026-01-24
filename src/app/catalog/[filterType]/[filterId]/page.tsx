export const dynamic = "force-dynamic";
export const revalidate = 0;

import type { Metadata } from "next";
import CatalogHeader from "@/components/catalogue/CatalogHeader";
import CarCards from "@/components/catalogue/CarCards";
import ComparisonBar from "@/components/shared/ComparisonBar";
import HeroFormLayout from "@/components/home/HeroSearchComponent";
import SideFilterPanel from "@/components/catalogue/FilterPanel";

import { CarTypes } from "@/types/homePageTypes";
import {
  getCatalogData,
  getFilteredData,
  getFilterMasterData,
} from "@/lib/api/catalog";

import type { SearchParams } from "@/types/catalog";
import TopFiltersBar from "@/components/catalogue/TopFilterBar";

interface PageProps {
  params: Promise<{ filterType: string; filterId: string }>;
  searchParams: Promise<SearchParams>;
}

/* --------------------- METADATA --------------------- */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { filterId } = await params;

  return {
    title: `Best Cars for Rent`,
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

      {/* Main Layout */}
      <div className="w-full max-w-[1400px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* LEFT SIDE FILTER PANEL */}
          <div className="w-full">
            <SideFilterPanel />
          </div>

          {/* RIGHT SIDE CAR LIST */}
          <div className="w-full space-y-2">
            <TopFiltersBar data={masterData} />

            <CarCards data={data} />
            <ComparisonBar />
          </div>
        </div>
      </div>
    </>
  );
}
