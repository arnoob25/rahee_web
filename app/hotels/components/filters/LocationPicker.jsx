"use client";

import LocationPicker from "@/app/components/search-filters/LocationPicker";
import { observer, useObservable } from "@legendapp/state/react";
import debounce from "debounce";
import { useGetLocationByName } from "@/app/data/useGetLocationByName";
import { FALLBACK_LOCATIONS } from "../../data/initialData";

const HotelLocationPicker = observer(function Component() {
  const textSearchTerm$ = useObservable("");
  const textSearchTerm = textSearchTerm$.get();

  const { locations, status, refetch } = useGetLocationByName(textSearchTerm);

  const handleLocationSearch = debounce((searchTerm) => {
    textSearchTerm$.set(searchTerm);
    refetch();
  }, 700);

  return (
    <LocationPicker
      locations={locations}
      locationQueryStatus={status}
      fallbackLocations={FALLBACK_LOCATIONS}
      setSearchTerm={handleLocationSearch}
      className="w-1/2 h-full min-w-fit"
    />
  );
});

export default HotelLocationPicker;
