"use client";

import LocationPicker from "@/app/components/search-filters/LocationPicker";
import { useQuery } from "@tanstack/react-query";
import { getLocationsByName } from "../../queryFunctions";
import { observer, useObservable } from "@legendapp/state/react";
import debounce from "debounce";

const HotelLocationPicker = observer(function Component() {
  const textSearchTerm$ = useObservable("");
  const textSearchTerm = textSearchTerm$.get();

  const { data: locations, refetch } = useQuery({
    queryKey: ["locations", textSearchTerm],
    queryFn: () => getLocationsByName(textSearchTerm),
    enabled: !!textSearchTerm,
    select: (data) => data?.hotel_listing_locations,
    staleTime: 1000 * 60 * 15, // store for up to 15 minutes
  });

  const handleLocationSearch = debounce((searchTerm) => {
    textSearchTerm$.set(searchTerm);
    refetch();
  }, 700);

  return (
    <LocationPicker
      className="w-1/2 h-full"
      locations={locations ?? []}
      setSearchTerm={handleLocationSearch}
    />
  );
});

export default HotelLocationPicker;
