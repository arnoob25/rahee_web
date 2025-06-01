"use client";

import { useQueries } from "@tanstack/react-query";
import { graphQLRequest } from "@/lib/api/graphql-client";
import { useGetFilterValuesFromURL } from "./hotelFilters";
import { MIN_ALLOWED_PRICE, PRICE_CALCULATION_METHODS } from "../config";
import { differenceInDays } from "date-fns";

export default function useGetFilteredHotels(shouldQuery = false) {
  const [filterValues, roomConfigs] = useGetFilterValuesFromURL();

  const queries = useQueries({
    queries: roomConfigs.map(({ id, adults, children }) => ({
      queryKey: ["filtered_hotels", id],
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
    if (!shouldQuery) return;
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
      accommodationType
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

  const stayDuration = differenceInDays(
    filters.checkOutDate,
    filters.checkInDate
  );

  const queryVariables = {
    filters: {
      ...filters,
      // calculate what prices per night must be to account for total stay duration
      minPrice: adjustPriceForCalcMethod(
        filters.minPrice,
        stayDuration,
        priceCalcMethod
      ),
      maxPrice: adjustPriceForCalcMethod(
        filters.maxPrice,
        stayDuration,
        priceCalcMethod
      ),
    },
    checkInDate: filters.checkInDate,
    checkOutDate: filters.checkOutDate,
  };

  return graphQLRequest(FILTER_HOTELS, queryVariables);
}

function adjustPriceForCalcMethod(initialPrice, stayDuration, calcMethod) {
  const adjustedPrice =
    calcMethod === PRICE_CALCULATION_METHODS.TOTAL_STAY
      ? initialPrice / stayDuration
      : initialPrice;

  return adjustedPrice < MIN_ALLOWED_PRICE ? MIN_ALLOWED_PRICE : adjustedPrice;
}
