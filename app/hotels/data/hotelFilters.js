"use client";

import { create } from "zustand";
import {
  FILTER_TYPES,
  DEFAULT_DATE_RANGE,
  DEFAULT_ROOM_GUEST_CONFIG,
  GUEST_TYPES,
  INITIAL_PRICE_RANGE,
  MAX_ALLOWED_GUESTS_FOR_ROOM,
  MAX_PRICE,
  MIN_ADULT_GUEST_FOR_ROOM,
  MIN_CHILD_GUEST_FOR_ROOM,
  MIN_PRICE,
  PRICE_CALCULATION_METHODS,
  HOTEL_RATING_FILTERS,
} from "../config";
import { INTERNAL_DATE_FORMAT } from "@/config/date-formats";
import { differenceInDays, format } from "date-fns";
import { useURLParams } from "@/hooks/use-url-param";
import { TAGS_MAP } from "../[hotelId]/data/hotelTagData";
import { AMENITY_MAP } from "../[hotelId]/data/roomAmenityData";
import {
  FACILITY_MAP,
  groupFacilitiesByCategory,
} from "../[hotelId]/data/hotelFacilityData";
import { splitAndGetPart } from "@/lib/string-parsers";
import { useEffect, useRef } from "react";

const filterStore = create((set, get) => ({
  // location
  city: null,
  locationId: null,

  // check-in and check-out dates
  dateRange: DEFAULT_DATE_RANGE,

  // Guests and rooms
  rooms: DEFAULT_ROOM_GUEST_CONFIG,

  // attributes
  selectedTags: new Set(),
  selectedFacilities: new Set(),
  selectedAmenities: new Set(),
  selectedStars: null,

  // guest rating
  minRating: null,

  // price
  minPrice: INITIAL_PRICE_RANGE.minPrice,
  maxPrice: INITIAL_PRICE_RANGE.maxPrice,
  priceCalcMethod: PRICE_CALCULATION_METHODS.night,

  // new sorting states
  priceSort: null, // 'asc' | 'dsc' | null
  popularitySort: null, // 'asc' | 'dsc' | null

  hasUnappliedFilters: false,

  setCity: (valueOrCallback, updateURLParam) => {
    const currentCity = get().city;
    const selectedCity =
      typeof valueOrCallback === "function"
        ? valueOrCallback(currentCity)
        : valueOrCallback;

    const newCity = selectedCity !== currentCity ? selectedCity : null;

    updateURLParam("city", newCity);
    set({
      city: newCity,
      hasUnappliedFilters: true,
    });
  },

  setLocationId: (valueOrCallback, updateURLParam) => {
    const currentLocation = get().locationId;
    const selectedLocationId =
      typeof valueOrCallback === "function"
        ? valueOrCallback(currentLocation)
        : valueOrCallback;

    const newLocationId =
      selectedLocationId !== currentLocation ? selectedLocationId : null;

    updateURLParam("location", newLocationId);
    set({
      locationId: newLocationId,
      hasUnappliedFilters: true,
    });
  },

  setDateRange: (valueOrCallback, updateURLParam) => {
    const currentRange = get().dateRange;
    const newDateRange =
      typeof valueOrCallback === "function"
        ? valueOrCallback(currentRange)
        : valueOrCallback;

    if (newDateRange.from) {
      updateURLParam(
        "fromDate",
        format(newDateRange.from, INTERNAL_DATE_FORMAT)
      );
    }

    if (newDateRange.to) {
      updateURLParam("toDate", format(newDateRange.to, INTERNAL_DATE_FORMAT));
    }

    set({
      dateRange: newDateRange,
      hasUnappliedFilters: true,
    });
  },

  getStayDuration: () => {
    const { from, to } = get().dateRange;
    return differenceInDays(to, from);
  },

  setRooms: (newRooms, updateURLParam, deleteURLParam) => {
    const adults = newRooms.map((room) => room.adults).join(",");
    const children = newRooms.map((room) => room.children).join(",");

    updateURLParam("rooms", newRooms.length.toString());
    updateURLParam("adults", adults);
    if (children.split(",").some((val) => parseInt(val) > 0)) {
      updateURLParam("children", children);
    } else {
      deleteURLParam("children");
    }

    set({ rooms: newRooms, hasUnappliedFilters: true });
  },

  addRoom: (updateURLParam, deleteURLParam) => {
    set((state) => {
      const currentRooms = get().rooms;
      const roomCount = currentRooms.length + 1;
      const updatedRooms = [
        ...currentRooms,
        { id: roomCount, adults: 1, children: 0 },
      ];

      const adults = updatedRooms.map((room) => room.adults).join(",");
      const children = updatedRooms.map((room) => room.children).join(",");

      updateURLParam("rooms", roomCount);
      updateURLParam("adults", adults);
      if (children.split(",").some((val) => parseInt(val) > 0)) {
        updateURLParam("children", children);
      } else {
        deleteURLParam("children");
      }
      return {
        rooms: updatedRooms,
        hasUnappliedFilters: true,
      };
    });
  },

  removeRoom: (roomId, updateURLParam, deleteURLParam) => {
    const currentRooms = get().rooms;
    const updatedRooms = currentRooms.filter((r) => r.id !== roomId);
    const roomCount = currentRooms.length;

    if (roomCount < 1) return;

    const adults = updatedRooms.map((room) => room.adults).join(",");
    const children = updatedRooms.map((room) => room.children).join(",");

    updateURLParam("rooms", roomCount - 1);
    updateURLParam("adults", adults);
    if (children.split(",").some((val) => parseInt(val) > 0)) {
      updateURLParam("children", children);
    } else {
      deleteURLParam("children");
    }

    set({
      rooms: updatedRooms,
      hasUnappliedFilters: true,
    });
  },

  updateRoomGuest: (
    roomId,
    guestType,
    updateURLParam,
    deleteURLParam,
    increment = true
  ) => {
    const isGuestAdult = guestType === GUEST_TYPES.adult;
    const propToUpdate = isGuestAdult ? "adults" : "children";

    const updatedRooms = get().rooms.map((room) => {
      if (room.id !== roomId) return room;
      let newVal = increment ? room[propToUpdate] + 1 : room[propToUpdate] - 1;

      const updatedRoom = { ...room, [propToUpdate]: newVal };

      if (
        updatedRoom.adults + updatedRoom.children >
        MAX_ALLOWED_GUESTS_FOR_ROOM
      )
        return room;
      if (updatedRoom.adults < MIN_ADULT_GUEST_FOR_ROOM) return room;
      if (updatedRoom.children < MIN_CHILD_GUEST_FOR_ROOM) return room;

      return updatedRoom;
    });

    updateURLParam("rooms", updatedRooms.length);

    const adults = updatedRooms.map((room) => room.adults).join(",");
    updateURLParam("adults", adults);

    const children = updatedRooms.map((room) => room.children).join(",");
    if (children.split(",").some((val) => parseInt(val) > 0)) {
      updateURLParam("children", children);
    } else {
      deleteURLParam("children");
    }

    set((state) => {
      return { rooms: updatedRooms, hasUnappliedFilters: true };
    });
  },

  setTag: (idOrIds, updateURLParamArray) => {
    if (!idOrIds) return;
    const tags = new Set(get().selectedTags);

    if (typeof idOrIds === "string" && idOrIds.length > 0) {
      tags.has(idOrIds) ? tags.delete(idOrIds) : tags.add(idOrIds);
    } else {
      idOrIds.forEach((id) => {
        if (id.length > 0) tags.has(id) ? tags.delete(id) : tags.add(id);
      });
    }

    updateURLParamArray("tags", tags);
    set({ selectedTags: tags, hasUnappliedFilters: true });
  },

  setFacility: (idOrIds, updateURLParamArray) => {
    if (!idOrIds) return;
    const facilities = new Set(get().selectedFacilities);

    if (typeof idOrIds === "string" && idOrIds.length > 0) {
      facilities.has(idOrIds)
        ? facilities.delete(idOrIds)
        : facilities.add(idOrIds);
    } else {
      idOrIds.forEach((id) => {
        if (id.length > 0)
          facilities.has(id) ? facilities.delete(id) : facilities.add(id);
      });
    }

    updateURLParamArray("facilities", facilities);
    set({ selectedFacilities: facilities, hasUnappliedFilters: true });
  },

  setAmenity: (idOrIds, updateURLParamArray) => {
    if (!idOrIds) return;
    const amenities = new Set(get().selectedAmenities);

    if (typeof idOrIds === "string" && idOrIds.length > 0) {
      amenities.has(idOrIds)
        ? amenities.delete(idOrIds)
        : amenities.add(idOrIds);
    } else {
      idOrIds.forEach((id) => {
        if (id.length > 0)
          amenities.has(id) ? amenities.delete(id) : amenities.add(id);
      });
    }

    updateURLParamArray("amenities", amenities);
    set({ selectedAmenities: amenities, hasUnappliedFilters: true });
  },

  setStars: (stars, updateURLParam) => {
    const selectedStars = get().selectedStars === stars ? null : stars;
    updateURLParam("stars", selectedStars);
    set({
      selectedStars,
      hasUnappliedFilters: true,
    });
  },

  setMinRating: (rating, updateURLParam) => {
    const minRating = get().minRating === rating ? null : rating;
    updateURLParam("minRating", minRating);
    set((state) => ({
      minRating,
      hasUnappliedFilters: true,
    }));
  },

  getAttributeFilterCount: () => {
    const {
      selectedTags,
      selectedFacilities,
      selectedAmenities,
      selectedStars,
    } = get();
    const attrCount = new Set([
      ...selectedTags,
      ...selectedFacilities,
      ...selectedAmenities,
    ]).size;
    return attrCount + (selectedStars ? 1 : 0);
  },

  setPriceRange: (min, max, updateURLParam) => {
    if (min < MIN_PRICE || max > MAX_PRICE) return;

    updateURLParam("minPrice", min);
    updateURLParam("maxPrice", max);
    set({ minPrice: min, maxPrice: max, hasUnappliedFilters: true });
  },

  setPriceCalcMethod: (method, updateURLParam) => {
    updateURLParam("priceCalcMethod", method);
    set({ priceCalcMethod: method, hasUnappliedFilters: true });
  },

  setPriceSort: (sortOrder, updateURLParam) => {
    updateURLParam("priceSort", sortOrder);
    set({ priceSort: sortOrder, hasUnappliedFilters: true });
  },

  setPopularitySort: (sortOrder, updateURLParam) => {
    updateURLParam("popularitySort", sortOrder);
    set({ popularitySort: sortOrder, hasUnappliedFilters: true });
  },

  setHasUnappliedFilters: (isNewFilterApplied) => {
    if (!isNewFilterApplied || get().hasUnappliedFilters) return;
    set({ hasUnappliedFilters: true });
  },

  applyFilters: () => {
    set({ hasUnappliedFilters: false });
  },

  resetFilters: (deleteURLParam, updateURL) => {
    const params = [
      "city",
      "location",
      "fromDate",
      "toDate",
      "tags",
      "facilities",
      "amenities",
      "stars",
      "minRating",
      "minPrice",
      "maxPrice",
      "priceCalcMethod",
      "priceSort",
      "popularitySort",
      "rooms",
      "adults",
      "children",
    ];
    params.forEach((param) => deleteURLParam(param, false));

    set({
      locationId: null,
      dateRange: DEFAULT_DATE_RANGE,
      selectedTags: new Set(),
      selectedFacilities: new Set(),
      selectedAmenities: new Set(),
      selectedStars: null,
      minRating: null,
      minPrice: INITIAL_PRICE_RANGE.minPrice,
      maxPrice: INITIAL_PRICE_RANGE.maxPrice,
      priceCalcMethod: PRICE_CALCULATION_METHODS.night,
      priceSort: null,
      popularitySort: null,
      rooms: DEFAULT_ROOM_GUEST_CONFIG,
      hasUnappliedFilters: false,
    });

    updateURL();
  },
}));

export function useHotelFilterStore() {
  const f = filterStore();
  const { updateURLParam, updateURLParamArray, deleteURLParam, updateURL } =
    useURLParams();

  return {
    ...f, // all filter values
    setCity: (valueOrCallback) => f.setCity(valueOrCallback, updateURLParam),
    setLocationId: (valueOrCallback) =>
      f.setLocationId(valueOrCallback, updateURLParam),
    setDateRange: (valueOrCallback) =>
      f.setDateRange(valueOrCallback, updateURLParam),
    setRooms: (rooms) => f.setRooms(rooms, updateURLParam, deleteURLParam),
    addRoom: () => f.addRoom(updateURLParam, deleteURLParam),
    removeRoom: (roomId) =>
      f.removeRoom(roomId, updateURLParam, deleteURLParam),
    updateRoomGuest: (roomId, guestType, increment) =>
      f.updateRoomGuest(
        roomId,
        guestType,
        updateURLParam,
        deleteURLParam,
        increment
      ),
    setTag: (idOrIds) => f.setTag(idOrIds, updateURLParamArray),
    setFacility: (idOrIds) => f.setFacility(idOrIds, updateURLParamArray),
    setAmenity: (idOrIds) => f.setAmenity(idOrIds, updateURLParamArray),
    setStars: (stars) => f.setStars(stars, updateURLParam),
    setMinRating: (rating) => f.setMinRating(rating, updateURLParam),
    setPriceRange: (min, max) => f.setPriceRange(min, max, updateURLParam),
    setPriceCalcMethod: (method) =>
      f.setPriceCalcMethod(method, updateURLParam),
    setPriceSort: (sortOrder) => f.setPriceSort(sortOrder, updateURLParam),
    setPopularitySort: (sortOrder) =>
      f.setPopularitySort(sortOrder, updateURLParam),
    resetFilters: () => f.resetFilters(deleteURLParam, updateURL),
  };
}

export function useGetCategorizedHotelAttributes() {
  const allFacilityIds = Object.keys(FACILITY_MAP);
  const groupedFacilities = groupFacilitiesByCategory(allFacilityIds);

  const facilityFilters = groupedFacilities.map(({ id, label, facilities }) => {
    return {
      type: FILTER_TYPES.checkbox,
      id,
      label,
      options: facilities,
    };
  });

  const attributes = [
    {
      type: FILTER_TYPES.checkbox,
      id: "tags",
      label: "Tags",
      options: Object.values(TAGS_MAP),
    },
    {
      type: FILTER_TYPES.selection,
      id: "rating",
      label: "Hotel Rating",
      options: [1, 2, 3, 4, 5],
    },
    ...facilityFilters,
    {
      type: FILTER_TYPES.checkbox,
      id: "amenity",
      label: "Amenities",
      options: Object.values(AMENITY_MAP),
    },
  ];

  return attributes;
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

export function useRestoreStateFromURLParams() {
  const s = useHotelFilterStore(); // s reads as state
  const [f, roomConfigs] = useGetFilterValuesFromURL(); // f reads as filter
  const hasUpdatedStatesRef = useRef(false);

  useEffect(() => {
    if (hasUpdatedStatesRef.current) return;

    if (f.city) {
      s.setCity(f.city);
    } else if (f.locationId && f.locationId.length > 0) {
      s.setLocationId(f.locationId);
    }

    if (f.checkInDate && f.checkOutDate) {
      s.setDateRange({ from: f.checkInDate, to: f.checkOutDate });
    } else {
      s.setDateRange(DEFAULT_DATE_RANGE);
    }

    if (roomConfigs.length > 0) {
      s.setRooms(roomConfigs);
    }

    if (f.priceSort) {
      s.setPriceSort(f.priceSort);
    }

    if (f.popularitySort) {
      s.setPopularitySort(f.popularitySort);
    }

    if (f.minPrice && f.maxPrice && f.priceCalcMethod) {
      s.setPriceRange(f.minPrice, f.maxPrice);
      s.setPriceCalcMethod(f.priceCalcMethod);
    } else {
      s.setPriceRange(
        INITIAL_PRICE_RANGE.minPrice,
        INITIAL_PRICE_RANGE.maxPrice
      );
      s.setPriceCalcMethod(PRICE_CALCULATION_METHODS.night);
    }

    if (f.tags) s.setTag(f.tags);

    if (f.facilities) s.setFacility(f.facilities);

    if (f.amenities) s.setAmenity(f.amenities);

    if (f.stars) s.setStars(f.stars);

    if (f.minRating && f.minRating >= HOTEL_RATING_FILTERS.at(-1).value) {
      s.setMinRating(f.minRating);
    } else {
      s.setMinRating(null);
    }

    hasUpdatedStatesRef.current = true;
  }, [
    s,
    f.city,
    f.locationId,
    f.checkInDate,
    f.checkOutDate,
    f.priceSort,
    f.popularitySort,
    f.minPrice,
    f.maxPrice,
    f.priceCalcMethod,
    f.tags,
    f.facilities,
    f.amenities,
    f.stars,
    f.minRating,
    roomConfigs,
  ]);
}
