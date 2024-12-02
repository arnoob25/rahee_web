import { getLocationsByName } from "@/api/queryFunctions";
import { useQuery } from "@tanstack/react-query";

export function useGetLocationByName(textSearchTerm) {
  const { data: locations, refetch } = useQuery({
    queryKey: ["locations", textSearchTerm],
    queryFn: () => getLocationsByName(textSearchTerm),
    enabled: !!textSearchTerm,
    select: (data) => data?.hotel_listing_locations,
    staleTime: 1000 * 60 * 15, // store for up to 15 minutes
  });

  return [locations, refetch];
}
