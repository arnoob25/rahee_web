"use client";

import { observer } from "@legendapp/state/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { sortingOptions$ } from "../../store";
import { SORTING_CRITERIA } from "../../config";

const HotelListSortingOptions = observer(function HotelListSortingOptions() {
  const sortingCriteria = sortingOptions$.criteria.get();

  const activeSortingCriteria = Object.entries(sortingCriteria)
    .filter(([, isActive]) => isActive)
    .map(([criteria]) => criteria);

  const activeSortingCriteriaNames = activeSortingCriteria
    .map((criteria) => SORTING_CRITERIA[criteria] || null)
    .filter(Boolean)
    .join(", ");

  const toggleSortingCriteria = (criteria) => {
    sortingOptions$.criteria.set((prev) => ({
      ...prev,
      [criteria]: !prev[criteria],
    }));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <p className="truncate max-w-[200px]">
            {activeSortingCriteria.length > 0
              ? `Sort by: ${activeSortingCriteriaNames}`
              : "Sort by"}
          </p>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="p-4 min-w-fit w-[var(--radix-popover-trigger-width)]"
      >
        <div className="flex flex-col gap-3">
          {Object.keys(SORTING_CRITERIA).map((criteria) => (
            <div key={criteria} className="flex items-center gap-2">
              <Checkbox
                checked={sortingCriteria[criteria]}
                onCheckedChange={() => toggleSortingCriteria(criteria)}
                id={`sort-${criteria}`}
              />
              <label
                htmlFor={`sort-${criteria}`}
                className="text-sm capitalize truncate max-w-[200px]"
                title={criteria}
              >
                {SORTING_CRITERIA[criteria]}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
});

export default HotelListSortingOptions;
