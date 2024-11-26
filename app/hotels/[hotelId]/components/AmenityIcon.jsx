"use client";

import {
  Wifi,
  Coffee,
  ParkingMeterIcon as Parking,
  Tv,
  ShowerHeadIcon as SwimmingPool,
  AirVentIcon as AirConditioning,
  MenuIcon as Restaurant,
  Dumbbell,
  SpadeIcon as Spa,
  BusIcon as Business,
  BedDouble,
  Sparkle,
} from "lucide-react";

const iconMap = {
  wifi: Wifi,
  breakfast: Coffee,
  parking: Parking,
  tv: Tv,
  pool: SwimmingPool,
  "air conditioning": AirConditioning,
  restaurant: Restaurant,
  gym: Dumbbell,
  spa: Spa,
  "business center": Business,
  bed: BedDouble,
};

export const AmenityIcon = ({ name, className = "h-4 w-4" }) => {
  const lowercaseName = name.toLowerCase();

  // Match the amenity name with an icon from the map
  for (const [key, IconComponent] of Object.entries(iconMap)) {
    if (lowercaseName.includes(key)) {
      return <IconComponent className={className} />;
    }
  }

  // Return a default icon if no match is found
  return <Sparkle className={className} />;
};
