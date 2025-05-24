"use client";

import { observer } from "@legendapp/state/react";
import { HotelCard } from "./HotelCard";
import useGetHotels from "../data/useGetHotels";

const HotelList = observer(function HotelList() {
  const { hotels, isLoading, error } = useGetHotels();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col gap-4">
      {hotels.map((hotel) => (
        <HotelCard key={hotel._id} hotelData={hotel} />
      ))}
    </div>
  );
});

export default HotelList;
