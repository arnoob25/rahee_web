"use client";

import HotelCard from "./HotelCard";
import useFetchFilteredHotelsFromURL from "../hooks/useFetchFilteredHotelsFromURL";
import { observable } from "@legendapp/state";

export const selectedFilters$ = observable([]);

const HotelList = () => {
  const { data, isLoading, error } = useFetchFilteredHotelsFromURL();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      {data?.map((hotel) => (
        <HotelCard key={hotel.hotelId} hotelData={hotel} />
      ))}
    </>
  );
};

export default HotelList;
