import { create } from "zustand";
import { INITIAL_PRICE_RANGE, PRICE_CALCULATION_METHODS } from "../config";

export const useHotelFiltersStore = create((set, get) => ({
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
  priceMethod: PRICE_CALCULATION_METHODS.night,

  hasUnappliedFilters: false,

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
      minRating,
    } = get();
    const attrCount = new Set([
      ...selectedTags,
      ...selectedFacilities,
      ...selectedAmenities,
    ]).size;
    return attrCount + (selectedStars ? 1 : 0) + (minRating ? 1 : 0);
  },

  setPriceRange: (min, max) => {
    set({ minPrice: min, maxPrice: max, hasUnappliedFilters: true });
  },

  setPriceMethod: (method) => {
    set({ priceMethod: method, hasUnappliedFilters: true });
  },

  setHasUnappliedFilters: (isNewFilterApplied) => {
    if (!isNewFilterApplied || get().hasUnappliedFilters) return;
    set({ hasUnappliedFilters: true });
  },

  applyFilters: (updateURLParam, updateURLParamArray, updateURL) => {
    const {
      selectedTags,
      selectedFacilities,
      selectedAmenities,
      selectedStars,
      minRating,
      minPrice,
      maxPrice,
      priceMethod,
    } = get();

    updateURLParamArray("tags", selectedTags, false);
    updateURLParamArray("facilities", selectedFacilities, false);
    updateURLParamArray("amenities", selectedAmenities, false);
    updateURLParam("stars", selectedStars, false);
    updateURLParam("minRating", minRating, false);
    updateURLParam("minPrice", minPrice, false);
    updateURLParam("maxPrice", maxPrice, false);
    updateURLParam("priceMethod", priceMethod, false);

    set({ hasUnappliedFilters: false });
    updateURL();
  },

  resetFilters: (deleteURLParam, updateURL) => {
    const params = [
      "tags",
      "facilities",
      "amenities",
      "stars",
      "minRating",
      "minPrice",
      "maxPrice",
      "priceMethod",
    ];
    params.forEach((param) => deleteURLParam(param, false));

    set({
      selectedTags: new Set(),
      selectedFacilities: new Set(),
      selectedAmenities: new Set(),
      selectedStars: null,
      minRating: null,
      minPrice: INITIAL_PRICE_RANGE.minPrice,
      maxPrice: INITIAL_PRICE_RANGE.maxPrice,
      priceMethod: PRICE_CALCULATION_METHODS.night,
      hasUnappliedFilters: false,
    });

    updateURL();
  },
}));
