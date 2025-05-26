export const FILTER_TYPES = {
  checkbox: "checkbox",
  selection: "selection",
};

export const FILTER_FIELDS = {
  amenities: "amenities",
  facilities: "facilities",
  tags: "tags",
  policies: "policies",
};

export const INITIAL_PRICE_RANGE = { minPrice: 30, maxPrice: 200 };

export const PRICE_CALCULATION_METHODS = {
  night: "night",
  totalStay: "total",
};

export const ACCOMMODATION_OPTIONS = [
  {
    id: "hotels",
    label: "Hotels",
    children: [
      { id: "hotel", label: "Hotel" },
      { id: "resort", label: "Resort" },
      { id: "serviced-apartment", label: "Serviced apartment" },
    ],
  },
  {
    id: "houses-apartments",
    label: "Houses / Apartments",
    children: [
      { id: "entire-house", label: "Entire House / Apartment" },
      { id: "casa-rural", label: "Casa rural" },
    ],
  },
  {
    id: "budget-stays",
    label: "Budget stays",
    children: [
      { id: "bed-breakfast", label: "Bed & Breakfast" },
      { id: "guesthouse", label: "Guesthouse" },
      { id: "hostel", label: "Hostel" },
      { id: "motel", label: "Motel" },
    ],
  },
];

export const GUEST_REVIEW_LABELS = [
  { min: 9.1, max: 10, label: "Excellent" },
  { min: 8.1, max: 9.0, label: "Very good" },
  { min: 5.5, max: 8.0, label: "Good" },
  { min: 3.0, max: 5.4, label: "Fair" },
  { min: 0, max: 2.9, label: "Poor" },
];

export const HOTEL_RATING_FILTERS = [
  { value: "8.5", label: "Excellent" },
  { value: "8.0", label: "Very good" },
  { value: "7.5", label: "Good" },
  { value: "7.0", label: "Fair" },
];

export const REVIEW_SCORE_SUMMARY_LABELS = {
  10: "Exceptional",
  9: "Great Experience",
  8: "Very Good Stay",
  7: "Good but Could Be Better",
  6: "Decent Stay",
  5: "Average Experience",
  4: "Disappointing",
  3: "Would Not Recommend",
  2: "Would Not Recommend",
  1: "Terrible Experience",
  0: "Terrible Experience",
};

export const REVIEW_CATEGORIES = [
  { name: "Cleanliness", score: 9.6 },
  { name: "Staff & service", score: 9.4 },
  { name: "Amenities", score: 9.4 },
  { name: "Property conditions & facilities", score: 9.4 },
  { name: "Eco-friendliness", score: 9.0 },
];

export const SORTING_CRITERIA = {
  price: {
    label: "Price",
    ascendingLabel: "Lowest Price",
    descendingLabel: "Highest Price",
  },
  popularity: {
    label: "Popularity",
    ascendingLabel: "Least Popular",
    descendingLabel: "Most Popular",
  },
};

export const SORT_ORDERS = {
  ASC: "asc",
  DSC: "dsc",
};

export const MIN_ADULT_GUEST_FOR_ROOM = 1;
export const MIN_CHILD_GUEST_FOR_ROOM = 0;
export const DEFAULT_ROOM_GUEST_CONFIG = [
  {
    id: 1,
    adults: MIN_ADULT_GUEST_FOR_ROOM,
    children: MIN_CHILD_GUEST_FOR_ROOM,
  },
];
