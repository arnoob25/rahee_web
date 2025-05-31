"use client";

import { useURLParams } from "@/hooks/use-url-param";
import { HotelCard } from "./HotelCard";
import { useState } from "react";

export default function HotelList({ hotels, isLoading }) {
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const { updateURLParam } = useURLParams();

  const handleHotelSelection = (hotelId) => {
    if (hotelId === selectedHotelId) return;

    updateURLParam("hotel", hotelId);
    setSelectedHotelId(hotelId);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      {hotels.map((hotel) => (
        <HotelCard
          key={hotel._id}
          hotelData={hotel}
          onSelect={handleHotelSelection}
        />
      ))}
    </div>
  );
}
