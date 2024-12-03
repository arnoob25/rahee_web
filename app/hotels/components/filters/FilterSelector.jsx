"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHotelFilters } from "../../hooks/useHotelFilters";
import { observer } from "@legendapp/state/react";
import { useState } from "@/hooks/use-legend-state";
import { appliedFilters$ } from "../../store";
import { FILTER_TYPES } from "../../config";
import { toValidSelector } from "@/lib/string-parsers";

// Centralized setSelectedFilters function that handles conversion logic
const setSelectedFilters = (newSelection) => {
  if (newSelection instanceof Set) {
    appliedFilters$.FilterSelector.set(Array.from(newSelection));
  } else {
    appliedFilters$.FilterSelector.set(newSelection);
  }
};

// TODO selected star rating does not get displayed in the filter display

// TODO: consider renaming FilterSelector - because the name isn't descriptive
export const FilterSelector = observer(function Component() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  // TODO star rating selection doesn't increment the applied filters count
  const selectedFilters = new Set(appliedFilters$.FilterSelector.get());
  const rating = appliedFilters$.hotelRating.get();
  const setRating = appliedFilters$.hotelRating.set;
  const totalFilterCount = selectedFilters.size;

  const filterListRef = useRef(null);

  // TODO revise whether to name the data as categories
  const {
    filters: categories,
    isLoading,
    error,
    selectedFilterNames: filtersToDisplay,
  } = useHotelFilters(selectedFilters);

  const scrollToFilterCategory = (title) => {
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
    setSelectedFilters(selectedFilters);
  };

  const handleRatingChange = (value) => {
    const newRating = rating === value ? null : value;
    setRating(newRating);
    appliedFilters$.rating.set(newRating);
  };

  const handleApplyFilters = () => {
    setIsOpen(false);
  };

  const handleResetFilter = () => {
    setSelectedFilters(new Set());
    setRating(null);
  };

  const handleRemoveFilter = (id) => {
    if (id === "rating") {
      setRating(null);
      appliedFilters$.rating.set(null);
    } else {
      selectedFilters.delete(id);
      setSelectedFilters(selectedFilters);
    }
  };

  // const handleClosePopover = () => {
  //   setIsOpen(false);
  // };

  return (
    <div className="min-w-fit inline-flex gap-1.5 overflow-hidden">
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
                      onClick={() =>
                        scrollToFilterCategory(toValidSelector(category.id))
                      }
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
                <div
                  className="overflow-y-scroll space-y-6 p-4"
                  ref={filterListRef}
                >
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      id={category.id}
                      className="scroll-m-4"
                    >
                      <h3 className="mb-4 text-sm font-semibold">
                        {category.title}
                      </h3>
                      {category.type === FILTER_TYPES.checkbox ? (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {category.options.map((option) => (
                            <div
                              key={option.id}
                              className="flex items-center gap-2"
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
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {category.options.map((i) => (
                            <button
                              key={i}
                              onClick={() => handleRatingChange(i)}
                              className={cn(
                                "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-colors",
                                rating === i && "border-primary bg-primary/10"
                              )}
                            >
                              {i}
                              <Star
                                className={cn(
                                  "h-3.5 w-3.5",
                                  rating === i
                                    ? "fill-primary"
                                    : "fill-muted stroke-muted-foreground"
                                )}
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between w-full border-t bg-background p-4 gap-4">
                  <Button
                    variant="outline"
                    onClick={handleResetFilter}
                    className="px-6"
                  >
                    Reset
                  </Button>
                  <Button onClick={handleApplyFilters} className="px-6">
                    Done
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

function FilterDisplay({ filters, onRemove }) {
  return (
    <>
      {filters.length > 0 && (
        <div className="flex items-center overflow-x-auto px-1 rounded-md border gap-1">
          {filters.map((filter) => (
            <div
              key={filter.id}
              className="flex items-center rounded-full bg-muted px-3 py-1 text-sm whitespace-nowrap"
            >
              {filter.name}
              <button
                onClick={() => onRemove(filter.id)}
                className="ml-2 rounded-full p-1 hover:bg-muted-foreground/20"
                aria-label={`Remove ${filter.name} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default FilterSelector;
