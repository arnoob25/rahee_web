export const FILTER_TYPES = {
  checkbox: "checkbox",
  selection: "selection",
};

export const INITIAL_PRICE_RANGE = [0, 200];

export const PRICE_CALCULATION_METHODS = {
  night: "night",
  totalStay: "total",
};

export const SORTING_CRITERIA = {
  reviewScore: "Guest rating",
  price: "Price",
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
