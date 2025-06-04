"use client";

import { compareDates, isValidDateString } from "@/lib/date-parsers";
import { useURLParams } from "@/hooks/use-url-param";
import { toast } from "sonner";
import { splitAndGetPart } from "@/lib/string-parsers";
import { useEffect, useRef } from "react";
import {
  DEFAULT_ROOM_GUEST_CONFIG,
  MAX_ALLOWED_GUESTS_FOR_ROOM,
  MAX_ALLOWED_PRICE,
  MIN_ADULT_GUEST_FOR_ROOM,
  MIN_ALLOWED_PRICE,
  MIN_CHILD_GUEST_FOR_ROOM,
  PRICE_CALCULATION_METHODS,
  SORT_ORDERS,
  HOTEL_RATING_FILTERS,
  DEFAULT_DATE_RANGE,
} from "../config";
import {
  useAttributesStore,
  useDateRangeStore,
  useLocationStore,
  useMiscFiltersStore,
  usePriceRangeStore,
  useRoomConfigStore,
  useSortingOptionsStore,
} from "./hotelFilters";

export function useRestoreStateFromURLParams() {
  const location = useLocationStore();
  const dateRange = useDateRangeStore();
  const roomConfig = useRoomConfigStore();
  const sortingOptions = useSortingOptionsStore();
  const priceRange = usePriceRangeStore();
  const attributes = useAttributesStore();
  const miscFilters = useMiscFiltersStore();
  const getFilterValues = useGetFilterValuesFromURL(); // f reads as filter
  const hasUpdatedStatesRef = useRef(false);

  useEffect(() => {
    if (hasUpdatedStatesRef.current) return;

    const f = getFilterValues();

    if (f.city) {
      location.setCity(f.city);
    } else if (f.locationId) {
      location.setLocationId(f.locationId);
    }

    // must be set regardless of url param
    roomConfig.setRooms(
      f.roomConfigs?.length > 0 ? f.roomConfigs : DEFAULT_ROOM_GUEST_CONFIG
    );

    // must be set regardless of url param
    dateRange.setDateRange({
      from: f.checkInDate ?? DEFAULT_DATE_RANGE.from,
      to: f.checkOutDate ?? DEFAULT_DATE_RANGE.to,
    });

    if (f.priceSort) sortingOptions.setPriceSort(f.priceSort);

    if (f.popularitySort) sortingOptions.setPopularitySort(f.popularitySort);

    if (f.minPrice && f.maxPrice && f.priceCalcMethod) {
      priceRange.setPriceRange(f.minPrice, f.maxPrice);
      priceRange.setPriceCalcMethod(f.priceCalcMethod);
    }

    if (f.tags) attributes.setTag(f.tags);

    if (f.facilities) attributes.setFacility(f.facilities);

    if (f.amenities) attributes.setAmenity(f.amenities);

    if (f.stars) attributes.setStars(f.stars);

    if (f.minRating && f.minRating >= HOTEL_RATING_FILTERS.at(-1).value)
      miscFilters.setMinRating(f.minRating);

    if (f.accommodationTypes)
      miscFilters.setSelectedAccommodationTypes(new Set(f.accommodationTypes));

    hasUpdatedStatesRef.current = true;
  }, [
    attributes,
    dateRange,
    getFilterValues,
    location,
    miscFilters,
    priceRange,
    roomConfig,
    sortingOptions,
  ]);
}

export function useGetFilterValuesFromURL() {
  const { getParamByKey, deleteURLParam } = useURLParams();

  // TODO validate city, locationId, tags, facilities, amenities, and accommodation types
  function validateFilterValuesFromURL() {
    const urlValues = getValuesFromURL();

    urlValues.roomConfigs = createRoomConfigFromData(); // validated room configs

    validateDateRange(urlValues);
    validateSortOrders(urlValues);
    validatePriceRange(urlValues);

    if (urlValues.stars < 0 || urlValues.stars > 5) {
      urlValues.stars = null;
      toast.warning("Invalid stars filter. Clearing value.");
    }

    if (urlValues.minRating < 0 || urlValues.minRating > 10) {
      urlValues.minRating = null;
      toast.warning("Invalid minimum rating. Clearing value.");
    }

    return urlValues; // validated values
  }

  function validateDateRange(u) {
    if (!u.checkInDate || !u.checkOutDate) return;

    // check-in can't be greater than checkout
    if (!compareDates(u.checkInDate, u.checkOutDate)) {
      u.checkInDate = null;
      u.checkOutDate = null;

      deleteURLParam("fromDate");
      deleteURLParam("toDate");

      toast.warning(
        "Invalid check-in and check-out dates. Reverting to default dates."
      );
    }
  }

  function validateSortOrders(u) {
    if (u.priceSort) {
      if (u.priceSort !== SORT_ORDERS.ASC && u.priceSort !== SORT_ORDERS.DSC) {
        u.priceSort = null;

        toast.warning("Invalid price sort order. Resetting sort.");
      }
    }

    if (u.popularitySort) {
      if (
        u.popularitySort !== SORT_ORDERS.ASC &&
        u.popularitySort !== SORT_ORDERS.DSC
      ) {
        u.popularitySort = null;

        toast.warning("Invalid popularity sort order. Resetting sort.");
      }
    }
  }

  function validatePriceRange(u) {
    if (!u.minPrice || !u.maxPrice || !u.priceCalcMethod) return;

    // price calculation method is valid

    if (
      u.priceCalcMethod !== PRICE_CALCULATION_METHODS.NIGHT &&
      u.priceCalcMethod !== PRICE_CALCULATION_METHODS.TOTAL_STAY
    ) {
      u.priceCalcMethod = null;
      u.minPrice = null;
      u.maxPrice = null;

      toast.warning("Invalid price calculation method. Reverting to default.");
      return;
    }

    if (u.minPrice > u.maxPrice) {
      u.minPrice = null;
      u.maxPrice = null;

      toast.warning(
        "Min price cannot be greater than max price. Reverting to defaults."
      );
      return;
    }

    if (u.minPrice > MAX_ALLOWED_PRICE || u.minPrice < MIN_ALLOWED_PRICE) {
      u.minPrice = null;
      u.maxPrice = null;

      toast.warning("Invalid min price. Reverting to default.");
      return;
    }

    if (u.maxPrice > MAX_ALLOWED_PRICE || u.maxPrice < MIN_ALLOWED_PRICE) {
      u.minPrice = null;
      u.maxPrice = null;

      toast.warning("Invalid max price. Reverting to default.");
    }
  }

  const getValuesFromURL = () => ({
    city: getParamByKey("city"),

    locationId: splitAndGetPart(getParamByKey("location", ""), "_", "last"),

    checkInDate: isValidDateString(getParamByKey("fromDate", ""))
      ? getParamByKey("fromDate")
      : null,

    checkOutDate: isValidDateString(getParamByKey("toDate", ""))
      ? getParamByKey("toDate")
      : null,

    priceSort: getParamByKey("priceSort"),
    popularitySort: getParamByKey("popularitySort"),

    minPrice: !Number.isNaN(parseFloat(getParamByKey("minPrice", "")))
      ? parseFloat(getParamByKey("minPrice"))
      : null,

    maxPrice: !Number.isNaN(parseFloat(getParamByKey("maxPrice", "")))
      ? parseFloat(getParamByKey("maxPrice"))
      : null,

    priceCalcMethod: getParamByKey("priceCalcMethod"),

    tags: getParamByKey("tags")?.split(",") ?? null,
    facilities: getParamByKey("facilities")?.split(",") ?? null,
    amenities: getParamByKey("amenities")?.split(",") ?? null,

    stars: !Number.isNaN(parseInt(getParamByKey("stars", "")))
      ? parseInt(getParamByKey("stars"))
      : null,

    minRating: !Number.isNaN(parseFloat(getParamByKey("minRating", "")))
      ? parseFloat(getParamByKey("minRating"))
      : null,

    accommodationTypes: getParamByKey("accommodations")?.split(",") ?? null,
  });

  function createRoomConfigFromData() {
    const { rooms, adults, children } = getRoomAndGuests();

    // return default config mismatch exists
    if (
      rooms === 0 ||
      adults.length === 0 ||
      rooms !== adults.length ||
      (children.length > 0 && rooms !== children.length)
    ) {
      toast.warning(
        "Mismatch in room guest config data. Using default config."
      );
      return DEFAULT_ROOM_GUEST_CONFIG;
    }

    // create room configs - for each room
    return Array.from({ length: rooms }, (_, index) => {
      let adultCount = parseInt(adults[index]) ?? MIN_ADULT_GUEST_FOR_ROOM;
      let childCount = parseInt(children[index]) ?? MIN_CHILD_GUEST_FOR_ROOM;

      // adult count is valid - for the room
      if (
        adultCount < MIN_ADULT_GUEST_FOR_ROOM ||
        adultCount > MAX_ALLOWED_GUESTS_FOR_ROOM
      ) {
        adultCount = DEFAULT_ROOM_GUEST_CONFIG[0].adults;
        toast.warning(
          `Invalid adult count in room ${index + 1}. Using default.`
        );
      }

      // child count is valid - for the room
      if (
        childCount < MIN_CHILD_GUEST_FOR_ROOM ||
        childCount > MAX_ALLOWED_GUESTS_FOR_ROOM
      ) {
        childCount = DEFAULT_ROOM_GUEST_CONFIG[0].children;
        toast.warning(
          `Invalid children count in room ${index + 1}. Using default.`
        );
      }

      // total guests count is valid - for the room
      if (adultCount + childCount > MAX_ALLOWED_GUESTS_FOR_ROOM) {
        adultCount = DEFAULT_ROOM_GUEST_CONFIG[0].adults;
        childCount = DEFAULT_ROOM_GUEST_CONFIG[0].children;
        toast.warning(
          `Guest count exceeds limit in room ${index + 1}. Using default.`
        );
      }

      return { id: index, adults: adultCount, children: childCount };
    });
  }

  function getRoomAndGuests() {
    return {
      rooms: !Number.isNaN(parseInt(getParamByKey("rooms", "")))
        ? parseInt(getParamByKey("rooms"))
        : DEFAULT_ROOM_GUEST_CONFIG.length,

      adults: getParamByKey("adults", "")
        ?.split(",")
        ?.map((adultCount) =>
          !isNaN(parseInt(adultCount))
            ? parseInt(adultCount)
            : MIN_ADULT_GUEST_FOR_ROOM
        ) ?? [MIN_ADULT_GUEST_FOR_ROOM],

      children:
        getParamByKey("children", "")
          ?.split(",")
          .filter(
            (childCount) =>
              (!isNaN(parseInt(childCount)) ? parseInt(childCount) : null) !==
              null
          ) ?? [],
    };
  }

  return () => validateFilterValuesFromURL();
}
