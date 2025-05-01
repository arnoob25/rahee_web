import { graphQLRequest } from "../../lib/api/graphql-client";
import { useQuery } from "@tanstack/react-query";

const getLocationsByName = (name) =>
  graphQLRequest(
    `query Request($name: Hotel_listing_VarcharBoolExp = {_ilike: ""}) {
      hotel_listing_locations(limit: 5, where: {name: $name}, order_by: {name: Asc}) {
        locationId
        name
        type
        region
        country
      }
    }`,
    { name: { _ilike: `%${name}%` } }
  );

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
