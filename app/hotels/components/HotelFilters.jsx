"use client";

import AttributesSelector from "./filters/AttributesSelector";
import GuestRatingSelector from "./filters/GuestRatingSelector";
import PriceRangeSelector from "./filters/PriceRangeSelector";
import AccommodationSelector from "./filters/AccommodationTypeSelector";
import HotelListSortingOptions from "./filters/SortingOptions";
import { useURLParams } from "@/hooks/use-url-param";
import { Button } from "@/components/ui/button";
import { useHotelFilterStore } from "../data/hotelFilterStore";

export default function HotelQueryFilters() {
  const {
    hasUnappliedFilters,
    applyFilters,
    resetFilters,
    getAttributeFilterCount,
  } = useHotelFilterStore();

  // URL param helpers
  const { updateURLParam, updateURLParamArray, updateURL, deleteURLParam } =
    useURLParams();

  const handleApplyingFilters = () => {
    applyFilters(
      updateURLParam,
      updateURLParamArray,
      deleteURLParam,
      updateURL
    );
  };

  const handleResettingFilters = () => {
    resetFilters(deleteURLParam, updateURL);
  };

  return (
    <div className="flex items-start gap-2 overflow-x-scroll">
      <HotelListSortingOptions />
      <PriceRangeSelector />
      <AttributesSelector />
      <GuestRatingSelector />
      {/* <AccommodationSelector /> */}
      <Button disabled={!hasUnappliedFilters} onClick={handleApplyingFilters}>
        Done
      </Button>
      <Button
        disabled={!hasUnappliedFilters && getAttributeFilterCount === 0}
        onClick={handleResettingFilters}
      >
        Reset
      </Button>
    </div>
  );
}
