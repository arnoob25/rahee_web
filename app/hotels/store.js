import { observable } from "@legendapp/state";
import { INITIAL_PRICE_RANGE, SORTING_CRITERIA } from "./config";

export const appliedFilters$ = observable({
  hotelPricing: {
    method: "night",
    range: INITIAL_PRICE_RANGE,
  },
  AttributesSelector: [],
  hotelRating: null,
  guestRating: null,
  accommodationTypes: ["hotel"],
});

export const sortingOptions$ = observable({
  // sets up the state based on sorting criteria defined in the config
  criteria: Object.keys(SORTING_CRITERIA).reduce((criteriaMap, key) => {
    criteriaMap[key] = true; // default to true
    return criteriaMap;
  }, {}),
  isDescending: true,
});
