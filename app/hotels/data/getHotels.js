"use client";

import { useQueries } from "@tanstack/react-query";
import { graphQLRequest } from "@/lib/api/graphql-client";
import { useGetFilterValuesFromURL } from "./hotelFilters";

export default function useGetFilteredHotels() {
  const [filterValues, roomConfigs] = useGetFilterValuesFromURL();

  const queries = useQueries({
    queries: roomConfigs.map(({ id, adults, children }) => ({
      queryKey: [
        "filtered_hotels",
        id,
        adults,
        children,
        filterValues.locationId,
        filterValues.checkInDate,
        filterValues.checkOutDate,
      ],
      queryFn: () => getFilteredHotels({ ...filterValues, adults, children }),
      select: (data) => data.filterHotels,
      enabled: false, // don't fetched automatically
    })),
  });

  const hotelsGroupedByRoomConfig = queries.map((query, index) => {
    const roomConfig = roomConfigs[index];

    return {
      ...roomConfig,
      hotels: query.data ?? [],
    };
  });

  const commonHotels = queries.every((q) => q.data)
    ? queries
        .map((q) => q.data.map((hotel) => hotel._id))
        .reduce((acc, ids) => acc.filter((id) => ids.includes(id)), [])
    : [];

  const handleFilteringHotels = () => {
    queries.forEach((q) => q.refetch());
  };

  return {
    isLoading: false, // TODO properly implement the loading process
    commonHotels,
    groupedHotels: hotelsGroupedByRoomConfig,
    getHotels: handleFilteringHotels,
  };
}

function getFilteredHotels({ priceCalcMethod, ...filters }) {
  const FILTER_HOTELS = `query FilterHotels($filters: FilterHotelsInput!, $checkInDate: String!, $checkOutDate: String!) {
    filterHotels(filters: $filters) {
      _id
      name
      description
      stars
    reviewScore
      reviewCount
      startingPrice
      facilities
      policies
      availableRoomCount(checkInDate: $checkInDate, checkOutDate: $checkOutDate)
      media {
        _id
        caption
        isCover
        isFeatured
        url
      }
    }
  }`;

  const queryVariables = {
    filters,
    checkInDate: filters.checkInDate,
    checkOutDate: filters.checkOutDate,
  };

  return graphQLRequest(FILTER_HOTELS, queryVariables);
}
