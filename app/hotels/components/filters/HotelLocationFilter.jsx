"use client";

import LocationFilter from "@/app/components/search-filters/LocationFilter";
import { useQuery } from "@tanstack/react-query";
import { getLocationsByName } from "../../queryFunctions";
import { observer, useObservable } from "@legendapp/state/react";
import debounce from "debounce";
import { useRouter, useSearchParams } from "next/navigation";

const HotelLocationFilter = observer(function Component() {
  const textSearchTerm$ = useObservable("");
  const textSearchTerm = textSearchTerm$.get();

  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, refetch } = useQuery({
    queryKey: ["locations", textSearchTerm],
    queryFn: () => getLocationsByName(textSearchTerm),
    enabled: !!textSearchTerm,
    staleTime: 1000 * 60 * 15, // store for up to 15 minutes
  });

  const handleLocationSearch = debounce((e) => {
    const userQuery = e.target.value;
    textSearchTerm$.set(userQuery);
    refetch();
  }, 700);

  function handleLocationSelection(location) {
    const params = new URLSearchParams(searchParams);
    params.set("location", `${location.name}_${location.locationId}`);
    router.replace(`?${params.toString()}`);
  }

  function handleLocationDeselection() {
    const params = new URLSearchParams(searchParams);
    params.delete("location");
    router.replace(`?${params.toString()}`);
  }

  return (
    <LocationFilter
      locations={data?.hotel_listing_locations ?? []}
      onSearch={handleLocationSearch}
      onSelect={handleLocationSelection}
      onDeselect={handleLocationDeselection}
    />
  );
});

export default HotelLocationFilter;
