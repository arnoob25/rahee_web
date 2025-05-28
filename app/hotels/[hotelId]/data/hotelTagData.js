import { matchStringsWithObjects } from "@/lib/string-parsers";
import { FILTER_FIELDS } from "../../config";

export const TAGS_MAP = {
  beach: {
    id: "beach",
    label: "Beachfront",
    description: "Located directly on the beach",
    field: FILTER_FIELDS.tags,
    icon: "beach",
  },
  luxury: {
    id: "luxury",
    label: "Luxury",
    description: "Offers premium services and amenities",
    field: FILTER_FIELDS.tags,
    icon: "sparkle",
  },
  family: {
    id: "family",
    label: "Family Friendly",
    description: "Great for families with children",
    field: FILTER_FIELDS.tags,
    icon: "kids",
  },
  budget: {
    id: "budget",
    label: "Budget Friendly",
    description: "Save your precious wealth.",
    field: FILTER_FIELDS.tags,
    icon: "money",
  },
};

export const getTags = (tagIds) => matchStringsWithObjects(tagIds, TAGS_MAP);
