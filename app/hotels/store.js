import { observable } from "@legendapp/state";
import { INITIAL_PRICE_RANGE } from "./config";

export const appliedFilters$ = observable({
  hotelPricing: {
    method: "night",
    range: INITIAL_PRICE_RANGE,
  },
  FilterSelector: [],
  hotelRating: null,
  guestRating: null,
  accommodationTypes: ["hotel"],
});

export const sortingOptions$ = observable({
  criteria: {
    reviewScore: true,
    price: true,
  },
  isDescending: true,
});
