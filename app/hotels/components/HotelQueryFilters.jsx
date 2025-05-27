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
import { useEffect, useRef } from "react";
import { useGetFilterValuesFromURL } from "../data/getHotels";
import {
  DEFAULT_DATE_RANGE,
  INITIAL_PRICE_RANGE,
  PRICE_CALCULATION_METHODS,
} from "../config";

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

  useRestoreStateFromURLParams();

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

function useRestoreStateFromURLParams() {
  const s = useHotelFilterStore();
  const u = useGetFilterValuesFromURL();
  const hasUpdatedStatesRef = useRef(false);

  useEffect(() => {
    if (hasUpdatedStatesRef.current) return;

    if (u.locationId && u.locationId.length > 0) {
      s.setLocationId(u.locationId);
    }

    if (u.checkInDate && u.checkOutDate) {
      s.setDateRange({ from: u.checkInDate, to: u.checkOutDate });
    } else {
      s.setDateRange(DEFAULT_DATE_RANGE);
    }

    if (u.roomConfigs.length > 0) {
      s.setRooms(u.roomConfigs);
    }

    if (u.priceSort) {
      s.setPriceSort(u.priceSort);
    }

    if (u.popularitySort) {
      s.setPopularitySort(u.popularitySort);
    }

    if (u.minPrice && u.maxPrice && u.priceCalcMethod) {
      s.setPriceRange(u.minPrice, u.maxPrice);
      s.setPriceCalcMethod(u.priceCalcMethod);
    } else {
      s.setPriceRange(
        INITIAL_PRICE_RANGE.minPrice,
        INITIAL_PRICE_RANGE.maxPrice
      );
      s.setPriceCalcMethod(PRICE_CALCULATION_METHODS.night);
    }

    if (u.tags) s.setTag(u.tags);

    if (u.facilities) s.setFacility(u.facilities);

    if (u.amenities) s.setAmenity(u.amenities);

    if (u.stars) s.setStars(u.stars);

    if (u.minRating) s.setMinRating(u.minRating);

    hasUpdatedStatesRef.current = true;
  }, [
    s,
    u.locationId,
    u.checkInDate,
    u.checkOutDate,
    u.roomConfigs,
    u.priceSort,
    u.popularitySort,
    u.minPrice,
    u.maxPrice,
    u.priceCalcMethod,
    u.tags,
    u.facilities,
    u.amenities,
    u.stars,
    u.minRating,
  ]);
}
