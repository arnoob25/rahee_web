"use client";

import HotelList from "./components/HotelList";
import HotelQueryFilters from "./components/HotelQueryFilters";
import useGetFilteredHotels from "./data/getHotels";

export default function Page() {
  const { groupedHotels, isLoading, getHotels } = useGetFilteredHotels();
  const hotels = groupedHotels[0].hotels;

  return (
    <div className="max-w-default space-y-28">
      <HotelQueryFilters onGetHotels={getHotels} />
      <HotelList hotels={hotels} isLoading={isLoading} />
    </div>
  );
}
