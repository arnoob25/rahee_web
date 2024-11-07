"use client";

import DateRangePicker from "@/app/components/search-filters/DateRangePicker";
import HotelLocationPicker from "./HotelLocationPicker";
import RoomAndGuestSelector from "./RoomAndGuestSelector";

export default function HotelQueryFilters() {
  return (
    <div className="flex flex-row justify-stretch items-stretch gap-2 p-4 max-w-[1000px]">
      <HotelLocationPicker />
      <DateRangePicker />
      <RoomAndGuestSelector />
    </div>
  );
}
