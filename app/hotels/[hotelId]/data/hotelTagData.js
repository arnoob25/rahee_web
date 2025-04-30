import { matchStringsWithObjects } from "../../utils";

const tagsMap = {
  beach: {
    label: "Beachfront",
    description: "Located directly on the beach",
    icon: "beach",
  },
  luxury: {
    label: "Luxury",
    description: "Offers premium services and amenities",
    icon: "sparkle",
  },
  family: {
    label: "Family Friendly",
    description: "Great for families with children",
    icon: "kids",
  },
  budget: {
    label: "Budget Friendly",
    description: "Save your precious wealth.",
    icon: "money",
  },
};

export const getTags = (tagIds) => matchStringsWithObjects(tagIds, tagsMap);
