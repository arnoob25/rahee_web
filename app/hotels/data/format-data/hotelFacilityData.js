import { matchStringsWithObjects } from "@/lib/string-parsers";
import { FILTER_FIELDS } from "../../config";

export const FACILITY_TYPE_MAP = {
  recreation: {
    id: "recreation",
    label: "Recreation",
    description: "Recreational facilities",
    icon: "activity",
    field: FILTER_FIELDS.facilities,
  },

  childcare: {
    id: "childcare",
    label: "Childcare",
    description: "Childcare and kids' facilities",
    icon: "child",
    field: FILTER_FIELDS.facilities,
  },

  business: {
    id: "business",
    label: "Business",
    description: "Facilities for business travelers",
    icon: "briefcase",
    field: FILTER_FIELDS.facilities,
  },

  accessibility: {
    id: "accessibility",
    label: "Accessibility",
    description: "Accessibility features for guests",
    icon: "accessibility",
    field: FILTER_FIELDS.facilities,
  },

  entertainment: {
    id: "entertainment",
    label: "Entertainment",
    description: "Entertainment options for guests",
    icon: "film",
    field: FILTER_FIELDS.facilities,
  },
};

export const FACILITY_MAP = {
  // Recreation
  pool: {
    id: "pool",
    label: "Swimming Pool",
    description: "Outdoor swimming pool with ocean view",
    icon: "water",
    field: FILTER_FIELDS.facilities,
    category: "recreation",
  },
  tennis: {
    id: "tennis",
    label: "Tennis Court",
    description: "Outdoor tennis court with floodlights",
    icon: "tennis-ball",
    field: FILTER_FIELDS.facilities,
    category: "recreation",
  },
  yoga: {
    id: "yoga",
    label: "Yoga Studio",
    description: "Fully equipped yoga and wellness studio",
    icon: "yoga-mat",
    field: FILTER_FIELDS.facilities,
    category: "recreation",
  },
  golf: {
    id: "golf",
    label: "Golf Course",
    description: "18-hole golf course with scenic views",
    icon: "golf-club",
    field: FILTER_FIELDS.facilities,
    category: "recreation",
  },

  // Childcare
  kids_club: {
    id: "kids_club",
    label: "Kids Club",
    description: "Fun activities for children aged 3-12",
    icon: "children",
    field: FILTER_FIELDS.facilities,
    category: "childcare",
  },
  babysitting: {
    id: "babysitting",
    label: "Babysitting Service",
    description: "Qualified babysitters available on request",
    icon: "baby",
    field: FILTER_FIELDS.facilities,
    category: "childcare",
  },
  art_studio: {
    id: "art_studio",
    label: "Art and Craft Studio",
    description: "Creative space for kids' art projects",
    icon: "paintbrush",
    field: FILTER_FIELDS.facilities,
    category: "childcare",
  },
  playground: {
    id: "playground",
    label: "Indoor Playground",
    description: "Safe and engaging indoor play area",
    icon: "slide",
    field: FILTER_FIELDS.facilities,
    category: "childcare",
  },

  // Business
  networking: {
    id: "networking",
    label: "Networking Lounge",
    description: "Exclusive lounge for business networking",
    icon: "people-network",
    field: FILTER_FIELDS.facilities,
    category: "business",
  },
  office: {
    id: "office",
    label: "Virtual Office Suite",
    description: "Private office spaces with high-speed internet",
    icon: "office-building",
    field: FILTER_FIELDS.facilities,
    category: "business",
  },
  collaboration: {
    id: "collaboration",
    label: "Digital Collaboration Wall",
    description: "Interactive digital wall for team collaboration",
    icon: "team",
    field: FILTER_FIELDS.facilities,
    category: "business",
  },

  // Accessibility
  wheelchair: {
    id: "wheelchair",
    label: "Wheelchair Accessible",
    description: "Accessible rooms and pathways",
    icon: "accessibility",
    field: FILTER_FIELDS.facilities,
    category: "accessibility",
  },
  visual_alert: {
    id: "visual_alert",
    label: "Visual Alert System",
    description: "Safety features for hearing-impaired guests",
    icon: "bell",
    field: FILTER_FIELDS.facilities,
    category: "accessibility",
  },

  // Entertainment
  gaming: {
    id: "gaming",
    label: "Gaming Lounge",
    description: "Video games and recreational gaming setup",
    icon: "gamepad",
    field: FILTER_FIELDS.facilities,
    category: "entertainment",
  },
  live_music: {
    id: "live_music",
    label: "Live Music",
    description: "Evening live music performances",
    icon: "music-note",
    field: FILTER_FIELDS.facilities,
    category: "entertainment",
  },
  cinema: {
    id: "cinema",
    label: "Movie Screening Room",
    description: "Private cinema with curated movie options",
    icon: "movie",
    field: FILTER_FIELDS.facilities,
    category: "entertainment",
  },
  escape_room: {
    id: "escape_room",
    label: "Escape Room",
    description: "Immersive puzzle-solving experience",
    icon: "puzzle",
    field: FILTER_FIELDS.facilities,
    category: "entertainment",
  },
};

export function getFacilityCategory(id) {
  return FACILITY_TYPE_MAP[id];
}

export const getFacilities = (facilityIds) =>
  matchStringsWithObjects(facilityIds, FACILITY_MAP);

export const groupFacilitiesByCategory = (facilityIds) => {
  const facilities = getFacilities(facilityIds);

  const groupedFacilities = {};

  facilities.forEach((facility) => {
    const { category } = facility;

    // create new category if that doesn't exist already
    if (!groupedFacilities[category]) {
      const categoryData = getFacilityCategory(category);
      groupedFacilities[category] = {
        ...categoryData,
        facilities: [],
      };
    }

    // add facility to the category
    groupedFacilities[category].facilities.push(facility);
  });

  return Object.values(groupedFacilities);
};
