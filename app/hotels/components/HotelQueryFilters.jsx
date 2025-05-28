"use client";

import AttributesSelector from "./filters/AttributesSelector";
import GuestRatingSelector from "./filters/GuestRatingSelector";
import PriceRangeSelector from "./filters/PriceRangeSelector";
import HotelListSortingOptions from "./filters/SortingOptions";
import LocationPicker from "@/app/components/search-filters/LocationPicker";
import DateRangePicker from "@/app/components/search-filters/DateRangePicker";
import RoomAndGuestSelector from "./filters/RoomAndGuestSelector";
import { Button } from "@/components/ui/button";
import {
  useHotelFilterStore,
  useRestoreStateFromURLParams,
} from "../data/hotelFilters";

export default function HotelQueryFilters({ onGetHotels }) {
  const f = useHotelFilterStore();
  useRestoreStateFromURLParams();

  return (
    <>
      <div className="flex flex-col mt-10 gap-2">
        {/* Main filters */}
        <div className="flex flex-row items-stretch gap-2 justify-stretch">
          <LocationPicker
            selectedCity={f.city}
            selectedLocation={f.locationId}
            setSelectedCity={f.setCity}
            setSelectedLocation={f.setLocationId}
          />
          <DateRangePicker date={f.dateRange} setDate={f.setDateRange} />
          <RoomAndGuestSelector />
        </div>
        {/* Additional filters */}
        <div className="flex items-start gap-2 overflow-x-scroll">
          <HotelListSortingOptions />
          <PriceRangeSelector />
          <AttributesSelector />
          <GuestRatingSelector />
        </div>
      </div>
      <Button disabled={!f.hasUnappliedFilters} onClick={onGetHotels}>
        Done
      </Button>
      <Button
        disabled={!f.hasUnappliedFilters && f.getAttributeFilterCount === 0}
        onClick={f.resetFilters}
      >
        Reset
      </Button>
    </>
  );
}
