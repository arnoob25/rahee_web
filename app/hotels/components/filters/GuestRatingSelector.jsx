"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { appliedFilters$ } from "../../store";

const ratings = [
  { value: "8.5", label: "Excellent" },
  { value: "8.0", label: "Very good" },
  { value: "7.5", label: "Good" },
  { value: "7.0", label: "Fair" },
];

export default function GuestRatingSelector() {
  const rating = appliedFilters$.guestRating.get();
  const setRating = appliedFilters$.guestRating.set;
  const [isOpen, setIsOpen] = useState(false);

  function handleRatingSelection(rating) {
    setRating((prevRating) => {
      if (rating === prevRating) {
        return null;
      } else {
        return rating;
      }
    });
    setIsOpen(false);
  }

  // Get the label for the currently selected rating
  const selectedLabel = ratings.find((r) => r.value === rating)?.label;

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
            {rating ? `Guest Rating: ${selectedLabel}` : "Select Guest Rating"}
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
            {ratings.map((ratingOption) => (
              <button
                key={ratingOption.value}
                className={`flex items-center gap-3 rounded-sm pr-3 py-2 cursor-pointer group hover:bg-muted`}
                onClick={() => handleRatingSelection(ratingOption.value)}
              >
                <div
                  className={`rounded-full border px-2 py-0.5 text-sm group-hover:border-transparent ${
                    rating === ratingOption.value ? "bg-muted" : ""
                  }`}
                >
                  {ratingOption.value} +
                </div>
                <div>{ratingOption.label}</div>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
