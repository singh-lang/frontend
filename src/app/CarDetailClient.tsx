"use client";

import PriceBlock from "@/components/car/PriceBlock";
import ButtonsSection from "@/components/car/ButtonsSection";
import { useGetDepositFreePricingFrontendQuery } from "@/lib/api/depositFreeFrontendApi";
import { type CarTypes } from "@/types/homePageTypes";

interface Props {
  car: CarTypes;
}

const CarDetailClient = ({ car }: Props) => {
  const carId = car?._id;

  const { data: depositFreeRes } = useGetDepositFreePricingFrontendQuery(
    carId,
    {
      skip: !carId,
    }
  );

  const depositFreeDailyFee = depositFreeRes?.data?.daily ?? 0;

  return (
    <>
      <PriceBlock data={car} depositFreeDailyFee={depositFreeDailyFee} />
      <ButtonsSection car={car} />
    </>
  );
};

export default CarDetailClient;
