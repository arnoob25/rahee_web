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
  smart_tv: {
    id: "smart_tv",
    field: FILTER_FIELDS.amenities,
    label: "Smart TV",
    description: "In-room entertainment with streaming apps",
    icon: "tv",
  },
  workspace: {
    id: "workspace",
    field: FILTER_FIELDS.amenities,
    label: "Dedicated Workspace",
    description: "Desk and chair suitable for remote work",
    icon: "laptop",
  },
  jacuzzi: {
    id: "jacuzzi",
    field: FILTER_FIELDS.amenities,
    label: "Private Jacuzzi",
    description: "Relax in your in-room hot tub",
    icon: "bathtub",
  },
  game_console: {
    id: "game_console",
    field: FILTER_FIELDS.amenities,
    label: "Game Console",
    description: "In-room PlayStation or Xbox on request",
    icon: "gamepad",
  },
  kids_bunk_bed: {
    id: "kids_bunk_bed",
    field: FILTER_FIELDS.amenities,
    label: "Bunk Beds for Kids",
    description: "Child-friendly sleeping arrangements",
    icon: "bed",
  },
  in_room_safe: {
    id: "in_room_safe",
    field: FILTER_FIELDS.amenities,
    label: "In-Room Safe",
    description: "Secure storage for valuables",
    icon: "lock",
  },
};

export const getAmenities = (amenityIds) =>
  matchStringsWithObjects(amenityIds, AMENITY_MAP);
