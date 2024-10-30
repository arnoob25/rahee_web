"use client";

import LocationFilter from "@/app/components/search-filters/LocationFilter";
import { useQuery } from "@tanstack/react-query";
import { getLocationsByName } from "../../queryFunctions";
import { observer, useObservable } from "@legendapp/state/react";
import debounce from "debounce";

const HotelLocationFilter = observer(function Component() {
  const textSearchTerm$ = useObservable("");
  const textSearchTerm = textSearchTerm$.get();

  const { data, refetch } = useQuery({
    queryKey: ["locations", textSearchTerm],
    queryFn: () => getLocationsByName(textSearchTerm),
    enabled: !!textSearchTerm,
    staleTime: 1000 * 60 * 15, // store for up to 15 minutes
  });

  const handleLocationSearch = debounce((searchTerm) => {
    textSearchTerm$.set(searchTerm);
    refetch();
  }, 700);

  return (
    <LocationFilter
      locations={data?.hotel_listing_locations ?? []}
      setSearchTerm={handleLocationSearch}
    />
  );
});

export default HotelLocationFilter;
