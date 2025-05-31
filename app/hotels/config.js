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

export const MIN_PRICE = 10;
export const MAX_PRICE = 1_00_000;
export const INITIAL_PRICE_RANGE = { minPrice: 30, maxPrice: 200 };

export const PRICE_CALCULATION_METHODS = {
  night: "night",
  totalStay: "total",
};

export const ACCOMMODATION_OPTIONS = [
  {
    id: "hotel",
    label: "Hotel",
    children: [
      { id: "resort", label: "Resort" },
      { id: "motel", label: "Motel" },
    ],
  },
  {
    id: "budget",
    label: "Budget",
    children: [
      { id: "bed_and_breakfast", label: "Bed and Breakfast" },
      { id: "guesthouse", label: "Guesthouse" },
      { id: "hostel", label: "Hostel" },
    ],
  },
  {
    id: "rentals",
    label: "Rentals",
    children: [
      { id: "villa", label: "Villa" },
      { id: "serviced_apartment", label: "Serviced Apartment" },
    ],
  },
];

export const GUEST_TYPES = {
  adult: "adult",
  child: "child",
};

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
  { value: "4.0", label: "Fair" },
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
export const MAX_ALLOWED_GUESTS_FOR_ROOM = 10;
export const DEFAULT_ROOM_GUEST_CONFIG = [
  {
    id: 1,
    adults: MIN_ADULT_GUEST_FOR_ROOM,
    children: MIN_CHILD_GUEST_FOR_ROOM,
  },
];

export const DEFAULT_STAY_DURATION = 2; // days

const checkInDate = new Date();
const checkOutDate = new Date(checkInDate); // clone the check-in date
checkOutDate.setDate(checkOutDate.getDate() + DEFAULT_STAY_DURATION);

export const INITIAL_CHECK_IN_DATE = checkInDate.toISOString();
export const INITIAL_CHECK_OUT_DATE = checkOutDate.toISOString();

export const DEFAULT_DATE_RANGE = {
  from: INITIAL_CHECK_IN_DATE,
  to: INITIAL_CHECK_OUT_DATE,
};

export const LOCATION_TYPES = {
  CITY: "city",
  LOCATION: "location",
};

export const FALLBACK_LOCATIONS = [
  {
    city: "dhaka",
    name: "Dhaka",
    type: LOCATION_TYPES.CITY,
    country: "Bangladesh",
  },
  {
    city: "chittagong",
    name: "Chittagong",
    type: LOCATION_TYPES.CITY,
    country: "Bangladesh",
  },
  {
    city: "sylhet",
    name: "Sylhet",
    type: LOCATION_TYPES.CITY,
    country: "Bangladesh",
  },
  {
    city: "rajshahi",
    name: "Rajshahi",
    type: LOCATION_TYPES.CITY,
    country: "Bangladesh",
  },
  {
    city: "khulna",
    name: "Khulna",
    type: LOCATION_TYPES.CITY,
    country: "Bangladesh",
  },
  {
    city: "barisal",
    name: "Barisal",
    type: LOCATION_TYPES.CITY,
    country: "Bangladesh",
  },
];
