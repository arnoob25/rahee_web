"use client";

import { observer } from "@legendapp/state/react";
import { HotelCard } from "./HotelCard";
import { appliedFilters$, sortingOptions$ } from "../store";
import { filterHotels, sortHotels } from "../utils";
import { useGetFilteredHotelsFromURL } from "../api/useGetFilteredHotelsFromURL";
import { HOTEL_LIST } from "../api/mockData";

// TODO: Extract duration dynamically from URL
const STAY_DURATION_DAYS = 5;

const HotelList = observer(function HotelList() {
  //const { data: hotels, isLoading, error } = useGetFilteredHotelsFromURL();
  const hotels = HOTEL_LIST.hotel_listing_hotels; // TODO uncomment the query and remove mock data

  const filteredHotels = hotels
    ? filterHotels(hotels, STAY_DURATION_DAYS, appliedFilters$.get())
    : [];

  // TODO filter by room numbers
  // TODO filter by accommodation type
  // TODO check if sorting by rating works or not
  const sortedHotels = sortHotels(filteredHotels, sortingOptions$.get());

  // TODO: uncomment error handling
  /* if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>; */

  return (
    <div className="flex flex-col gap-4 px-4">
      {sortedHotels.map((hotel) => (
        <HotelCard key={hotel.hotelId} hotelData={hotel} />
      ))}
    </div>
  );
});

export default HotelList;
