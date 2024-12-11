"use client";

import FilterSelector from "./filters/FilterSelector";
import GuestRatingSelector from "./filters/GuestRatingSelector";
import PriceRangeSelector from "./filters/PriceRangeSelector";
import AccommodationSelector from "./filters/AccommodationTypeSelector";
import HotelListSortingOptions from "./filters/SortingOptions";

export default function HotelQueryFilters() {
  return (
    <div className="flex items-start gap-2 overflow-x-scroll">
      <HotelListSortingOptions />
      <PriceRangeSelector />
      <FilterSelector />
      <GuestRatingSelector />
      <AccommodationSelector />
    </div>
  );
}
