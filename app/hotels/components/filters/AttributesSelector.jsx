"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { FILTER_FIELDS, FILTER_TYPES } from "../../config";
import { toValidSelector } from "@/lib/string-parsers";
import { useScrollToElement } from "@/hooks/use-scroll";
import {
  useGetCategorizedHotelAttributes,
  useHotelFilterStore,
} from "../../data/hotelFilters";

export default function AttributesSelector({ onApply }) {
  const filters = useGetCategorizedHotelAttributes();
  const { getAttributeFilterCount } = useHotelFilterStore();

  // manage modal, and sidebar
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="min-w-fit inline-flex gap-1.5 overflow-hidden">
      <Popover
        open={isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) onApply(); // refetch hotels when closed
          setIsOpen(isOpen);
        }}
      >
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Attributes
            {getAttributeFilterCount() > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {getAttributeFilterCount()}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[90vw] max-w-3xl p-0"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex h-[70vh] overflow-hidden">
            <FilterCategorySidebar
              categories={filters}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
            <div className="flex flex-col flex-1 overflow-hidden">
              <FilterSection categories={filters} />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function FilterCategorySidebar({
  categories,
  activeCategory,
  setActiveCategory,
}) {
  const scrollToFilterCategory = useScrollToElement();

  function handleCategorySelection(categoryId) {
    const validSelector = toValidSelector(categoryId);
    scrollToFilterCategory(validSelector, 10, false);
    setActiveCategory(categoryId);
  }

  return (
    <div
      className={cn(
        "w-48 flex-shrink-0 border-r bg-muted/50 transition-all duration-300 ease-in-out overflow-hidden",
        "hidden md:block",
        "h-full py-4"
      )}
    >
      <div className="px-2 space-y-1">
        {categories.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => handleCategorySelection(id)}
            className={cn(
              "w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
              activeCategory === id && "bg-accent font-medium"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterSection({ categories }) {
  const filterListRef = useRef(null);

  const {
    selectedTags,
    selectedFacilities,
    selectedAmenities,
    selectedStars,
    setTag,
    setFacility,
    setAmenity,
    setStars,
  } = useHotelFilterStore();

  const selectedFilters = new Set([
    ...selectedTags,
    ...selectedFacilities,
    ...selectedAmenities,
  ]);

  const handleFilterChange = (field, id) => {
    switch (field) {
      case FILTER_FIELDS.tags:
        setTag(id);
        break;

      case FILTER_FIELDS.facilities:
        setFacility(id);
        break;

      case FILTER_FIELDS.amenities:
        setAmenity(id);
        break;

      default:
        break;
    }
  };

  const handleRatingChange = (value) => {
    setStars(value);
  };

  return (
    <div className="p-4 space-y-6 overflow-y-scroll" ref={filterListRef}>
      {categories.map(({ id, type, label, options }) => (
        <div key={id} id={toValidSelector(id)} className="scroll-m-4">
          <h3 className="mb-4 text-sm font-semibold">{label}</h3>
          {type === FILTER_TYPES.checkbox ? (
            <CheckboxFilterGroup
              options={options}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          ) : (
            <StarRatingFilter
              options={options}
              rating={selectedStars}
              onRatingChange={handleRatingChange}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function CheckboxFilterGroup({ options, selectedFilters, onFilterChange }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map(({ id, label, field }) => (
        <div key={id} className="flex items-center gap-2">
          <Checkbox
            id={id}
            checked={selectedFilters.has(id)}
            onCheckedChange={() => onFilterChange(field, id)}
          />
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        </div>
      ))}
    </div>
  );
}

function StarRatingFilter({ options, rating, onRatingChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((i) => (
        <button
          key={i}
          onClick={() => onRatingChange(i)}
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
  );
}
