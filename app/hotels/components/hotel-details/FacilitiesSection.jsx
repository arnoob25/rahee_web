"use client";

import { DynamicIcon } from "@/app/components/DynamicIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FACILITY_CATEGORY_DEFAULT_ICON,
  FACILITY_DEFAULT_ICON,
} from "@/config/icons-map";
import { groupFacilitiesByCategory } from "../../data/format-data/hotelFacilityData";
import { cn } from "@/lib/utils";

export function Facilities({ facilities, id, className }) {
  const categorizedFacilities = groupFacilitiesByCategory(facilities);

  return (
    <section
      id={id}
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3  [&>*]:break-inside-avoid-column",
        className
      )}
    >
      {categorizedFacilities.map(({ id, label, facilities }) => (
        <CategorizedFacilitiesCard
          key={id}
          categoryName={label}
          facilities={facilities}
        />
      ))}
    </section>
  );
}

function CategorizedFacilitiesCard({ categoryName, facilities }) {
  return (
    <Card className="w-full min-w-60">
      <CardHeader className="flex flex-row items-center justify-center gap-2 p-3 pt-4">
        <DynamicIcon
          name={categoryName}
          FallbackIcon={FACILITY_CATEGORY_DEFAULT_ICON}
          className="w-5 h-5"
        />
        <CardTitle className="pb-3 text-lg font-semibold">
          {categoryName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {facilities.map(({ id, icon, label }) => (
            <li key={id} className="flex items-center space-x-3">
              <DynamicIcon
                name={icon}
                FallbackIcon={FACILITY_DEFAULT_ICON}
                className="flex-shrink-0 w-4 h-4 text-muted-foreground"
              />
              <span className="text-sm">{label}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
