"use client";

import LocationPicker from "@/app/components/search-filters/LocationPicker";
import { useGetLocationByName } from "@/api/useGetLocationByName";
import { observer, useObservable } from "@legendapp/state/react";
import debounce from "debounce";

const HotelLocationPicker = observer(function Component() {
  const textSearchTerm$ = useObservable("");
  const textSearchTerm = textSearchTerm$.get();

  const [locations, refetch] = useGetLocationByName (textSearchTerm);

  const handleLocationSearch = debounce((searchTerm) => {
    textSearchTerm$.set(searchTerm);
    refetch();
  }, 700);

  return (
    <LocationPicker
      className="w-1/2 min-w-fit h-full"
      locations={locations ?? []}
      setSearchTerm={handleLocationSearch}
    />
  );
});

export default HotelLocationPicker;
