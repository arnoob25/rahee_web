import { matchStringsWithObjects } from "../../utils";

const amenityMap = {
  wifi: {
    label: "Free Wifi",
    description: "High-speed internet access",
    icon: "wifi",
  },
  breakfast: {
    label: "Breakfast Included",
    description: "Complimentary breakfast buffet",
    icon: "sparkle",
  },
};

export const getAmenities = (amenityIds) =>
  matchStringsWithObjects(amenityIds, amenityMap);
