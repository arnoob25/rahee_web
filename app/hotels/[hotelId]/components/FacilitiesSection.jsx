"use client";

import { DynamicIcon } from "@/app/components/DynamicIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FACILITY_DEFAULT_ICON } from "@/config/icons-map";
import { Sofa } from "lucide-react";

// Groups facilities by their categories
function useGroupedFacilities(facilities) {
  return facilities.reduce((groupedFacilities, { facility }) => {
    const categoryName = facility.facilityCategory.name;

    if (!groupedFacilities[categoryName]) {
      groupedFacilities[categoryName] = [];
    }
    groupedFacilities[categoryName].push(facility);

    return Object.entries(groupedFacilities);
  }, {});
}

// Displays cards for each category, each containing respective facilities
export function FacilitiesSection({ facilities }) {
  const groupedFacilities = useGroupedFacilities(facilities);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {groupedFacilities.map(([categoryName, facilitiesList]) => (
        <FacilityCategory
          key={categoryName}
          categoryName={categoryName}
          facilitiesList={facilitiesList}
        />
      ))}
    </div>
  );
}

function FacilityCategory({ categoryName, facilitiesList }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{categoryName}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-4">
          {facilitiesList.map((facility) => (
            <FacilityItem key={facility.facilityId} facility={facility} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

const map = { "living room": Sofa };

function FacilityItem({ facility }) {
  return (
    <li className="flex items-center gap-2">
      <DynamicIcon
        name={facility.name}
        FallbackIcon={FACILITY_DEFAULT_ICON}
        className="h-4 w-4 text-muted-foreground"
      />
      <span>{facility.name}</span>
    </li>
  );
}
