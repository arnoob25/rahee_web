"use client";

import HotelCard from "./HotelCard";
import useFetchFilteredHotelsFromURL from "../hooks/useFetchFilteredHotelsFromURL";

const HotelList = () => {
  const { data, isLoading, error } = useFetchFilteredHotelsFromURL();

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
