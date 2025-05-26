"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { graphQLRequest } from "@/lib/api/graphql-client";
import { compareDates } from "@/lib/date-parsers";
import { splitAndGetPart } from "@/lib/string-parsers";
import { useURLParams } from "@/hooks/use-url-param";
import {
  DEFAULT_DATE_RANGE,
  INITIAL_PRICE_RANGE,
  MIN_ADULT_GUEST_FOR_ROOM,
  MIN_CHILD_GUEST_FOR_ROOM,
  PRICE_CALCULATION_METHODS,
} from "../config";
import { useSearchParams } from "next/navigation";

export default function useGetHotels() {
  const f = useGetFilterValues();

  const queryResult = useFilterHotels({
    locationId: f.locationId,
    checkInDate: f.checkInDate,
    checkOutDate: f.checkOutDate,
    adults: Number(f.roomConfigs[0].adultGuests),
  });

  useEffect(() => {
    queryResult.refetch();
  }, [queryResult, f.hasFiltersUpdated]);

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

function useGetFilterValues() {
  const { getParamByKey } = useURLParams();

  // Track full url string to detect changes
  const urlParams = useSearchParams();
  const currentFilters = urlParams.toString();
  const previousFiltersRef = useRef("");
  const hasChanged = useRef(false);

  // Effect to update `hasChanged` whenever filters are updated
  useEffect(() => {
    if (previousFiltersRef.current !== currentFilters) {
      hasChanged.current = true;
      previousFiltersRef.current = currentFilters;
    }
  }, [currentFilters]);

  // Extract filter values
  const locationParam = getParamByKey("location") ?? "";
  const locationId = splitAndGetPart(locationParam, "_", "last") ?? null;

  const checkInDate = getParamByKey("fromDate") ?? null;
  const checkOutDate = getParamByKey("toDate") ?? null;

  const rooms = parseInt(getParamByKey("rooms")) || 1;
  const adultGuests = (getParamByKey("adults") ?? "").split(",") ?? [1];
  const childGuests = (getParamByKey("children") ?? "").split(",") ?? [0];

  const roomConfigs = Array.from({ length: rooms }, (_, index) => ({
    id: index,
    adultGuests: parseInt(adultGuests[index]) || MIN_ADULT_GUEST_FOR_ROOM,
    childGuests: parseInt(childGuests[index]) || MIN_CHILD_GUEST_FOR_ROOM,
  }));

  const priceSort = getParamByKey("priceSort") ?? null;
  const popularitySort = getParamByKey("popularitySort") ?? null;

  const minPrice =
    parseFloat(getParamByKey("minPrice")) ?? INITIAL_PRICE_RANGE.minPrice;
  const maxPrice =
    parseFloat(getParamByKey("maxPrice")) ?? INITIAL_PRICE_RANGE.maxPrice;

  const priceCalcMethod =
    getParamByKey("priceCalcMethod") ?? PRICE_CALCULATION_METHODS.night;

  const tags = (getParamByKey("tags") ?? "").split(",") ?? null;
  const facilities = (getParamByKey("facilities") ?? "").split(",") ?? null;
  const amenities = (getParamByKey("amenities") ?? "").split(",") ?? null;

  const stars = parseInt(getParamByKey("stars")) ?? null;
  const minRating = parseFloat(getParamByKey("minRating")) ?? null;

  return {
    locationId,
    checkInDate,
    checkOutDate,
    roomConfigs,
    priceSort,
    popularitySort,
    minPrice,
    maxPrice,
    priceCalcMethod,
    tags,
    facilities,
    amenities,
    stars,
    minRating,
    hasFiltersUpdated: hasChanged.current,
  };
}
