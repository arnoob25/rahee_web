"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { graphQLRequest } from "@/lib/api/graphql-client";
import {
  compareDates,
  getDurationBetweenDateStrings,
} from "@/lib/date-parsers";
import { splitAndGetPart } from "@/lib/string-parsers";
import { appliedFilters$, sortingOptions$ } from "../store";
import { PRICE_CALCULATION_METHODS } from "../config";
import { useURLParams } from "@/hooks/use-url-param";

export default function useGetHotels() {
  const { getParamByKey } = useURLParams();

  const locationParam = getParamByKey("location");
  const checkInDate = getParamByKey("fromDate") ?? "";
  const checkOutDate = getParamByKey("toDate") ?? "";
  const rooms = getParamByKey("rooms") ?? 1;
  const adultGuests = getParamByKey("adults") ?? 0;
  const childGuests = getParamByKey("children") ?? 0;
  const locationId = splitAndGetPart(locationParam, "_", "last");
  // TODO filter by room numbers
  // TODO filter by accommodation type

  const queryResult = useFilterHotels({
    locationId,
    checkInDate,
    checkOutDate,
    adults: Number(adultGuests),
  });

  useEffect(() => {
    queryResult.refetch();
  }, [
    queryResult,
    locationId,
    checkInDate,
    checkOutDate,
    rooms,
    adultGuests,
    childGuests,
  ]);

  return {
    ...queryResult,
    hotels: queryResult.data ?? [],
  };
}

function useFilterHotels(filterValues) {
  const shouldExecuteQuery = validateInputs(filterValues);

  const queryResult = useQuery({
    queryKey: ["filtered_hotels", ...Object.values(filterValues)],
    queryFn: () =>
      shouldExecuteQuery
        ? graphQLRequest(FILTER_HOTELS, buildFilterVariables(filterValues))
        : graphQLRequest(GET_HOTELS),
    select: (data) => data.filterHotels,
    enabled: shouldExecuteQuery,
  });

  return queryResult;
}

const GET_HOTELS = `query getHotels {
  findHotels {
    _id
    name
    description
    starRating
    reviewScore
    reviewCount
    startingPrice
    facilities
    policies
    availableRoomCount (checkInDate: "2036-05-23", checkOutDate: "2039-11-06")
    media {
      _id
      caption
      isCover
      isFeatured
      url
    }
  }
}`;

const FILTER_HOTELS = `query FilterHotels($filters: FilterHotelsInput!) {
  filterHotels(filters: $filters) {
    _id
    name
    description
    starRating
    reviewScore
    reviewCount
    startingPrice
    facilities
    policies
    availableRoomCount (checkInDate: "2036-05-23", checkOutDate: "2039-11-06")
    media {
      _id
      caption
      isCover
      isFeatured
      url
    }
  }
}`;

function buildFilterVariables({
  city,
  locationId,
  checkInDate,
  checkOutDate,
  adults,
  children,
  minPrice,
  maxPrice,
  reviewScore,
  starRating,
  tags,
  facility,
  amenities,
}) {
  const filters = {};

  if (city) filters.city = city;
  if (locationId) filters.locationId = locationId;
  if (checkInDate) filters.checkInDate = checkInDate;
  if (checkOutDate) filters.checkOutDate = checkOutDate;
  if (adults !== undefined) filters.adults = adults;
  if (children !== undefined) filters.children = children;
  if (minPrice !== undefined) filters.minPrice = minPrice;
  if (maxPrice !== undefined) filters.maxPrice = maxPrice;
  if (reviewScore !== undefined) filters.reviewScore = reviewScore;
  if (starRating !== undefined) filters.starRating = starRating;
  if (tags?.length) filters.tags = tags;
  if (facility?.length) filters.facility = facility;
  if (amenities?.length) filters.amenities = amenities;

  return { filters };
}

function validateInputs({ city, locationId, checkInDate, checkOutDate }) {
  if (!locationId && !city) return false;
  if (!checkInDate || !checkOutDate) return false;
  return compareDates(checkInDate, checkOutDate);
}
