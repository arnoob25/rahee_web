import { create } from "zustand";
import {
  DEFAULT_DATE_RANGE,
  DEFAULT_ROOM_GUEST_CONFIG,
  INITIAL_PRICE_RANGE,
  PRICE_CALCULATION_METHODS,
} from "../config";
import { INTERNAL_DATE_FORMAT } from "@/config/date-formats";
import { format } from "date-fns";

export const useHotelFilterStore = create((set, get) => ({
  // location
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

  setLocationId: (valueOrCallback) => {
    const currentLocation = get().locationId;
    const newLocationId =
      typeof valueOrCallback === "function"
        ? valueOrCallback(currentLocation)
        : valueOrCallback;

    set({
      locationId: newLocationId !== currentLocation ? newLocationId : null,
      hasUnappliedFilters: true,
    });
  },

  setDateRange: (valueOrCallback) => {
    const currentRange = get().dateRange;
    const newDateRange =
      typeof valueOrCallback === "function"
        ? valueOrCallback(currentRange)
        : valueOrCallback;

    set({
      dateRange: newDateRange,
      hasUnappliedFilters: true,
    });
  },

  setRooms: (newRooms) => set({ rooms: newRooms, hasUnappliedFilters: true }),

  addRoom: () => {
    set((state) => {
      const newId = state.rooms.length + 1;
      return {
        rooms: [...state.rooms, { id: newId, adults: 1, children: 0 }],
        hasUnappliedFilters: true,
      };
    });
  },

  removeRoom: (roomId) => {
    set((state) => {
      if (state.rooms.length <= 1) return {};
      return {
        rooms: state.rooms.filter((r) => r.id !== roomId),
        hasUnappliedFilters: true,
      };
    });
  },

  updateRoomGuest: (roomId, type, increment = true) => {
    set((state) => {
      const rooms = state.rooms.map((room) => {
        if (room.id !== roomId) return room;
        const newVal = increment ? room[type] + 1 : room[type] - 1;
        if (newVal < 0) return room;
        return { ...room, [type]: newVal };
      });
      return { rooms, hasUnappliedFilters: true };
    });
  },

  setTag: (id) => {
    const tags = new Set(get().selectedTags);
    tags.has(id) ? tags.delete(id) : tags.add(id);
    set({ selectedTags: tags, hasUnappliedFilters: true });
  },

  setFacility: (id) => {
    const facilities = new Set(get().selectedFacilities);
    facilities.has(id) ? facilities.delete(id) : facilities.add(id);
    set({ selectedFacilities: facilities, hasUnappliedFilters: true });
  },

  setAmenity: (id) => {
    const amenities = new Set(get().selectedAmenities);
    amenities.has(id) ? amenities.delete(id) : amenities.add(id);
    set({ selectedAmenities: amenities, hasUnappliedFilters: true });
  },

  setStars: (stars) => {
    set((state) => ({
      selectedStars: state.selectedStars === stars ? null : stars,
      hasUnappliedFilters: true,
    }));
  },

  setMinRating: (rating) => {
    set((state) => ({
      minRating: state.minRating === rating ? null : rating,
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

  setPriceRange: (min, max) => {
    set({ minPrice: min, maxPrice: max, hasUnappliedFilters: true });
  },

  setPriceCalcMethod: (method) => {
    set({ priceCalcMethod: method, hasUnappliedFilters: true });
  },

  setPriceSort: (sortOrder) => {
    set({ priceSort: sortOrder, hasUnappliedFilters: true });
  },

  setPopularitySort: (sortOrder) => {
    set({ popularitySort: sortOrder, hasUnappliedFilters: true });
  },

  setHasUnappliedFilters: (isNewFilterApplied) => {
    if (!isNewFilterApplied || get().hasUnappliedFilters) return;
    set({ hasUnappliedFilters: true });
  },

  applyFilters: (
    updateURLParam,
    updateURLParamArray,
    deleteURLParam,
    updateURL
  ) => {
    const {
      locationId,
      dateRange,
      selectedTags,
      selectedFacilities,
      selectedAmenities,
      selectedStars,
      minRating,
      minPrice,
      maxPrice,
      priceCalcMethod,
      priceSort,
      popularitySort,
      rooms,
    } = get();
    const adults = rooms.map((room) => room.adults).join(",");
    const children = rooms.map((room) => room.children).join(",");

    updateURLParam("location", locationId, false);
    updateURLParam(
      "fromDate",
      format(dateRange.from, INTERNAL_DATE_FORMAT),
      false
    );
    updateURLParam("toDate", format(dateRange.to, INTERNAL_DATE_FORMAT), false);
    updateURLParamArray("tags", selectedTags, false);
    updateURLParamArray("facilities", selectedFacilities, false);
    updateURLParamArray("amenities", selectedAmenities, false);
    updateURLParam("stars", selectedStars, false);
    updateURLParam("minRating", minRating, false);
    updateURLParam("minPrice", minPrice, false);
    updateURLParam("maxPrice", maxPrice, false);
    updateURLParam("priceCalcMethod", priceCalcMethod, false);
    updateURLParam("priceSort", priceSort, false);
    updateURLParam("popularitySort", popularitySort, false);
    updateURLParam("rooms", rooms.length.toString(), false);
    updateURLParam("adults", adults, false);
    if (children.split(",").some((val) => parseInt(val) > 0)) {
      updateURLParam("children", children, false);
    } else {
      deleteURLParam("children", false);
    }

    set({ hasUnappliedFilters: false });
    updateURL();
  },

  resetFilters: (deleteURLParam, updateURL) => {
    const params = [
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

// TODO: move it to a util file
function createSetter(currentState, setterFunc) {
  return function (valueOrCallback) {
    const newValue = // optional use callback processes current state and returns value
      typeof valueOrCallback === "function"
        ? valueOrCallback(currentState)
        : valueOrCallback;

    set({
      [key]: newValue,
      ...extras,
    });
  };
}
