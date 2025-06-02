"use client";

import { create } from "zustand";
import {
  FILTER_TYPES,
  DEFAULT_DATE_RANGE,
  DEFAULT_ROOM_GUEST_CONFIG,
  GUEST_TYPES,
  DEFAULT_PRICE_RANGE,
  MAX_ALLOWED_GUESTS_FOR_ROOM,
  MIN_ADULT_GUEST_FOR_ROOM,
  MIN_CHILD_GUEST_FOR_ROOM,
  HOTEL_RATING_FILTERS,
  DEFAULT_ACCOMMODATION_TYPES,
  DEFAULT_CITY,
  DEFAULT_LOCATION_ID,
  DEFAULT_PRICE_CALCULATION_METHOD,
  MAX_ALLOWED_ROOM_CONFIGS,
  MIN_ALLOWED_PRICE,
  MAX_ALLOWED_PRICE,
  SORT_ORDERS,
  INITIAL_CHECK_IN_DATE,
  INITIAL_CHECK_OUT_DATE,
  PRICE_CALCULATION_METHODS,
} from "../config";
import { INTERNAL_DATE_FORMAT } from "@/config/date-formats";
import { differenceInDays, format } from "date-fns";
import { useURLParams } from "@/hooks/use-url-param";
import { TAGS_MAP } from "../data/format-data/hotelTagData";
import { AMENITY_MAP } from "../data/format-data/roomAmenityData";
import {
  FACILITY_MAP,
  groupFacilitiesByCategory,
} from "./format-data/hotelFacilityData";
import { splitAndGetPart } from "@/lib/string-parsers";
import { useEffect, useRef } from "react";
import { compareDates, isValidDateString } from "@/lib/date-parsers";

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
  minPrice: DEFAULT_PRICE_RANGE.MIN_PRICE,
  maxPrice: DEFAULT_PRICE_RANGE.MAX_PRICE,
  priceCalcMethod: DEFAULT_PRICE_CALCULATION_METHOD,

  // new sorting states
  priceSort: null, // 'asc' | 'dsc' | null
  popularitySort: null, // 'asc' | 'dsc' | null

  // accommodation type
  accommodationTypes: new Set(DEFAULT_ACCOMMODATION_TYPES),

  setCity: (valueOrCallback, updateURLParam) => {
    const currentCity = get().city;
    const selectedCity =
      typeof valueOrCallback === "function"
        ? valueOrCallback(currentCity)
        : valueOrCallback;

    const newCity = selectedCity !== currentCity ? selectedCity : null;

    updateURLParam("city", newCity);
    set({ city: newCity });
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
    set({ locationId: newLocationId });
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

    set({ dateRange: newDateRange });
  },

  getStayDuration: () => {
    const { from, to } = get().dateRange;
    return differenceInDays(to, from);
  },

  setRooms: (newRooms, updateURLParam, deleteURLParam) => {
    const adults = newRooms.map((room) => room.adults).join(",");
    const children = newRooms.map((room) => room.children).join(",");

    const maxRooms = newRooms.slice(0, MAX_ALLOWED_ROOM_CONFIGS);

    updateURLParam("rooms", maxRooms.length.toString());
    updateURLParam("adults", adults);
    if (children.split(",").some((val) => parseInt(val) > 0)) {
      updateURLParam("children", children);
    } else {
      deleteURLParam("children");
    }

    set({ rooms: maxRooms });
  },

  addRoom: (updateURLParam, deleteURLParam) => {
    const currentRooms = get().rooms;
    const roomCount = currentRooms.length + 1;

    if (roomCount > MAX_ALLOWED_ROOM_CONFIGS) return;

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
    set({ rooms: updatedRooms });
  },

  removeRoom: (roomId, updateURLParam, deleteURLParam) => {
    const currentRooms = get().rooms;
    const updatedRooms = currentRooms.filter((r) => r.id !== roomId);
    const roomCount = currentRooms.length;

    if (roomCount === 1) return;

    const adults = updatedRooms.map((room) => room.adults).join(",");
    const children = updatedRooms.map((room) => room.children).join(",");

    updateURLParam("rooms", roomCount - 1);
    updateURLParam("adults", adults);
    if (children.split(",").some((val) => parseInt(val) > 0)) {
      updateURLParam("children", children);
    } else {
      deleteURLParam("children");
    }

    set({ rooms: updatedRooms });
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

    set({ rooms: updatedRooms });
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
    set({ selectedTags: tags });
  },

  resetTags: (deleteURLParam) => {
    deleteURLParam("tags");
    set({ selectedTags: new Set() });
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
    set({ selectedFacilities: facilities });
  },

  resetFacilities: (deleteURLParam) => {
    deleteURLParam("facilities");
    set({ selectedFacilities: new Set() });
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
    set({ selectedAmenities: amenities });
  },

  resetAmenities: (deleteURLParam) => {
    deleteURLParam("amenities");
    set({ selectedAmenities: new Set() });
  },

  setStars: (stars, updateURLParam) => {
    const selectedStars = get().selectedStars === stars ? null : stars;
    updateURLParam("stars", selectedStars);
    set({ selectedStars });
  },

  setMinRating: (rating, updateURLParam) => {
    const minRating = get().minRating === rating ? null : rating;
    updateURLParam("minRating", minRating);
    set({ minRating });
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
    if (min < MIN_ALLOWED_PRICE || max > MAX_ALLOWED_PRICE) return;

    updateURLParam("minPrice", min);
    updateURLParam("maxPrice", max);
    set({ minPrice: min, maxPrice: max });
  },

  setPriceCalcMethod: (method, updateURLParam) => {
    updateURLParam("priceCalcMethod", method);
    set({ priceCalcMethod: method });
  },

  setPriceSort: (sortOrder, updateURLParam) => {
    updateURLParam("priceSort", sortOrder);
    set({ priceSort: sortOrder });
  },

  setPopularitySort: (sortOrder, updateURLParam) => {
    updateURLParam("popularitySort", sortOrder);
    set({ popularitySort: sortOrder });
  },

  setSelectedAccommodationTypes: (idOrIds, updateURLParamArray) => {
    if (!idOrIds) return;

    updateURLParamArray("accommodation", idOrIds);
    set({ accommodationTypes: idOrIds });
  },
}));

export function useHotelFilterStore() {
  const s = filterStore();
  const { updateURLParam, updateURLParamArray, deleteURLParam } =
    useURLParams();

  const store = {
    ...s, // all filter values
    setCity: (valueOrCallback) => s.setCity(valueOrCallback, updateURLParam),
    setLocationId: (valueOrCallback) =>
      s.setLocationId(valueOrCallback, updateURLParam),
    setDateRange: (valueOrCallback) =>
      s.setDateRange(valueOrCallback, updateURLParam),
    setRooms: (rooms) => s.setRooms(rooms, updateURLParam, deleteURLParam),
    addRoom: () => s.addRoom(updateURLParam, deleteURLParam),
    removeRoom: (roomId) =>
      s.removeRoom(roomId, updateURLParam, deleteURLParam),
    updateRoomGuest: (roomId, guestType, increment) =>
      s.updateRoomGuest(
        roomId,
        guestType,
        updateURLParam,
        deleteURLParam,
        increment
      ),
    setPriceSort: (sortOrder) => s.setPriceSort(sortOrder, updateURLParam),
    setPopularitySort: (sortOrder) =>
      s.setPopularitySort(sortOrder, updateURLParam),
    setPriceRange: (min, max) => s.setPriceRange(min, max, updateURLParam),
    setPriceCalcMethod: (method) =>
      s.setPriceCalcMethod(method, updateURLParam),
    setTag: (idOrIds) => s.setTag(idOrIds, updateURLParamArray),
    resetTags: () => s.resetTags(deleteURLParam),
    setFacility: (idOrIds) => s.setFacility(idOrIds, updateURLParamArray),
    resetFacilities: () => s.resetFacilities(deleteURLParam),
    setAmenity: (idOrIds) => s.setAmenity(idOrIds, updateURLParamArray),
    resetAmenities: () => s.resetAmenities(deleteURLParam),
    setStars: (stars) => s.setStars(stars, updateURLParam),
    setMinRating: (rating) => s.setMinRating(rating, updateURLParam),
    setSelectedAccommodationTypes: (idOrIds) =>
      s.setSelectedAccommodationTypes(idOrIds, updateURLParamArray),
  };

  const resetStore = () => {
    store.setCity(DEFAULT_CITY);
    store.setLocationId(DEFAULT_LOCATION_ID);
    store.setDateRange(DEFAULT_DATE_RANGE);
    store.setRooms(DEFAULT_ROOM_GUEST_CONFIG);
    store.setPriceSort(null);
    store.setPopularitySort(null);
    store.setPriceRange(
      DEFAULT_PRICE_RANGE.MIN_PRICE,
      DEFAULT_PRICE_RANGE.MAX_PRICE
    );
    store.resetTags();
    store.resetFacilities();
    store.resetAmenities();
    store.setPriceCalcMethod(DEFAULT_PRICE_CALCULATION_METHOD);
    store.setStars(null);
    store.setMinRating(null);
    store.setSelectedAccommodationTypes(new Set(DEFAULT_ACCOMMODATION_TYPES));
  };

  return { ...store, resetFilters: resetStore };
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
  const { getParamByKey } = useURLParams(); // returns null when param doesn't exist

  // Extract filter values
  const city = getParamByKey("city");
  const locationParam = getParamByKey("location");
  const locationId = splitAndGetPart(locationParam, "_", "last");

  let checkInDate = isValidDateString(getParamByKey("fromDate") ?? "")
    ? getParamByKey("fromDate")
    : INITIAL_CHECK_IN_DATE;
  let checkOutDate = isValidDateString(getParamByKey("toDate") ?? "")
    ? getParamByKey("toDate")
    : INITIAL_CHECK_OUT_DATE;

  const rooms = Number.isNaN(parseInt(getParamByKey("rooms")))
    ? 1
    : parseInt(getParamByKey("rooms"));
  const adultGuests = getParamByKey("adults")?.split(",") ?? [
    MIN_ADULT_GUEST_FOR_ROOM,
  ];
  const childGuests = getParamByKey("children")?.split(",") ?? [
    MIN_CHILD_GUEST_FOR_ROOM,
  ];

  let priceSort = getParamByKey("priceSort");
  let popularitySort = getParamByKey("popularitySort");

  let minPrice = Number.isNaN(parseFloat(getParamByKey("minPrice")))
    ? DEFAULT_PRICE_RANGE.MIN_PRICE
    : parseFloat(getParamByKey("minPrice"));
  let maxPrice = Number.isNaN(parseFloat(getParamByKey("maxPrice")))
    ? DEFAULT_PRICE_RANGE.MAX_PRICE
    : parseFloat(getParamByKey("maxPrice"));

  let priceCalcMethod = getParamByKey("priceCalcMethod");

  const tags = getParamByKey("tags")?.split(",") ?? null;
  const facilities = getParamByKey("facilities")?.split(",") ?? null;
  const amenities = getParamByKey("amenities")?.split(",") ?? null;

  let stars = Number.isNaN(parseInt(getParamByKey("stars")))
    ? null
    : parseInt(getParamByKey("stars"));
  let minRating = Number.isNaN(parseFloat(getParamByKey("minRating")))
    ? null
    : parseFloat(getParamByKey("minRating"));

  const accommodationTypes = getParamByKey("accommodation")?.split(",") ?? null;

  // TODO validate city, locationId, tags, facilities, amenities, and accommodation types

  // input validations
  // check-in is after checkout
  if (!compareDates(checkInDate, checkOutDate)) {
    checkInDate = INITIAL_CHECK_IN_DATE;
    checkOutDate = INITIAL_CHECK_OUT_DATE;
  }

  // number of rooms, adults and children are valid
  const roomConfigs = Array.from({ length: rooms }, (_, index) => {
    let adults = Number.isNaN(parseInt(adultGuests[index]))
      ? MIN_ADULT_GUEST_FOR_ROOM
      : parseInt(adultGuests[index]);

    let children = Number.isNaN(parseInt(childGuests[index]))
      ? MIN_CHILD_GUEST_FOR_ROOM
      : parseInt(childGuests[index]);

    if (
      adults < MIN_ADULT_GUEST_FOR_ROOM ||
      adults > MAX_ALLOWED_GUESTS_FOR_ROOM
    ) {
      adults = DEFAULT_ROOM_GUEST_CONFIG[0].adults;
    }

    if (
      children < MIN_CHILD_GUEST_FOR_ROOM ||
      children > MAX_ALLOWED_GUESTS_FOR_ROOM
    ) {
      children = DEFAULT_ROOM_GUEST_CONFIG[0].children;
    }

    if (adults + children > MAX_ALLOWED_GUESTS_FOR_ROOM) {
      adults = DEFAULT_ROOM_GUEST_CONFIG[0].adults;
      children = DEFAULT_ROOM_GUEST_CONFIG[0].children;
    }

    return { id: index, adults, children };
  }).slice(0, MAX_ALLOWED_ROOM_CONFIGS);

  if (
    priceSort !== null &&
    priceSort !== SORT_ORDERS.ASC &&
    priceSort !== SORT_ORDERS.DSC
  ) {
    priceSort = null;
  }

  if (
    popularitySort !== null &&
    popularitySort !== SORT_ORDERS.ASC &&
    popularitySort !== SORT_ORDERS.DSC
  ) {
    popularitySort = null;
  }

  // calculation method is valid
  if (
    priceCalcMethod !== PRICE_CALCULATION_METHODS.NIGHT ||
    priceCalcMethod !== PRICE_CALCULATION_METHODS.TOTAL_STAY
  ) {
    priceCalcMethod = DEFAULT_PRICE_CALCULATION_METHOD;
  }

  if (minPrice > maxPrice) {
    minPrice = DEFAULT_PRICE_RANGE.MIN_PRICE;
    maxPrice = DEFAULT_PRICE_RANGE.MAX_PRICE;
  }

  if (stars < 0 || stars > 5) {
    stars = null;
  }

  if (minRating < 0 || minRating > 10) {
    minRating = null;
  }

  // track filter states
  const areMainFiltersProvided =
    (city || locationId) &&
    checkInDate &&
    checkOutDate &&
    roomConfigs.length > 0;

  const areAdditionalFiltersProvided =
    priceSort === SORT_ORDERS.ASC ||
    priceSort === SORT_ORDERS.DSC ||
    popularitySort === SORT_ORDERS.ASC ||
    popularitySort === SORT_ORDERS.DSC ||
    minPrice !== DEFAULT_PRICE_RANGE.MIN_PRICE ||
    maxPrice !== DEFAULT_PRICE_RANGE.MAX_PRICE ||
    priceCalcMethod !== DEFAULT_PRICE_CALCULATION_METHOD ||
    tags?.length > 0 ||
    facilities?.length > 0 ||
    amenities?.length > 0 ||
    stars > 0 ||
    minRating > 0 ||
    accommodationTypes?.some((id) => !DEFAULT_ACCOMMODATION_TYPES.includes(id));

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
    accommodationTypes,
  };

  return [
    filterValues,
    roomConfigs,
    {
      areMainFiltersProvided,
      areAdditionalFiltersProvided,
    },
  ];
}

// restore price and popularity sort and accommodation filter
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
        DEFAULT_PRICE_RANGE.MIN_PRICE,
        DEFAULT_PRICE_RANGE.MAX_PRICE
      );
      s.setPriceCalcMethod(DEFAULT_PRICE_CALCULATION_METHOD);
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

    if (f.accommodationTypes)
      s.setSelectedAccommodationTypes(new Set(f.accommodationTypes));
    else {
      s.setSelectedAccommodationTypes(new Set(DEFAULT_ACCOMMODATION_TYPES));
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
    f.accommodationTypes,
  ]);
}
