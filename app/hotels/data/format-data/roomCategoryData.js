const roomCategoryMap = {
  deluxe: {
    id: "deluxe",
    label: "Deluxe Room",
    description: "Spacious room with premium amenities",
    icon: "star",
  },
  economy: {
    id: "economy",
    label: "Economy Room",
    description: "Basic room with essential facilities",
    icon: "wallet",
  },
  standard: {
    id: "standard",
    label: "Standard Room",
    description: "Comfortable room for everyday stays",
    icon: "bed",
  },
  suite: {
    id: "suite",
    label: "Suite",
    description: "Luxury suite with extended living area",
    icon: "crown",
  },
};

export function getRoomCategories() {
  return Object.values(roomCategoryMap);
}

export function getRoomCategoryData(id) {
  return roomCategoryMap[id];
}
