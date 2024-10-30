"use client";

import { useQuery } from "@tanstack/react-query";
import { getFilteredHotels } from "../queryFunctions";
import { useSearchParams } from "next/navigation";
import HotelCard from "./HotelCard";

const HotelList = () => {
  const searchParams = useSearchParams();
  const nameFilter = searchParams.get("name") || "hotel";

  const { data, isLoading, error } = useQuery({
    queryKey: ["hotelList", nameFilter],
    queryFn: () => getFilteredHotels(nameFilter),
    enabled: !!nameFilter,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      {data?.hotel_listing_hotels?.map((hotel) => (
        <HotelCard key={hotel.hotelId} hotelData={hotel} />
      ))}
    </>
  );
};

export default HotelList;
