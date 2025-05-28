"use client";

import { HotelCard } from "./HotelCard";

export default function HotelList({ hotels, isLoading }) {
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      {hotels.map((hotel) => (
        <HotelCard key={hotel._id} hotelData={hotel} />
      ))}
    </div>
  );
}
