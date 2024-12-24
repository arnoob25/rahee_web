"use client";

import { observer } from "@legendapp/state/react";
import { HotelCard } from "./HotelCard";
import useGetFilteredAndSortedHotels from "../data/useGetFilteredAndSortedHotels";

const HotelList = observer(function HotelList() {
  const { sortedHotels, isLoading, error } = useGetFilteredAndSortedHotels();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col gap-4 px-4">
      {sortedHotels.map((hotel) => (
        <HotelCard key={hotel.hotelId} hotelData={hotel} />
      ))}
    </div>
  );
});

export default HotelList;
