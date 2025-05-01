import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { graphQLRequest } from "@/lib/api/graphql-client";
import {
  compareDates,
  getDurationBetweenDateStrings,
} from "@/lib/date-parsers";
import { splitAndGetPart } from "@/lib/string-parsers";
import { HOTEL_LIST } from "./mockData";
import { appliedFilters$, sortingOptions$ } from "../store";
import { PRICE_CALCULATION_METHODS } from "../config";
import { useURLParams } from "@/hooks/use-url-param";

export default function useGetFilteredAndSortedHotels() {
  const { filteredHotels, isLoading, error } = useGetFilteredHotelsFromURL();

  // TODO check if sorting by rating works or not
  const sortedHotels = sortHotels(filteredHotels, sortingOptions$.get());

  return { sortedHotels, isLoading, error };
}

function sortHotels(hotels, sortingOptions) {
  const { criteria, isDescending } = sortingOptions;

  let sortedHotels = hotels;

  if (criteria.reviewScore) {
    sortedHotels = sortByReviewScore(sortedHotels, isDescending);
  }

  if (criteria.price) {
    sortedHotels = sortByPrice(sortedHotels, isDescending);
  }

  return sortedHotels;
}

const sortByReviewScore = (hotels, isDescending) =>
  hotels.sort((a, b) =>
    isDescending ? b.reviewScore - a.reviewScore : a.reviewScore - b.reviewScore
  );

const sortByPrice = (hotels, isDescending) =>
  hotels.sort((a, b) => {
    const priceA = extractHotelPriceRange(a).lowest ?? Infinity;
    const priceB = extractHotelPriceRange(b).lowest ?? Infinity;
    return isDescending ? priceB - priceA : priceA - priceB;
  });

function useGetFilteredHotelsFromURL() {
  // TODO filter by room numbers
  // TODO filter by accommodation type

  const { getParamByKey } = useURLParams();

  const locationParam = getParamByKey("location");
  const checkInDate = getParamByKey("fromDate") ?? "";
  const checkOutDate = getParamByKey("toDate") ?? "";
  const rooms = getParamByKey("rooms") ?? 1;
  const adultGuests = getParamByKey("adults") ?? 0;
  const childGuests = getParamByKey("children") ?? 0;

  const locationId = splitAndGetPart(locationParam, "_", "last");

  let isCheckInBeforeCheckOut = false;
  if (checkInDate && checkOutDate) {
    isCheckInBeforeCheckOut = compareDates(checkInDate, checkOutDate);
  }

  let stayDurationInDays = 0;

  if (checkInDate && checkOutDate) {
    stayDurationInDays = getDurationBetweenDateStrings(
      checkInDate,
      checkOutDate
    );
  }

  // TODO paginate this query using offset and limit results
  const {
    data: hotels = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "hotelList",
      locationId,
      adultGuests,
      childGuests,
      checkInDate,
      checkOutDate,
    ],
    queryFn: () =>
      getFilteredHotels(
        locationId,
        adultGuests,
        childGuests,
        checkInDate,
        checkOutDate
      ),
    select: (data) => data?.hotel_listing_hotels,
    enabled: !!locationId && isCheckInBeforeCheckOut,
  });

  useEffect(() => {
    refetch();
  }, [
    locationId,
    checkInDate,
    checkOutDate,
    rooms,
    adultGuests,
    childGuests,
    refetch,
  ]);

  const filteredHotels = HOTEL_LIST.hotel_listing_hotels // TODO replace mock data with query results - hotels
    ? filterHotels(
        HOTEL_LIST.hotel_listing_hotels, // TODO replace mock data with query results - hotels
        stayDurationInDays,
        appliedFilters$.get()
      )
    : [];

  return {
    filteredHotels,
    isLoading,
    error,
  };
}

function getFilteredHotels(
  locationId,
  adults,
  children,
  checkInDate,
  checkOutDate
) {
  const totalGuests = Number(adults) + Number(children);

  return graphQLRequest(
    `query Request($locationId: Hotel_listing_UuidBoolExp = {_eq: ""}, $maxAdults: Hotel_listing_Int8BoolExp = {_gte: ""}, $complementaryChild: Hotel_listing_Int8BoolExp = {_gte: ""}, $maxGuests: Hotel_listing_Int8BoolExp = {_gte: ""}, $desiredCheckIn: Hotel_listing_Date = "", $desiredCheckOut: Hotel_listing_Date = "") {
      hotel_listing_hotels(
        where: {_and: {location: {locationId: $locationId}, roomTypes: {maxAdults: $maxAdults, complementaryChild: $complementaryChild, maxGuests: $maxGuests, rooms: {reservations: {_and: {status: {_eq: "Pending"}, _or: [{checkOutDate: {_lte: $desiredCheckIn}}, {checkInDate: {_gte: $desiredCheckOut}}]}}}}}},
        order_by: {starRating: Desc}
      ) {
          hotelId
          name
          description
          starRating
          reviewScore
          hotelTagAttributesLinks {
            tagId
          }
          hotelFacilitiesLinks {
            facilityId
          }
          roomTypes {
            pricePerNight
          }
        }
      }`,
    {
      locationId: {
        _eq: locationId,
      },
      maxAdults: {
        _gte: adults,
      },
      complementaryChild: {
        _gte: children,
      },
      maxGuests: {
        _gte: totalGuests,
      },
      desiredCheckIn: checkInDate,
      desiredCheckOut: checkOutDate,
    }
  );
}

function filterHotels(hotels, stayDuration, filters) {
  return hotels.filter((hotel) => {
    const hotelPriceRange = extractHotelPriceRange(hotel);
    const hotelFeatureIds = extractHotelFeatureIds(hotel);
    const hotelRating = Math.round(parseFloat(hotel?.starRating)) ?? null;
    const guestRating = parseFloat(hotel?.reviewScore) ?? null;

    const doesFeaturesExist = filters.FilterSelector.every((featureId) =>
      hotelFeatureIds.has(featureId)
    );

    // match hotel by exact star rating
    const doesHotelRatingMatch = filters.hotelRating
      ? filters.hotelRating === hotelRating
      : true;

    // match hotel on or above selected guest rating
    const doesGuestRatingMatch = filters.guestRating
      ? filters.guestRating < guestRating
      : true;

    const doesPriceMatch = filterByPrice(
      hotelPriceRange,
      stayDuration,
      filters.hotelPricing
    );

    return (
      doesFeaturesExist &&
      doesHotelRatingMatch &&
      doesGuestRatingMatch &&
      doesPriceMatch
    );
  });
}

// functions called within filterHotels
function filterByPrice(hotelPriceRange, stayDuration, pricingFilter) {
  const { range, method } = pricingFilter;

  if (!hotelPriceRange.lowest || !hotelPriceRange.highest) return false;

  const minPrice = range[0];
  const maxPrice = range[1];

  switch (method) {
    case PRICE_CALCULATION_METHODS.night:
      return (
        hotelPriceRange.lowest >= minPrice &&
        hotelPriceRange.highest <= maxPrice
      );
    case PRICE_CALCULATION_METHODS.totalStay: {
      const lowestTotal = hotelPriceRange.lowest * stayDuration;
      const highestTotal = hotelPriceRange.highest * stayDuration;
      return lowestTotal >= minPrice && highestTotal <= maxPrice;
    }
    default:
      return false;
  }
}

function extractHotelFeatureIds(hotel) {
  // extracts ids for hotel tag, facility and amenities
  const tagIds = hotel?.hotelTagAttributesLinks ?? [];
  const facilityIds = hotel?.hotelFacilitiesLinks ?? [];
  const amenityIdsForEachRoomType = hotel?.roomTypes?.flatMap(
    (roomType) => roomType?.roomAmenitiesLinks ?? []
  );
  return new Set([...tagIds, ...facilityIds, ...amenityIdsForEachRoomType]);
}

function extractHotelPriceRange(hotel) {
  if (!hotel?.roomTypes || hotel.roomTypes.length === 0) {
    return { lowest: null, highest: null };
  }
  const prices = hotel.roomTypes
    .map((room) => room.pricePerNight)
    .filter(Boolean);
  return {
    lowest: Math.min(...prices),
    highest: Math.max(...prices),
  };
}
