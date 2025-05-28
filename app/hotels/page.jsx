"use client";

import { Suspense } from "react";
import HotelList from "./components/HotelList";
import HotelQueryFilters from "./components/HotelQueryFilters";
import useGetFilteredHotels from "./data/getHotels";

const Page = () => (
  <Suspense>
    <FiltersAndList />
  </Suspense>
);

function FiltersAndList() {
  const { groupedHotels, isLoading, getHotels } = useGetFilteredHotels();
  const hotels = groupedHotels[0].hotels;

  return (
    <div className="max-w-default space-y-28">
      <HotelQueryFilters onGetHotels={getHotels} />
      <HotelList hotels={hotels} isLoading={isLoading} />
    </div>
  );
}

export default Page;
