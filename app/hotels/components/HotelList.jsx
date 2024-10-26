"use client";

import { useQuery } from "@tanstack/react-query";
import { getFilteredHotels } from "../queryFunctions";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const HotelList = () => {
  const searchParams = useSearchParams();
  const nameFilter = searchParams.get("name") || "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["hotelList", nameFilter],
    queryFn: getFilteredHotels(nameFilter),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  //console.log(data);

  return (
    <>
      {data?.hotel_listing_hotels?.map((hotel) => (
        <div key={hotel.hotelId}>
          <Link href={`/hotels/${hotel.hotelId}`}>{hotel.name}</Link>
        </div>
      ))}
    </>
  );
};

export default HotelList;
