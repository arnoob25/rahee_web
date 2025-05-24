"use client";

import { FILTER_TYPES } from "../config";
import { TAGS_MAP } from "../[hotelId]/data/hotelTagData";
import { AMENITY_MAP } from "../[hotelId]/data/roomAmenityData";
import {
  FACILITY_MAP,
  groupFacilitiesByCategory,
} from "../[hotelId]/data/hotelFacilityData";

export function useHotelFilters() {
  const allFacilityIds = Object.keys(FACILITY_MAP);
  const groupedFacilities = groupFacilitiesByCategory(allFacilityIds);

  const facilityFilters = groupedFacilities.map(({ id, label, facilities }) => {
    return {
      type: FILTER_TYPES.checkbox,
      id,
      label,
      options: facilities,
    };
  });

  const filters = [
    {
      type: FILTER_TYPES.checkbox,
      id: "tags",
      label: "Tags",
      options: Object.values(TAGS_MAP),
    },
    {
      type: FILTER_TYPES.selection,
      id: "rating",
      label: "Hotel Rating",
      options: [1, 2, 3, 4, 5],
    },
    ...facilityFilters,
    {
      type: FILTER_TYPES.checkbox,
      id: "amenity",
      label: "Amenities",
      options: Object.values(AMENITY_MAP),
    },
  ];

  return filters;
}

export function useGetAllFilters() {
  return output;
}
