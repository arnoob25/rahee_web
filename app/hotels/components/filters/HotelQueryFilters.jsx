"use client";

import DateRangePicker from "@/app/components/search-filters/DateRangePicker";
import HotelLocationPicker from "./HotelLocationPicker";
import RoomAndGuestSelector from "./RoomAndGuestSelector";
import SecondaryFilters from "./SecondaryFilters";

export default function HotelQueryFilters() {
  return (
    <div className="flex flex-col p-4 gap-2 max-w-[1000px]">
      <div className="flex flex-row justify-stretch items-stretch gap-2">
        <HotelLocationPicker />
        <DateRangePicker />
        <RoomAndGuestSelector />
      </div>
      <div>
        <SecondaryFilters />
      </div>
    </div>
  );
}
