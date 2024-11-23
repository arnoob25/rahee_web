"use client";

import { observer } from "@legendapp/state/react";
import { HotelCard } from "./HotelCard";
import useFetchFilteredHotelsFromURL from "../hooks/useFetchFilteredHotelsFromURL";
import { appliedFilters$, sortingOptions$ } from "../store";
import { filterHotels, sortHotels } from "../utils";

// TODO: Extract duration dynamically from URL
const STAY_DURATION_DAYS = 5;

const HotelList = observer(function HotelList() {
  const { data: hotels, isLoading, error } = useFetchFilteredHotelsFromURL();

  const filteredHotels = hotels
    ? filterHotels(hotels, STAY_DURATION_DAYS, appliedFilters$.get())
    : [];

  // TODO filter by room numbers
  // TODO filter by accommodation type
  // TODO check if sorting by rating works or not
  const sortedHotels = sortHotels(filteredHotels, sortingOptions$.get());

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col px-4 gap-4">
      {sortedHotels.map((hotel) => (
        <HotelCard key={hotel.hotelId} hotelData={hotel} />
      ))}
    </div>
  );
});

export default HotelList;
