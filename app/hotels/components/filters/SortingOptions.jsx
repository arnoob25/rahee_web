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
import { SORTING_METHODS } from "../../config";

const HotelListSortingOptions = observer(function HotelListSortingOptions() {
  const sortingCriteria = sortingOptions$.criteria.get();

  const toggleSortingMethod = (method) => {
    sortingOptions$.criteria.set((prev) => ({
      ...prev,
      [method]: !prev[method],
    }));
  };

  const activeSortingCriteria = Object.entries(sortingCriteria)
    .filter(([, isActive]) => isActive)
    .map(([method]) => method);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <p className="truncate max-w-[200px]">
            {activeSortingCriteria.length > 0
              ? `Sort by: ${activeSortingCriteria.join(", ")}`
              : "Sort by"}
          </p>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="p-4 min-w-fit w-[var(--radix-popover-trigger-width)]"
      >
        <div className="flex flex-col gap-3">
          {Object.keys(SORTING_METHODS).map((method) => (
            <div key={method} className="flex items-center gap-2">
              <Checkbox
                checked={sortingCriteria[method]}
                onCheckedChange={() => toggleSortingMethod(method)}
                id={`sort-${method}`}
              />
              <label
                htmlFor={`sort-${method}`}
                className="text-sm capitalize truncate max-w-[200px]"
                title={method}
              >
                {SORTING_METHODS[method]}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
});

export default HotelListSortingOptions;
