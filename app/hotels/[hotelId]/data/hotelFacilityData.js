import { matchStringsWithObjects } from "../../utils";

const facilityCategoriesMap = {
  recreation: {
    id: "recreation",
    label: "Recreation",
    description: "Recreational facilities",
    icon: "activity",
  },
  childcare: {
    id: "childcare",
    label: "Childcare",
    description: "Childcare and kids' facilities",
    icon: "child",
  },
  business: {
    id: "business",
    label: "Business",
    description: "Facilities for business travelers",
    icon: "briefcase",
  },
  accessibility: {
    id: "accessibility",
    label: "Accessibility",
    description: "Accessibility features for guests",
    icon: "accessibility",
  },
  entertainment: {
    id: "entertainment",
    label: "Entertainment",
    description: "Entertainment options for guests",
    icon: "film",
  },
};

const facilitiesMap = {
  // Recreation
  pool: {
    id: "pool",
    label: "Swimming Pool",
    description: "Outdoor swimming pool with ocean view",
    icon: "water",
    category: "recreation",
  },
  tennis: {
    id: "tennis",
    label: "Tennis Court",
    description: "Outdoor tennis court with floodlights",
    icon: "tennis-ball",
    category: "recreation",
  },
  yoga: {
    id: "yoga",
    label: "Yoga Studio",
    description: "Fully equipped yoga and wellness studio",
    icon: "yoga-mat",
    category: "recreation",
  },
  golf: {
    id: "golf",
    label: "Golf Course",
    description: "18-hole golf course with scenic views",
    icon: "golf-club",
    category: "recreation",
  },

  // Childcare
  kids_club: {
    id: "kids_club",
    label: "Kids Club",
    description: "Fun activities for children aged 3-12",
    icon: "children",
    category: "childcare",
  },
  babysitting: {
    id: "babysitting",
    label: "Babysitting Service",
    description: "Qualified babysitters available on request",
    icon: "baby",
    category: "childcare",
  },
  art_studio: {
    id: "art_studio",
    label: "Art and Craft Studio",
    description: "Creative space for kids' art projects",
    icon: "paintbrush",
    category: "childcare",
  },
  playground: {
    id: "playground",
    label: "Indoor Playground",
    description: "Safe and engaging indoor play area",
    icon: "slide",
    category: "childcare",
  },

  // Business
  networking: {
    id: "networking",
    label: "Networking Lounge",
    description: "Exclusive lounge for business networking",
    icon: "people-network",
    category: "business",
  },
  office: {
    id: "office",
    label: "Virtual Office Suite",
    description: "Private office spaces with high-speed internet",
    icon: "office-building",
    category: "business",
  },
  collaboration: {
    id: "collaboration",
    label: "Digital Collaboration Wall",
    description: "Interactive digital wall for team collaboration",
    icon: "team",
    category: "business",
  },

  // Accessibility
  wheelchair: {
    id: "wheelchair",
    label: "Wheelchair Accessible",
    description: "Accessible rooms and pathways",
    icon: "accessibility",
    category: "accessibility",
  },
  visual_alert: {
    id: "visual_alert",
    label: "Visual Alert System",
    description: "Safety features for hearing-impaired guests",
    icon: "bell",
    category: "accessibility",
  },

  // Entertainment
  gaming: {
    id: "gaming",
    label: "Gaming Lounge",
    description: "Video games and recreational gaming setup",
    icon: "gamepad",
    category: "entertainment",
  },
  live_music: {
    id: "live_music",
    label: "Live Music",
    description: "Evening live music performances",
    icon: "music-note",
    category: "entertainment",
  },
  cinema: {
    id: "cinema",
    label: "Movie Screening Room",
    description: "Private cinema with curated movie options",
    icon: "movie",
    category: "entertainment",
  },
  escape_room: {
    id: "escape_room",
    label: "Escape Room",
    description: "Immersive puzzle-solving experience",
    icon: "puzzle",
    category: "entertainment",
  },
};

export function getFacilityCategory(id) {
  return facilityCategoriesMap[id];
}

export const getFacilities = (facilityIds) =>
  matchStringsWithObjects(facilityIds, facilitiesMap);

export const groupFacilitiesByCategory = (facilityIds) => {
  const facilities = getFacilities(facilityIds);

  const groupedFacilities = {};

  facilities.forEach((facility) => {
    const { category, id, label, description } = facility;

    // create new category if that doesn't exist already
    if (!groupedFacilities[category]) {
      const categoryData = getFacilityCategory(category);
      groupedFacilities[category] = {
        ...categoryData,
        facilities: [],
      };
    }

    // add facility to the category
    groupedFacilities[category].facilities.push({
      id,
      name: label,
      description,
    });
  });

  return Object.values(groupedFacilities);
};
