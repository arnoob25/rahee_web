"use client";

import HotelList from "./components/HotelList";
import HotelQueryFilters from "./components/HotelQueryFilters";

export default function Page() {
  return (
    <div className="max-w-default space-y-28">
      <HotelQueryFilters />
      <HotelList />
    </div>
  );
}
