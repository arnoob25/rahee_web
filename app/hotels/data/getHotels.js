"use client";

import { useQueries } from "@tanstack/react-query";
import { graphQLRequest } from "@/lib/api/graphql-client";
import { splitAndGetPart } from "@/lib/string-parsers";
import { useURLParams } from "@/hooks/use-url-param";
import {
  INITIAL_PRICE_RANGE,
  MIN_ADULT_GUEST_FOR_ROOM,
  MIN_CHILD_GUEST_FOR_ROOM,
  PRICE_CALCULATION_METHODS,
} from "../config";

export default function useGetHotels() {
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

export function useGetFilterValuesFromURL() {
  const { getParamByKey } = useURLParams();

  // Extract filter values
  const city = getParamByKey("city");
  const locationParam = getParamByKey("location");
  const locationId = splitAndGetPart(locationParam, "_", "last");

  const checkInDate = getParamByKey("fromDate");
  const checkOutDate = getParamByKey("toDate");

  const rooms = parseInt(getParamByKey("rooms")) || 1;
  const adultGuests = getParamByKey("adults")?.split(",") ?? [
    MIN_ADULT_GUEST_FOR_ROOM,
  ];
  const childGuests = getParamByKey("children")?.split(",") ?? [
    MIN_CHILD_GUEST_FOR_ROOM,
  ];

  const roomConfigs = Array.from({ length: rooms }, (_, index) => ({
    id: index,
    adults: Number.isNaN(parseInt(adultGuests[index]))
      ? MIN_ADULT_GUEST_FOR_ROOM
      : parseInt(adultGuests[index]),
    children: Number.isNaN(parseInt(childGuests[index]))
      ? MIN_CHILD_GUEST_FOR_ROOM
      : parseInt(childGuests[index]),
  }));

  const priceSort = getParamByKey("priceSort");
  const popularitySort = getParamByKey("popularitySort");

  const minPrice =
    parseFloat(getParamByKey("minPrice")) ?? INITIAL_PRICE_RANGE.minPrice;
  const maxPrice =
    parseFloat(getParamByKey("maxPrice")) ?? INITIAL_PRICE_RANGE.maxPrice;

  const priceCalcMethod =
    getParamByKey("priceCalcMethod") ?? PRICE_CALCULATION_METHODS.night;

  const tags = getParamByKey("tags")?.split(",") ?? null;
  const facilities = getParamByKey("facilities")?.split(",") ?? null;
  const amenities = getParamByKey("amenities")?.split(",") ?? null;

  const stars = parseInt(getParamByKey("stars")) ?? null;
  const minRating = parseFloat(getParamByKey("minRating")) ?? null;

  // TODO validate filter values

  // TODO to implement filtering by total stay price, adjust min and max prices my dividing entire price by stay duration

  const filterValues = {
    city,
    locationId,
    checkInDate,
    checkOutDate,
    priceSort,
    popularitySort,
    minPrice,
    maxPrice,
    priceCalcMethod,
    tags,
    facilities,
    amenities,
    stars: Number.isNaN(stars) ? null : stars,
    minRating: Number.isNaN(minRating) ? null : minRating,
  };

  return [filterValues, roomConfigs];
}
