"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowUp, ArrowDown, ListFilter } from "lucide-react";
import { SORT_ORDERS, SORTING_CRITERIA } from "../../config";
import { useHotelFilterStore } from "../../data/hotelFilters";

export default function HotelSortingOptions({ onApply }) {
  const { priceSort, popularitySort, setPriceSort, setPopularitySort } =
    useHotelFilterStore();

  const getLabel = () => {
    const labels = [];
    if (priceSort) {
      labels.push(
        priceSort === SORT_ORDERS.ASC
          ? SORTING_CRITERIA.price.ascendingLabel
          : SORTING_CRITERIA.price.descendingLabel
      );
    }
    if (popularitySort) {
      labels.push(
        popularitySort === SORT_ORDERS.ASC
          ? SORTING_CRITERIA.popularity.ascendingLabel
          : SORTING_CRITERIA.popularity.descendingLabel
      );
    }
    return labels.length > 0
      ? `Sort by: ${labels.join(", ")}`
      : "Sort accommodations";
  };

  return (
    <Popover
      onOpenChange={(isOpen) => {
        if (!isOpen) onApply();
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline">
          <ListFilter className="w-4 h-4" />
          <p className="truncate max-w-[430px]">{getLabel()}</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="p-4 min-w-fit w-[var(--radix-popover-trigger-width)]"
      >
        <div className="flex flex-col gap-3">
          <SortOptionRow
            id="sort-price"
            label={SORTING_CRITERIA.price.label}
            value={priceSort}
            setValue={setPriceSort}
            defaultOrder={SORT_ORDERS.ASC}
          />
          <SortOptionRow
            id="sort-popularity"
            label={SORTING_CRITERIA.popularity.label}
            value={popularitySort}
            setValue={setPopularitySort}
            defaultOrder={SORT_ORDERS.DSC}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

const SortOptionRow = ({ id, label, value, setValue, defaultOrder }) => {
  const toggleSort = () => {
    setValue(value === SORT_ORDERS.ASC ? SORT_ORDERS.DSC : SORT_ORDERS.ASC);
  };

  const handleCheckedChange = () => {
    setValue(value ? null : defaultOrder);
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={value !== null}
          onCheckedChange={handleCheckedChange}
          id={id}
        />
        <label htmlFor={id} className="text-sm truncate max-w-[120px]">
          {label}
        </label>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSort}
        disabled={!value}
        className="w-6 h-6"
      >
        {value === SORT_ORDERS.ASC ? (
          <ArrowUp className="w-4 h-4" />
        ) : (
          <ArrowDown className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};
