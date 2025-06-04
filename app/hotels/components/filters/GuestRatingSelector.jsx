"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Heart } from "lucide-react";
import { HOTEL_RATING_FILTERS } from "../../config";
import { useMiscFiltersStore } from "../../data/hotelFilters";

export default function GuestRatingSelector({ onApply: refetchHotels }) {
  const { minRating, setMinRating } = useMiscFiltersStore();

  const areChangesMade = useRef(false);

  const selectedLabel = HOTEL_RATING_FILTERS.find(
    (r) => Number(r.value) === minRating
  )?.label;

  function handleRatingSelection(selectedValue) {
    setMinRating(Number(selectedValue));
    areChangesMade.current = true;
  }

  const handlePopoverClick = (isOpen) => {
    if (!isOpen && areChangesMade.current) {
      refetchHotels();
      areChangesMade.current = false;
    }
  };

  return (
    <div className="w-fit">
      <Popover onOpenChange={handlePopoverClick}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="justify-between w-full font-normal"
          >
            <Heart className="w-4 h-4" />
            {minRating !== null
              ? `Guest Rating: ${selectedLabel}`
              : "Select Guest Rating"}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 min-w-fit w-[var(--radix-popover-trigger-width)]"
          align="start"
        >
          <div className="grid gap-2 p-2">
            {HOTEL_RATING_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                className={`flex items-center gap-3 rounded-sm px-3 py-2 cursor-pointer group hover:bg-muted ${
                  Number(minRating) === Number(value) ? "bg-muted" : ""
                }`}
                onClick={() => handleRatingSelection(value)}
              >
                <div
                  className={`rounded-full border px-2 py-0.5 text-sm group-hover:border-transparent ${
                    Number(minRating) === Number(value)
                      ? "bg-muted border-0"
                      : ""
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
