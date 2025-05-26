"use client";

import AttributesSelector from "./filters/AttributesSelector";
import GuestRatingSelector from "./filters/GuestRatingSelector";
import PriceRangeSelector from "./filters/PriceRangeSelector";
import HotelListSortingOptions from "./filters/SortingOptions";
import { useURLParams } from "@/hooks/use-url-param";
import { Button } from "@/components/ui/button";
import { useHotelFilterStore } from "../data/hotelFilterStore";
import LocationPicker from "@/app/components/search-filters/LocationPicker";
import DateRangePicker from "@/app/components/search-filters/DateRangePicker";
import RoomAndGuestSelector from "./filters/RoomAndGuestSelector";

export default function HotelQueryFilters() {
  const {
    locationId,
    dateRange,
    getAttributeFilterCount,
    hasUnappliedFilters,
    setLocationId,
    setDateRange,
    applyFilters,
    resetFilters,
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
    <div className="flex flex-col mt-10 gap-2">
      {/* Main filters */}
      <div className="flex flex-row items-stretch gap-2 justify-stretch">
        <LocationPicker
          selectedLocation={locationId}
          setSelectedLocation={setLocationId}
        />
        <DateRangePicker date={dateRange} setDate={setDateRange} />
        <RoomAndGuestSelector />
      </div>
      {/* Additional filters */}
      <div className="flex items-start gap-2 overflow-x-scroll">
        <HotelListSortingOptions />
        <PriceRangeSelector />
        <AttributesSelector />
        <GuestRatingSelector />
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
    </div>
  );
}
