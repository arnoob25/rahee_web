"use client";

import AttributesSelector from "./filters/AttributesSelector";
import GuestRatingSelector from "./filters/GuestRatingSelector";
import PriceRangeSelector from "./filters/PriceRangeSelector";
import HotelListSortingOptions from "./filters/SortingOptions";
import { useHotelFilterStore } from "../data/hotelFilterStore";
import LocationPicker from "@/app/components/search-filters/LocationPicker";
import DateRangePicker from "@/app/components/search-filters/DateRangePicker";
import RoomAndGuestSelector from "./filters/RoomAndGuestSelector";
import { useEffect, useRef } from "react";
import { useGetFilterValuesFromURL } from "../data/getHotels";
import {
  DEFAULT_DATE_RANGE,
  HOTEL_RATING_FILTERS,
  INITIAL_PRICE_RANGE,
  PRICE_CALCULATION_METHODS,
} from "../config";
import { Button } from "@/components/ui/button";

export default function HotelQueryFilters({ onGetHotels }) {
  const f = useHotelFilterStore();
  useRestoreStateFromURLParams();

  return (
    <>
      <div className="flex flex-col mt-10 gap-2">
        {/* Main filters */}
        <div className="flex flex-row items-stretch gap-2 justify-stretch">
          <LocationPicker
            selectedLocation={f.locationId}
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

function useRestoreStateFromURLParams() {
  const s = useHotelFilterStore(); // s reads as state
  const [f, roomConfigs] = useGetFilterValuesFromURL(); // f reads as filter
  const hasUpdatedStatesRef = useRef(false);

  useEffect(() => {
    if (hasUpdatedStatesRef.current) return;

    if (f.locationId && f.locationId.length > 0) {
      s.setLocationId(f.locationId);
    }

    if (f.checkInDate && f.checkOutDate) {
      s.setDateRange({ from: f.checkInDate, to: f.checkOutDate });
    } else {
      s.setDateRange(DEFAULT_DATE_RANGE);
    }

    if (roomConfigs.length > 0) {
      s.setRooms(roomConfigs);
    }

    if (f.priceSort) {
      s.setPriceSort(f.priceSort);
    }

    if (f.popularitySort) {
      s.setPopularitySort(f.popularitySort);
    }

    if (f.minPrice && f.maxPrice && f.priceCalcMethod) {
      s.setPriceRange(f.minPrice, f.maxPrice);
      s.setPriceCalcMethod(f.priceCalcMethod);
    } else {
      s.setPriceRange(
        INITIAL_PRICE_RANGE.minPrice,
        INITIAL_PRICE_RANGE.maxPrice
      );
      s.setPriceCalcMethod(PRICE_CALCULATION_METHODS.night);
    }

    if (f.tags) s.setTag(f.tags);

    if (f.facilities) s.setFacility(f.facilities);

    if (f.amenities) s.setAmenity(f.amenities);

    if (f.stars) s.setStars(f.stars);

    if (f.minRating && f.minRating >= HOTEL_RATING_FILTERS.at(-1).value) {
      s.setMinRating(f.minRating);
    } else {
      s.setMinRating(null);
    }

    hasUpdatedStatesRef.current = true;
  }, [
    s,
    f.locationId,
    f.checkInDate,
    f.checkOutDate,
    f.priceSort,
    f.popularitySort,
    f.minPrice,
    f.maxPrice,
    f.priceCalcMethod,
    f.tags,
    f.facilities,
    f.amenities,
    f.stars,
    f.minRating,
    roomConfigs,
  ]);
}
