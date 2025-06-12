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
  DEFAULT_ACCOMMODATION_TYPES,
  DEFAULT_CITY,
  DEFAULT_LOCATION_ID,
  DEFAULT_PRICE_CALCULATION_METHOD,
  MAX_ALLOWED_ROOM_CONFIGS,
  MIN_ALLOWED_PRICE,
  MAX_ALLOWED_PRICE,
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

import { resolveValueFromOptionalCallback } from "@/lib/store.utils";
import { nanoid } from "nanoid";

const locationStore = create((set) => ({
  city: null,
  locationId: null,

  setCity: (city) => set({ city }),

  setLocationId: (locationId) => set({ locationId }),
}));

const dateRangeStore = create((set) => ({
  dateRange: DEFAULT_DATE_RANGE,

  setDateRange: (dateRange) => set({ dateRange }),
}));

const roomConfigStore = create((set) => ({
  rooms: DEFAULT_ROOM_GUEST_CONFIG,

  setRooms: (rooms) => set({ rooms }),
}));

const sortingOptionsStore = create((set) => ({
  priceSort: null,
  popularitySort: null,

  setPriceSort: (sortOrder) => set({ priceSort: sortOrder }),

  setPopularitySort: (sortOrder) => set({ popularitySort: sortOrder }),
}));

const priceRangeStore = create((set) => ({
  minPrice: DEFAULT_PRICE_RANGE.MIN_PRICE,
  maxPrice: DEFAULT_PRICE_RANGE.MAX_PRICE,
  priceCalcMethod: DEFAULT_PRICE_CALCULATION_METHOD,

  setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),

  setPriceCalcMethod: (priceCalcMethod) => set({ priceCalcMethod }),
}));

const attributesStore = create((set) => ({
  selectedTags: new Set(),
  selectedFacilities: new Set(),
  selectedAmenities: new Set(),
  selectedStars: null,

  setTags: (selectedTags) => set({ selectedTags }),
  resetTags: () => set({ selectedTags: new Set() }),

  setFacilities: (selectedFacilities) => set({ selectedFacilities }),
  resetFacilities: () => set({ selectedFacilities: new Set() }),

  setAmenities: (selectedAmenities) => set({ selectedAmenities }),
  resetAmenities: () => set({ selectedAmenities: new Set() }),

  setStars: (selectedStars) => set({ selectedStars }),
}));

const miscFiltersStore = create((set) => ({
  minRating: null,
  accommodationTypes: new Set(DEFAULT_ACCOMMODATION_TYPES),

  setMinRating: (minRating) => set({ minRating }),

  setAccommodationTypes: (accommodationTypes) => set({ accommodationTypes }),
}));

export function useLocationStore() {
  const { updateURLParam } = useURLParams();
  const s = locationStore();

  const currentCity = s.city;
  const currentLocationId = s.locationId;

  return {
    city: currentCity,
    locationId: currentLocationId,

    setCity: (valueOrCallback, shouldUpdateURL = true) => {
      const value = resolveValueFromOptionalCallback(
        valueOrCallback,
        currentCity
      );

      const newCity = value !== currentCity ? value : null;

      s.setCity(newCity);

      if (!shouldUpdateURL) return;

      updateURLParam("city", newCity);
    },

    setLocationId: (valueOrCallback, shouldUpdateURL = true) => {
      const value = resolveValueFromOptionalCallback(
        valueOrCallback,
        currentLocationId
      );

      const newLocationId = value !== currentLocationId ? value : null;

      s.setLocationId(newLocationId);

      if (!shouldUpdateURL) return;

      updateURLParam("location", newLocationId);
    },
  };
}

export function useDateRangeStore() {
  const { updateURLParam } = useURLParams();
  const s = dateRangeStore();

  const currentDateRange = s.dateRange;

  return {
    dateRange: currentDateRange,

    setDateRange: (valueOrCallback, shouldUpdateURL = true) => {
      const newRange = resolveValueFromOptionalCallback(
        valueOrCallback,
        currentDateRange
      );

      const newFromDate = newRange.from;
      const newToDate = newRange.to;

      s.setDateRange(newRange);

      if (!shouldUpdateURL) return;

      if (newFromDate)
        updateURLParam("fromDate", format(newFromDate, INTERNAL_DATE_FORMAT));
      if (newToDate)
        updateURLParam("toDate", format(newToDate, INTERNAL_DATE_FORMAT));
    },

    getStayDuration: () => {
      const { from, to } = currentDateRange;
      return differenceInDays(to, from);
    },
  };
}

export function useRoomConfigStore() {
  const { updateURLParam, deleteURLParam } = useURLParams();
  const s = roomConfigStore();
  const currentRooms = s.rooms;

  const syncURLParams = (rooms, shouldUpdateURL) => {
    if (!shouldUpdateURL) return;

    const roomsCount = rooms.length;
    const adultsCounts = rooms.map((room) => room.adults).join(",");
    const childrenCounts = rooms.map((room) => room.children).join(",");

    updateURLParam("rooms", roomsCount);
    updateURLParam("adults", adultsCounts);

    childrenCounts.split(",").some((val) => parseInt(val) > 0)
      ? updateURLParam("children", childrenCounts)
      : deleteURLParam("children");
  };

  const setRooms = (rooms, shouldUpdateURL = true) => {
    const maxAllowedRooms = rooms.slice(0, MAX_ALLOWED_ROOM_CONFIGS);

    s.setRooms(maxAllowedRooms);
    syncURLParams(maxAllowedRooms, shouldUpdateURL);
  };

  return {
    rooms: currentRooms,
    setRooms,

    addRoom: (shouldUpdateURL = true) => {
      if (currentRooms.length >= MAX_ALLOWED_ROOM_CONFIGS) return;

      const updatedRooms = [
        ...currentRooms,
        {
          id: nanoid(),
          adults: MIN_ADULT_GUEST_FOR_ROOM,
          children: MIN_CHILD_GUEST_FOR_ROOM,
        },
      ];

      setRooms(updatedRooms, shouldUpdateURL);
    },

    removeRoom: (roomId, shouldUpdateURL = true) => {
      if (currentRooms.length <= 1) return;

      const updatedRooms = currentRooms.filter((r) => r.id !== roomId);

      setRooms(updatedRooms, shouldUpdateURL);
    },

    updateRoomGuest: (
      roomId,
      guestType,
      increment = true,
      shouldUpdateURL = true
    ) => {
      const propertyToUpdate =
        guestType === GUEST_TYPES.adult ? "adults" : "children";

      const updatedRooms = currentRooms.map((room) => {
        if (room.id !== roomId) return room;

        let updatedValue = increment
          ? room[propertyToUpdate] + 1
          : room[propertyToUpdate] - 1;

        const updatedRoom = { ...room, [propertyToUpdate]: updatedValue };

        if (
          updatedRoom.adults + updatedRoom.children >
          MAX_ALLOWED_GUESTS_FOR_ROOM
        )
          return room;
        if (updatedRoom.adults < MIN_ADULT_GUEST_FOR_ROOM) return room;
        if (updatedRoom.children < MIN_CHILD_GUEST_FOR_ROOM) return room;

        return updatedRoom;
      });

      setRooms(updatedRooms, shouldUpdateURL);
    },
  };
}

export function useSortingOptionsStore() {
  const { updateURLParam } = useURLParams();
  const s = sortingOptionsStore();

  const currentPriceSortOrder = s.priceSort;
  const currentPopularitySortOrder = s.popularitySort;

  return {
    priceSort: currentPriceSortOrder,
    popularitySort: currentPopularitySortOrder,

    setPriceSort: (sortOrder, shouldUpdateURL = true) => {
      s.setPriceSort(sortOrder);
      if (!shouldUpdateURL) return;
      updateURLParam("priceSort", sortOrder);
    },

    setPopularitySort: (sortOrder, shouldUpdateURL = true) => {
      s.setPopularitySort(sortOrder);
      if (!shouldUpdateURL) return;
      updateURLParam("popularitySort", sortOrder);
    },
  };
}

export function usePriceRangeStore() {
  const { updateURLParam } = useURLParams();
  const s = priceRangeStore();

  return {
    minPrice: s.minPrice,
    maxPrice: s.maxPrice,
    priceCalcMethod: s.priceCalcMethod,

    setPriceRange: (newMinPrice, newMaxPrice, shouldUpdateURL = true) => {
      if (newMinPrice < MIN_ALLOWED_PRICE || newMaxPrice > MAX_ALLOWED_PRICE)
        return;

      s.setPriceRange(newMinPrice, newMaxPrice);

      if (!shouldUpdateURL) return;

      updateURLParam("minPrice", newMinPrice);
      updateURLParam("maxPrice", newMaxPrice);
    },

    setPriceCalcMethod: (newPriceCalcMethod, shouldUpdateURL = true) => {
      s.setPriceCalcMethod(newPriceCalcMethod);

      if (!shouldUpdateURL) return;

      updateURLParam("priceCalcMethod", newPriceCalcMethod);
    },
  };
}

export function useAttributesStore() {
  const { updateURLParam, updateURLParamArray, deleteURLParam } =
    useURLParams();
  const {
    selectedTags,
    selectedFacilities,
    selectedAmenities,
    selectedStars,
    setTags,
    setFacilities,
    setAmenities,
    setStars,
    resetTags,
    resetFacilities,
    resetAmenities,
  } = attributesStore();

  const toggleItemOrItems = (
    urlParamKey,
    setterFn,
    currentItems,
    idOrIds,
    shouldUpdateURL = true
  ) => {
    const updatedItems = new Set(currentItems);

    (Array.isArray(idOrIds) ? idOrIds : [idOrIds]).forEach((id) => {
      if (!id) return;
      updatedItems.has(id) ? updatedItems.delete(id) : updatedItems.add(id);
    });

    setterFn(updatedItems);

    if (!shouldUpdateURL) return;

    updateURLParamArray(urlParamKey, updatedItems);
  };

  return {
    selectedTags,
    selectedFacilities,
    selectedAmenities,
    selectedStars,

    setTag: (idOrIds, shouldUpdateURL = true) =>
      toggleItemOrItems(
        "tags",
        setTags,
        selectedTags,
        idOrIds,
        shouldUpdateURL
      ),

    setFacility: (idOrIds, shouldUpdateURL = true) =>
      toggleItemOrItems(
        "facilities",
        setFacilities,
        selectedFacilities,
        idOrIds,
        shouldUpdateURL
      ),

    setAmenity: (idOrIds, shouldUpdateURL = true) =>
      toggleItemOrItems(
        "amenities",
        setAmenities,
        selectedAmenities,
        idOrIds,
        shouldUpdateURL
      ),

    resetTags: (shouldUpdateURL = true) => {
      resetTags();
      if (!shouldUpdateURL) return;
      deleteURLParam("tags");
    },

    resetFacilities: (shouldUpdateURL = true) => {
      resetFacilities();
      if (!shouldUpdateURL) return;
      deleteURLParam("facilities");
    },

    resetAmenities: (shouldUpdateURL = true) => {
      resetAmenities();
      if (!shouldUpdateURL) return;
      deleteURLParam("amenities");
    },

    setStars: (stars, shouldUpdateURL = true) => {
      const value = selectedStars === stars ? null : stars;
      setStars(value);
      if (!shouldUpdateURL) return;
      updateURLParam("stars", value);
    },

    getAttributeFilterCount: () => {
      const attrCount = new Set([
        ...selectedTags,
        ...selectedFacilities,
        ...selectedAmenities,
      ]).size;
      return attrCount + (selectedStars ? 1 : 0);
    },
  };
}

export function useMiscFiltersStore() {
  const { updateURLParam, updateURLParamArray } = useURLParams();
  const { minRating, accommodationTypes, ...s } = miscFiltersStore();

  return {
    minRating,
    accommodationTypes,

    setMinRating: (value, shouldUpdateURL = true) => {
      const newRating = value === minRating ? null : value;
      s.setMinRating(newRating);

      if (!shouldUpdateURL) return;

      updateURLParam("minRating", newRating);
    },

    setSelectedAccommodationTypes: (
      selectedAccommodations,
      shouldUpdateURL = true
    ) => {
      s.setAccommodationTypes(selectedAccommodations);
      if (!shouldUpdateURL) return;
      updateURLParamArray("accommodations", selectedAccommodations);
    },
  };
}

export function useHotelFilterStore() {
  const { updateURLParam, updateURLParamArray, deleteURLParam } =
    useURLParams();
  const location = useLocationStore();
  const dateRange = useDateRangeStore();
  const roomConfig = useRoomConfigStore();
  const sortingOptions = useSortingOptionsStore();
  const priceRange = usePriceRangeStore();
  const attributes = useAttributesStore();
  const miscFilters = useMiscFiltersStore();

  const resetLocation = () => {
    location.setCity(DEFAULT_CITY, false);
    location.setLocationId(DEFAULT_LOCATION_ID, false);

    updateURLParam("city", DEFAULT_CITY);
    updateURLParam("location", DEFAULT_LOCATION_ID);
  };

  const resetDateRange = () => {
    dateRange.setDateRange(DEFAULT_DATE_RANGE, false);

    updateURLParam(
      "fromDate",
      format(DEFAULT_DATE_RANGE.from, INTERNAL_DATE_FORMAT)
    );
    updateURLParam(
      "toDate",
      format(DEFAULT_DATE_RANGE.to, INTERNAL_DATE_FORMAT)
    );
  };

  const resetRoomConfig = () => {
    roomConfig.setRooms(DEFAULT_ROOM_GUEST_CONFIG, false);

    const rooms = DEFAULT_ROOM_GUEST_CONFIG;
    const adultsCounts = rooms.map((room) => room.adults).join(",");
    const childrenCounts = rooms.map((room) => room.children).join(",");

    updateURLParam("rooms", rooms.length);
    updateURLParam("adults", adultsCounts);

    childrenCounts.split(",").some((val) => parseInt(val) > 0)
      ? updateURLParam("children", childrenCounts)
      : deleteURLParam("children");
  };

  const resetSortingOptions = () => {
    sortingOptions.setPriceSort(null, false);
    sortingOptions.setPopularitySort(null, false);

    deleteURLParam("priceSort");
    deleteURLParam("popularitySort");
  };

  const resetPriceRange = () => {
    priceRange.setPriceRange(
      DEFAULT_PRICE_RANGE.MIN_PRICE,
      DEFAULT_PRICE_RANGE.MAX_PRICE,
      false
    );
    priceRange.setPriceCalcMethod(DEFAULT_PRICE_CALCULATION_METHOD, false);

    deleteURLParam("minPrice");
    deleteURLParam("maxPrice");
    deleteURLParam("priceCalcMethod");
  };

  const resetAttributes = () => {
    attributes.resetTags(false);
    attributes.resetFacilities(false);
    attributes.resetAmenities(false);
    attributes.setStars(null, false);

    deleteURLParam("tags");
    deleteURLParam("facilities");
    deleteURLParam("amenities");
    deleteURLParam("stars");
  };

  const resetMiscFilters = () => {
    miscFilters.setMinRating(null, false);
    miscFilters.setSelectedAccommodationTypes(
      new Set(DEFAULT_ACCOMMODATION_TYPES),
      false
    );

    deleteURLParam("minRating");
    updateURLParamArray("accommodations", DEFAULT_ACCOMMODATION_TYPES);
  };

  return {
    filterValues: {
      city: location.city,
      locationId: location.locationId,
      checkInDate: dateRange.dateRange.from,
      checkOutDate: dateRange.dateRange.to,
      roomConfigs: roomConfig.rooms,
      priceSort: sortingOptions.priceSort,
      popularitySort: sortingOptions.popularitySort,
      minPrice: priceRange.minPrice,
      maxPrice: priceRange.maxPrice,
      priceCalcMethod: priceRange.priceCalcMethod,
      tags:
        attributes.selectedTags.size > 0
          ? Array.from(attributes.selectedTags)
          : null,
      facilities:
        attributes.selectedFacilities.size > 0
          ? Array.from(attributes.selectedFacilities)
          : null,
      amenities:
        attributes.selectedAmenities.size > 0
          ? Array.from(attributes.selectedAmenities)
          : null,
      stars: attributes.selectedStars,
      minRating: miscFilters.minRating,
      accommodationTypes:
        miscFilters.accommodationTypes.size > 0
          ? Array.from(miscFilters.accommodationTypes)
          : null,
    },

    resetFilters: () => {
      resetLocation();
      resetDateRange();
      resetRoomConfig();
      resetSortingOptions();
      resetPriceRange();
      resetAttributes();
      resetMiscFilters();
    },

    areAllMainFiltersProvided: !!(
      (location.city || location.locationId) &&
      dateRange.dateRange.from &&
      dateRange.dateRange.to &&
      roomConfig.rooms.length > 0
    ),

    areAnyAdditionalFiltersProvided: !!(
      sortingOptions.priceSort ||
      sortingOptions.popularitySort ||
      priceRange.minPrice !== DEFAULT_PRICE_RANGE.MIN_PRICE ||
      priceRange.maxPrice !== DEFAULT_PRICE_RANGE.MAX_PRICE ||
      priceRange.priceCalcMethod !== DEFAULT_PRICE_CALCULATION_METHOD ||
      attributes.selectedTags?.length > 0 ||
      attributes.selectedFacilities?.length > 0 ||
      attributes.selectedAmenities?.length > 0 ||
      attributes.selectedStars > 0 ||
      miscFilters.minRating > 0 ||
      [...miscFilters.accommodationTypes].some(
        (id) => !DEFAULT_ACCOMMODATION_TYPES.includes(id)
      ) ||
      miscFilters.accommodationTypes.length !==
        DEFAULT_ACCOMMODATION_TYPES.length
    ),
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
