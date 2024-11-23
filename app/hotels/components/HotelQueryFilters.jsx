"use client";

import DateRangePicker from "@/app/components/search-filters/DateRangePicker";
import HotelLocationPicker from "./filters/LocationPicker";
import RoomAndGuestSelector from "./filters/RoomAndGuestSelector";
import FilterSelector from "./filters/FilterSelector";
import GuestRatingSelector from "./filters/GuestRatingSelector";
import PriceRangeSelector from "./filters/PriceRangeSelector";
import AccommodationSelector from "./filters/AccommodationTypeSelector";
import HotelListSortingOptions from "./filters/SortingOptions";

export default function HotelQueryFilters() {
  return (
    <div className="flex flex-col p-4 gap-2 max-w-[1000px]">
      <div className="flex flex-row justify-stretch items-stretch gap-2">
        <HotelLocationPicker />
        <DateRangePicker />
        <RoomAndGuestSelector />
      </div>
      <div className="flex items-start overflow-x-scroll gap-2">
        <HotelListSortingOptions />
        <PriceRangeSelector />
        <FilterSelector />
        <GuestRatingSelector />
        <AccommodationSelector />
      </div>
    </div>
  );
}
