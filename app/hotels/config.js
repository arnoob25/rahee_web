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
  reviewScore: "Guest Rating",
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
  { min: 8.5, max: 10, label: "Excellent" },
  { min: 8.0, max: 8.5, label: "Very good" },
  { min: 7.5, max: 8.0, label: "Good" },
  { min: 6.0, max: 7.5, label: "Fair" },
  { min: 0, max: 6.0, label: "Poor" },
];
