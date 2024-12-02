import React from "react";
import {
  Utensils,
  Dumbbell,
  Wifi,
  Car,
  Waves,
  Users,
  Coffee,
  Bed,
  MapPin,
  Sofa,
} from "lucide-react";
import { DynamicIcon } from "@/app/components/DynamicIcon";

// TODO: move them to an icon config file
const categoryIcons = {
  Recreation: Dumbbell,
  Dining: Utensils,
  Connectivity: Wifi,
  Transportation: Car,
  Wellness: Waves,
  Business: Users,
  "Food & Drink": Coffee,
  "Room Features": Bed,
  Location: MapPin,
  "living Room": Sofa,
};

const mockHotelData = {
  hotelFacilitiesLinks: [
    {
      facility: {
        facilityCategory: {
          categoryId: "1",
          name: "Recreation",
          description: "Recreational facilities",
        },
        facilityId: "1",
        name: "Swimming Pool",
        description: "Outdoor swimming pool with ocean view",
      },
    },
    {
      facility: {
        facilityCategory: {
          categoryId: "2",
          name: "Dining",
          description: "Dining facilities",
        },
        facilityId: "2",
        name: "Restaurant",
        description: "On-site restaurant with local cuisine",
      },
    },
    {
      facility: {
        facilityCategory: {
          categoryId: "3",
          name: "Connectivity",
          description: "Internet facilities",
        },
        facilityId: "3",
        name: "Free Wi-Fi",
        description: "High-speed internet throughout the property",
      },
    },
  ],
};

const FeaturedFacilities = ({ hotelData = mockHotelData }) => (
  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
    <div className="flex w-full whitespace-nowrap overflow-y-scroll scrollbar-hide rounded-md gap-2">
      {hotelData.hotelFacilitiesLinks.map(({ facility }) => {
        return (
          <div key={facility.facilityId} className="flex items-center gap-2">
            <DynamicIcon
              name={facility.facilityCategory.name}
              iconMap={categoryIcons}
            />
            <span>{facility.name}</span>
          </div>
        );
      })}
    </div>
  </div>
);

export default FeaturedFacilities;
