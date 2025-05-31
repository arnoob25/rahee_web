"use client";

import { Suspense } from "react";
import HotelList from "./components/HotelList";
import useGetFilteredHotels from "./data/getHotels";
import {
  useHotelFilterStore,
  useRestoreStateFromURLParams,
} from "./data/hotelFilters";
import LocationPicker from "@/app/components/search-filters/LocationPicker";
import DateRangePicker from "@/app/components/search-filters/DateRangePicker";
import { Button } from "@/components/ui/button";
import HotelSortingOptions from "./components/filters/SortingOptions";
import PriceRangeSelector from "./components/filters/PriceRangeSelector";
import AttributesSelector from "./components/filters/AttributesSelector";
import GuestRatingSelector from "./components/filters/GuestRatingSelector";
import GuestSelector from "./components/filters/RoomAndGuestSelector";
import AccommodationSelector from "./components/filters/AccommodationTypeSelector";

const Page = () => (
  <Suspense>
    <FiltersAndList />
  </Suspense>
);

function FiltersAndList() {
  const f = useHotelFilterStore();
  const { groupedHotels, isLoading, getHotels } = useGetFilteredHotels();
  const hotels = groupedHotels[0].hotels;
  const areHotelsLoaded = true; //hotels.length > 0;

  useRestoreStateFromURLParams();
  return (
    <div className="overflow-hidden">
      {/* Main filters */}
      <div className="flex flex-row w-fit max-w-7xl mt-5 h-20 justify-stretch items-stretch p-3 mx-auto shadow-center-xl shadow-muted*40 rounded-xl">
        <LocationPicker
          selectedCity={f.city}
          selectedLocation={f.locationId}
          setSelectedCity={f.setCity}
          setSelectedLocation={f.setLocationId}
        />
        <span className="h-full w-1 bg-muted-foreground/30 mx-2" />
        <DateRangePicker date={f.dateRange} setDate={f.setDateRange} />
        <span className="h-full w-1 bg-muted-foreground/30 mx-2" />
        <GuestSelector />
        <Button
          disabled={!f.hasUnappliedFilters}
          onClick={getHotels}
          className="h-full w-full ml-4"
        >
          Search
        </Button>
      </div>

      <div className="flex flex-col h-screen">
        {/* Additional filters */}
        <div className="flex w-full h-24 md:max-w-7xl md:justify-evenly items-start gap-2 pt-6 pb-8 md:mx-auto overflow-x-auto overflow-y-hidden">
          <HotelSortingOptions />
          <PriceRangeSelector />
          <AttributesSelector />
          <GuestRatingSelector />
          <AccommodationSelector />
          <Button
            variant="outline"
            disabled={!f.hasUnappliedFilters}
            onClick={f.resetFilters}
          >
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-1 h-full pt-10 px-6 bg-gradient-to-b from-rose-200/30 via-white to-yellow-200/20 md:grid-cols-2 ">
          <div className="w-full">
            {hotels.length} hotels found
            <HotelList hotels={hotels} isLoading={isLoading} />
          </div>
          {areHotelsLoaded && <div className="w-full"></div>}
        </div>
      </div>
    </div>
  );
}

export default Page;
