"use client";

import HotelList from "./components/HotelList";
import HotelQueryFilters from "./components/HotelFilters";
import HotelSearchForm from "./components/HotelSearchForm";

export default function Page() {
  return (
    <div className="max-w-default space-y-28">
      <div className="flex flex-col mt-10 gap-2">
        <HotelSearchForm />
        <HotelQueryFilters />
      </div>

      <HotelList />
    </div>
  );
}
