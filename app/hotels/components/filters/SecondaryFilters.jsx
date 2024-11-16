"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import useFilters from "../../hooks/useFetchFilters";
import FilterDisplay from "./FilterDisplay";
import { selectedFilters$ } from "../HotelList";
import { observer } from "@legendapp/state/react";

// Centralized setSelectedFilters function that handles conversion logic
// We convert from Set to Array before updating Legend State because currently,
// Legend State doesn't support Sets directly.
const setSelectedFilters = (newSelection) => {
  // If the input is a Set, we store it as an Array for compatibility with Legend State
  // Legend State works with Arrays, so we need to convert Sets to Arrays before setting state.
  if (newSelection instanceof Set) {
    selectedFilters$.set(Array.from(newSelection));
  } else {
    // If it's an Array, we can just directly store it
    selectedFilters$.set(newSelection);
  }
};

export const SecondaryFilters = observer(function Component() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  // Using Set for efficient filter management
  // Using a Set allows us to perform fast lookups and ensures uniqueness of filters.
  // It is more performant for membership checks (e.g., if a filter is selected) compared to using an Array.
  // And the logic is cleaner and more readable too.
  const selectedFilters = new Set(selectedFilters$.get());
  const totalFilterCount = selectedFilters.size;

  const filterListRef = useRef(null);

  const {
    categories,
    isLoading,
    error,
    selectedFilterNames: filtersToDisplay,
  } = useFilters(selectedFilters);

  const scrollToFilterCategory = (title) => {
    // Here, we're using the category title to select the corresponding DOM element,
    // instead of the category ID, because IDs are not valid CSS selectors in all situations.
    // And it is easier to sanitize titles rather than IDs for using here.
    setActiveCategory(title);
    const element = filterListRef.current?.querySelector(
      `#${title.replace(/\s+/g, "-")}`
    );
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleFilterChange = (id) => {
    selectedFilters.has(id)
      ? selectedFilters.delete(id)
      : selectedFilters.add(id);
    setSelectedFilters(selectedFilters); // the set is converted back into an array
  };

  const handleApplyFilters = () => {
    setIsOpen(false);
  };

  const handleResetFilter = () => {
    setSelectedFilters(new Set());
  };

  const handleRemoveFilter = (id) => {
    selectedFilters.delete(id);
    setSelectedFilters(selectedFilters);
  };

  return (
    <div className="flex gap-1.5">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {totalFilterCount > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {totalFilterCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[90vw] max-w-3xl p-0"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {isLoading ? (
            <div>Loading filters</div>
          ) : error ? (
            <div>Error loading filters</div>
          ) : (
            <div className="flex h-[70vh] overflow-hidden">
              <div
                className={cn(
                  "w-48 flex-shrink-0 border-r bg-muted/50 transition-all duration-300 ease-in-out overflow-hidden",
                  "hidden md:block",
                  "h-full py-4"
                )}
              >
                <div className="space-y-1 px-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => scrollToFilterCategory(category.title)}
                      className={cn(
                        "w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
                        activeCategory === category.title &&
                          "bg-accent font-medium"
                      )}
                    >
                      {category.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col">
                <ScrollArea className="flex-grow" ref={filterListRef}>
                  <div className="space-y-6 p-4">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        id={category.title}
                        className="scroll-m-4"
                      >
                        <h3 className="mb-4 text-sm font-semibold">
                          {category.title}
                        </h3>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {category.options.map((option) => (
                            <div
                              key={option.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={option.id}
                                checked={selectedFilters.has(option.id)}
                                onCheckedChange={() =>
                                  handleFilterChange(option.id)
                                }
                              />
                              <label
                                htmlFor={option.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {option.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex items-center justify-between border-t bg-background p-4">
                  <Button
                    variant="outline"
                    onClick={handleResetFilter}
                    className="px-6"
                  >
                    Reset
                  </Button>
                  <Button onClick={handleApplyFilters} className="px-6">
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>

      <FilterDisplay filters={filtersToDisplay} onRemove={handleRemoveFilter} />
    </div>
  );
});

export default SecondaryFilters;
