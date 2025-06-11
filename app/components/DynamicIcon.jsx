"use client";

import { ADDITIONAL_ICONS } from "@/config/icons-map";
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
  Sparkle,
  Bed,
} from "lucide-react";

const defaultIconMap = {
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
  bed: Bed,
};

export const DynamicIcon = ({
  name = "",
  className = "h-4 w-4",
  FallbackIcon = Sparkle,
}) => {
  const lowercaseName = name.toLowerCase();

  // Convert into iterable
  const allIcons = Object.entries({
    // Merge the provided icons with the default iconMap
    ...defaultIconMap,
    ...ADDITIONAL_ICONS,
  });

  // Find the corresponding icon
  const IconComponent = allIcons.find(([key]) =>
    lowercaseName.includes(key.toLowerCase())
  )?.[1];

  return IconComponent ? (
    <IconComponent className={className} />
  ) : (
    <FallbackIcon className={className} />
  );
};
