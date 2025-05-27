import { create } from "zustand";
import {
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
} from "../config";
import { INTERNAL_DATE_FORMAT } from "@/config/date-formats";
import { format } from "date-fns";
import { useURLParams } from "@/hooks/use-url-param";

const filterStore = create((set, get) => ({
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

  setTag: (id, updateURLParamArray) => {
    const tags = new Set(get().selectedTags);
    tags.has(id) ? tags.delete(id) : tags.add(id);
    updateURLParamArray("tags", tags);
    set({ selectedTags: tags, hasUnappliedFilters: true });
  },

  setFacility: (id, updateURLParamArray) => {
    const facilities = new Set(get().selectedFacilities);
    facilities.has(id) ? facilities.delete(id) : facilities.add(id);
    updateURLParamArray("facilities", facilities);
    set({ selectedFacilities: facilities, hasUnappliedFilters: true });
  },

  setAmenity: (id, updateURLParamArray) => {
    const amenities = new Set(get().selectedAmenities);
    amenities.has(id) ? amenities.delete(id) : amenities.add(id);
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

  applyFilters: (
    updateURLParam,
    updateURLParamArray,
    deleteURLParam,
    updateURL
  ) => {
    set({ hasUnappliedFilters: false });
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

export function useHotelFilterStore() {
  const f = filterStore();
  const { updateURLParam, updateURLParamArray, deleteURLParam } =
    useURLParams();

  return {
    ...f, // all filter values
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
    setTag: (id) => f.setTag(id, updateURLParamArray),
    setFacility: (id) => f.setFacility(id, updateURLParamArray),
    setAmenity: (id) => f.setAmenity(id, updateURLParamArray),
    setStars: (stars) => f.setStars(stars, updateURLParam),
    setMinRating: (rating) => f.setMinRating(rating, updateURLParam),
    setPriceRange: (min, max) => f.setPriceRange(min, max, updateURLParam),
    setPriceCalcMethod: (method) =>
      f.setPriceCalcMethod(method, updateURLParam),
    setPriceSort: (sortOrder) => f.setPriceSort(sortOrder, updateURLParam),
    setPopularitySort: (sortOrder) =>
      f.setPopularitySort(sortOrder, updateURLParam),
  };
}
