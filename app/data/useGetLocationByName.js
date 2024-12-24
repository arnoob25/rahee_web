import { getLocationsByName } from "@/api/queryFunctions";
import { useQuery } from "@tanstack/react-query";

export function useGetLocationByName(textSearchTerm) {
  const isSearchTermValid = textSearchTerm?.trim().length > 0;

  const {
    data: locations,
    error,
    status,
    refetch,
  } = useQuery({
    queryKey: ["locations", textSearchTerm],
    queryFn: () =>
      // only request with valid search term
      isSearchTermValid ? getLocationsByName(textSearchTerm) : null,
    enabled: isSearchTermValid,
    select: (data) => data?.hotel_listing_locations,
    staleTime: 1000 * 60 * 15, // Cache for 15 minutes
  });

  return { locations, error, status, refetch };
}
