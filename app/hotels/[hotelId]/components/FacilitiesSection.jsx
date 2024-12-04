"use client";

import { DynamicIcon } from "@/app/components/DynamicIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FACILITY_CATEGORY_DEFAULT_ICON,
  FACILITY_DEFAULT_ICON,
} from "@/config/icons-map";

/* 
Groups facilities by their category and returns an array of categories with their related facilities.
Each category contains a list of facilities associated with it.
*/
function categorizeFacilities(facilities) {
  /* 
  Input: [
    {
      facility: {
        facilityCategory: {
          categoryId: <categoryId>,
          name: <categoryName>,
          description: <categoryDescription>
        },
        facilityId: <facilityId>,
        name: <facilityName>,
        description: <facilityDescription>
      }
    }
  ]
  
  Output: [
    {
      categoryId: <categoryId>,
      categoryName: <categoryName>,
      facilities: [
        {
          id: <facilityId>,
          name: <facilityName>,
          description: <facilityDescription>
        },
        ...
      ]
    },
    ...
  ]
  */

  // Destructured to directly access the "facility" property, which contains the relevant data
  return facilities.reduce((categorizedFacilities, { facility }) => {
    const { categoryId, name: categoryName } = facility.facilityCategory;

    let category = categorizedFacilities.find(
      (cat) => cat.categoryId === categoryId
    );

    if (!category) {
      category = {
        categoryId: categoryId, // convention for id properties. i.e. hotel.hotelId
        name: categoryName,
        facilities: [],
      };
      categorizedFacilities.push(category);
    }

    category.facilities.push({
      facilityId: facility.facilityId, // convention for id properties. i.e. hotel.hotelId
      name: facility.name,
      description: facility.description,
    });

    return categorizedFacilities;
  }, []);
}

export function Facilities({ facilities }) {
  const categorizedFacilities = categorizeFacilities(facilities);

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
      {categorizedFacilities.map(({ categoryId, name, facilities }) => (
        <CategorizedFacilitiesCard
          key={categoryId}
          categoryName={name}
          facilities={facilities}
        />
      ))}
    </div>
  );
}

function CategorizedFacilitiesCard({ categoryName, facilities }) {
  return (
    <Card className="w-full min-w-64 max-w-80">
      <CardHeader className="flex flex-row justify-center items-center gap-2">
        <DynamicIcon
          name={categoryName}
          FallbackIcon={FACILITY_CATEGORY_DEFAULT_ICON}
          className="h-5 w-5"
        />
        <CardTitle className="text-lg font-semibold pb-1">
          {categoryName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {facilities.map(({ facilityId, name }) => (
            <li key={facilityId} className="flex items-center space-x-3">
              <DynamicIcon
                name={name}
                FallbackIcon={FACILITY_DEFAULT_ICON}
                className="h-4 w-4 text-muted-foreground flex-shrink-0"
              />
              <span className="text-sm">{name}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
