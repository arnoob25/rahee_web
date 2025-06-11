import { matchStringsWithObjects } from "@/lib/string-parsers";
import { FILTER_FIELDS } from "../../config";

export const AMENITY_MAP = {
  wifi: {
    id: "wifi",
    field: FILTER_FIELDS.amenities,
    label: "Free Wifi",
    description: "High-speed internet access",
    icon: "wifi",
  },
  breakfast: {
    id: "breakfast",
    field: FILTER_FIELDS.amenities,
    label: "Breakfast Included",
    description: "Complimentary breakfast buffet",
    icon: "sparkle",
  },
};

export const getAmenities = (amenityIds) =>
  matchStringsWithObjects(amenityIds, AMENITY_MAP);
