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
  city: null,
  locationId: null,
  dateRange: DEFAULT_DATE_RANGE,
  rooms: DEFAULT_ROOM_GUEST_CONFIG,
  selectedTags: new Set(),
  selectedFacilities: new Set(),
  selectedAmenities: new Set(),
  selectedStars: null,
  minRating: null,
  minPrice: DEFAULT_PRICE_RANGE.MIN_PRICE,
  maxPrice: DEFAULT_PRICE_RANGE.MAX_PRICE,
  priceCalcMethod: DEFAULT_PRICE_CALCULATION_METHOD,
  priceSort: null,
  popularitySort: null,
  accommodationTypes: new Set(DEFAULT_ACCOMMODATION_TYPES),

  setCity: (valueOrCallback) => {
    const current = get().city;
    const value =
      typeof valueOrCallback === "function"
        ? valueOrCallback(current)
        : valueOrCallback;
    const newCity = value !== current ? value : null;
    set({ city: newCity });
    return newCity;
  },

  setLocationId: (valueOrCallback) => {
    const current = get().locationId;
    const value =
      typeof valueOrCallback === "function"
        ? valueOrCallback(current)
        : valueOrCallback;
    const newLocationId = value !== current ? value : null;
    set({ locationId: newLocationId });
    return newLocationId;
  },

  setDateRange: (valueOrCallback) => {
    const current = get().dateRange;
    const range =
      typeof valueOrCallback === "function"
        ? valueOrCallback(current)
        : valueOrCallback;
    set({ dateRange: range });
    return range;
  },

  getStayDuration: () => {
    const { from, to } = get().dateRange;
    return differenceInDays(to, from);
  },

  setRooms: (rooms) => {
    const maxRooms = rooms.slice(0, MAX_ALLOWED_ROOM_CONFIGS);
    set({ rooms: maxRooms });
    return maxRooms;
  },

  addRoom: () => {
    const rooms = get().rooms;
    if (rooms.length >= MAX_ALLOWED_ROOM_CONFIGS) return rooms;
    const updated = [
      ...rooms,
      { id: rooms.length + 1, adults: 1, children: 0 },
    ];
    set({ rooms: updated });
    return updated;
  },

  removeRoom: (roomId) => {
    const rooms = get().rooms;
    if (rooms.length <= 1) return rooms;
    const updated = rooms.filter((r) => r.id !== roomId);
    set({ rooms: updated });
    return updated;
  },

  updateRoomGuest: (roomId, guestType, increment = true) => {
    const isAdult = guestType === GUEST_TYPES.adult;
    const prop = isAdult ? "adults" : "children";
    const updated = get().rooms.map((room) => {
      if (room.id !== roomId) return room;
      let val = increment ? room[prop] + 1 : room[prop] - 1;
      const next = { ...room, [prop]: val };
      if (next.adults + next.children > MAX_ALLOWED_GUESTS_FOR_ROOM)
        return room;
      if (next.adults < MIN_ADULT_GUEST_FOR_ROOM) return room;
      if (next.children < MIN_CHILD_GUEST_FOR_ROOM) return room;
      return next;
    });
    set({ rooms: updated });
    return updated;
  },

  setTag: (idOrIds) => {
    const tags = new Set(get().selectedTags);
    (Array.isArray(idOrIds) ? idOrIds : [idOrIds]).forEach((id) => {
      if (!id) return;
      tags.has(id) ? tags.delete(id) : tags.add(id);
    });
    set({ selectedTags: tags });
    return tags;
  },

  resetTags: () => {
    set({ selectedTags: new Set() });
    return new Set();
  },

  setFacility: (idOrIds) => {
    const items = new Set(get().selectedFacilities);
    (Array.isArray(idOrIds) ? idOrIds : [idOrIds]).forEach((id) => {
      if (!id) return;
      items.has(id) ? items.delete(id) : items.add(id);
    });
    set({ selectedFacilities: items });
    return items;
  },

  resetFacilities: () => {
    set({ selectedFacilities: new Set() });
    return new Set();
  },

  setAmenity: (idOrIds) => {
    const items = new Set(get().selectedAmenities);
    (Array.isArray(idOrIds) ? idOrIds : [idOrIds]).forEach((id) => {
      if (!id) return;
      items.has(id) ? items.delete(id) : items.add(id);
    });
    set({ selectedAmenities: items });
    return items;
  },

  resetAmenities: () => {
    set({ selectedAmenities: new Set() });
    return new Set();
  },

  setStars: (stars) => {
    const value = get().selectedStars === stars ? null : stars;
    set({ selectedStars: value });
    return value;
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

  setMinRating: (rating) => {
    const value = get().minRating === rating ? null : rating;
    set({ minRating: value });
    return value;
  },

  setPriceRange: (min, max) => {
    if (min < MIN_ALLOWED_PRICE || max > MAX_ALLOWED_PRICE) return;
    set({ minPrice: min, maxPrice: max });
    return [min, max];
  },

  setPriceCalcMethod: (method) => {
    set({ priceCalcMethod: method });
    return method;
  },

  setPriceSort: (sortOrder) => {
    set({ priceSort: sortOrder });
    return sortOrder;
  },

  setPopularitySort: (sortOrder) => {
    set({ popularitySort: sortOrder });
    return sortOrder;
  },

  setSelectedAccommodationTypes: (types) => {
    set({ accommodationTypes: types });
    return types;
  },
}));

export function useHotelFilterStore() {
  const s = filterStore();
  const { updateURLParam, updateURLParamArray, deleteURLParam } =
    useURLParams();

  return {
    ...s,
    setCity: (val) => updateURLParam("city", s.setCity(val)),
    setLocationId: (val) => updateURLParam("location", s.setLocationId(val)),
    setDateRange: (val) => {
      const { from, to } = s.setDateRange(val);
      if (from) updateURLParam("fromDate", format(from, INTERNAL_DATE_FORMAT));
      if (to) updateURLParam("toDate", format(to, INTERNAL_DATE_FORMAT));
    },
    setRooms: (rooms) => {
      const updated = s.setRooms(rooms);
      updateURLParam("rooms", updated.length.toString());
      updateURLParam("adults", updated.map((r) => r.adults).join(","));
      const children = updated.map((r) => r.children).join(",");
      children.split(",").some((val) => parseInt(val) > 0)
        ? updateURLParam("children", children)
        : deleteURLParam("children");
    },
    addRoom: () => {
      const updated = s.addRoom();
      updateURLParam("rooms", updated.length);
      updateURLParam("adults", updated.map((r) => r.adults).join(","));
      const children = updated.map((r) => r.children).join(",");
      children.split(",").some((val) => parseInt(val) > 0)
        ? updateURLParam("children", children)
        : deleteURLParam("children");
    },
    removeRoom: (id) => {
      const updated = s.removeRoom(id);
      updateURLParam("rooms", updated.length);
      updateURLParam("adults", updated.map((r) => r.adults).join(","));
      const children = updated.map((r) => r.children).join(",");
      children.split(",").some((val) => parseInt(val) > 0)
        ? updateURLParam("children", children)
        : deleteURLParam("children");
    },
    updateRoomGuest: (id, type, increment) => {
      const updated = s.updateRoomGuest(id, type, increment);
      updateURLParam("rooms", updated.length);
      updateURLParam("adults", updated.map((r) => r.adults).join(","));
      const children = updated.map((r) => r.children).join(",");
      children.split(",").some((val) => parseInt(val) > 0)
        ? updateURLParam("children", children)
        : deleteURLParam("children");
    },
    setTag: (ids) => updateURLParamArray("tags", s.setTag(ids)),
    resetTags: () => deleteURLParam("tags") || s.resetTags(),
    setFacility: (ids) => updateURLParamArray("facilities", s.setFacility(ids)),
    resetFacilities: () => deleteURLParam("facilities") || s.resetFacilities(),
    setAmenity: (ids) => updateURLParamArray("amenities", s.setAmenity(ids)),
    resetAmenities: () => deleteURLParam("amenities") || s.resetAmenities(),
    setStars: (val) => updateURLParam("stars", s.setStars(val)),
    setMinRating: (val) => updateURLParam("minRating", s.setMinRating(val)),
    setPriceRange: (min, max) => {
      const [newMin, newMax] = s.setPriceRange(min, max);
      updateURLParam("minPrice", newMin);
      updateURLParam("maxPrice", newMax);
    },
    setPriceCalcMethod: (method) =>
      updateURLParam("priceCalcMethod", s.setPriceCalcMethod(method)),
    setPriceSort: (val) => updateURLParam("priceSort", s.setPriceSort(val)),
    setPopularitySort: (val) =>
      updateURLParam("popularitySort", s.setPopularitySort(val)),
    setSelectedAccommodationTypes: (set) =>
      updateURLParamArray(
        "accommodation",
        s.setSelectedAccommodationTypes(set)
      ),

    resetFilters: () => {
      const store = filterStore.getState();
      updateURLParam("city", store.setCity(DEFAULT_CITY));
      updateURLParam("location", store.setLocationId(DEFAULT_LOCATION_ID));
      const range = store.setDateRange(DEFAULT_DATE_RANGE);
      updateURLParam("fromDate", format(range.from, INTERNAL_DATE_FORMAT));
      updateURLParam("toDate", format(range.to, INTERNAL_DATE_FORMAT));
      const rooms = store.setRooms(DEFAULT_ROOM_GUEST_CONFIG);
      updateURLParam("rooms", rooms.length);
      updateURLParam("adults", rooms.map((r) => r.adults).join(","));
      deleteURLParam("children");
      updateURLParam("priceSort", store.setPriceSort(null));
      updateURLParam("popularitySort", store.setPopularitySort(null));
      const [min, max] = store.setPriceRange(
        DEFAULT_PRICE_RANGE.MIN_PRICE,
        DEFAULT_PRICE_RANGE.MAX_PRICE
      );
      updateURLParam("minPrice", min);
      updateURLParam("maxPrice", max);
      deleteURLParam("tags");
      store.resetTags();
      deleteURLParam("facilities");
      store.resetFacilities();
      deleteURLParam("amenities");
      store.resetAmenities();
      updateURLParam(
        "priceCalcMethod",
        store.setPriceCalcMethod(DEFAULT_PRICE_CALCULATION_METHOD)
      );
      updateURLParam("stars", store.setStars(null));
      updateURLParam("minRating", store.setMinRating(null));
      updateURLParamArray(
        "accommodation",
        store.setSelectedAccommodationTypes(
          new Set(DEFAULT_ACCOMMODATION_TYPES)
        )
      );
    },
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
