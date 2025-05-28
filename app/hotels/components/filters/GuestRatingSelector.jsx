"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, ChevronUp } from "lucide-react";
import { HOTEL_RATING_FILTERS } from "../../config";
import { useHotelFilterStore } from "../../data/hotelFilters";

export default function GuestRatingSelector() {
  const { minRating, setMinRating } = useHotelFilterStore();
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = HOTEL_RATING_FILTERS.find(
    (r) => Number(r.value) === minRating
  )?.label;

  function handleRatingSelection(selectedValue) {
    setMinRating(Number(selectedValue));
    setIsOpen(false);
  }

  return (
    <div className="w-fit">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="justify-between w-full font-normal"
          >
            {minRating !== null
              ? `Guest Rating: ${selectedLabel}`
              : "Select Guest Rating"}
            {isOpen ? (
              <ChevronUp className="w-4 h-4 ml-2 opacity-50 shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 min-w-fit w-[var(--radix-popover-trigger-width)]"
          align="start"
        >
          <div className="grid gap-1 p-2">
            {HOTEL_RATING_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                className={`flex items-center gap-3 rounded-sm pr-3 py-2 cursor-pointer group hover:bg-muted ${
                  Number(minRating) === Number(value) ? "bg-muted" : ""
                }`}
                onClick={() => handleRatingSelection(value)}
              >
                <div
                  className={`rounded-full border px-2 py-0.5 text-sm group-hover:border-transparent ${
                    Number(minRating) === Number(value) ? "bg-muted" : ""
                  }`}
                >
                  {value} +
                </div>
                <div>{label}</div>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
