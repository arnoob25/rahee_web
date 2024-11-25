"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pool, Utensils, Wifi } from "lucide-react";

const facilityIcons = {
  "Swimming Pool": Pool,
  Restaurant: Utensils,
  WiFi: Wifi,
};

export function FacilitiesSection({ facilities }) {
  const groupedFacilities = facilities.reduce((acc, { facility }) => {
    const category = facility.facilityCategory.name;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(facility);
    return acc;
  }, {});

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {Object.entries(groupedFacilities).map(([category, facilities]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-4">
              {facilities.map((facility) => {
                const Icon = facilityIcons[facility.name] || Utensils;
                return (
                  <li
                    key={facility.facilityId}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span>{facility.name}</span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
