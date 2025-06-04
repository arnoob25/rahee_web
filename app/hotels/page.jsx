"use client";

import { Suspense } from "react";
import HotelList from "./components/HotelList";
import useGetFilteredHotels from "./data/getHotels";
import { useHotelFilterStore } from "./data/hotelFilters";
import { Button } from "@/components/ui/button";
import HotelSortingOptions from "./components/filters/SortingOptions";
import PriceRangeSelector from "./components/filters/PriceRangeSelector";
import AttributesSelector from "./components/filters/AttributesSelector";
import GuestRatingSelector from "./components/filters/GuestRatingSelector";
import GuestSelector from "./components/filters/RoomAndGuestSelector";
import AccommodationSelector from "./components/filters/AccommodationTypeSelector";
import HotelDetails from "./components/HotelDetails";
import LocationPicker from "./components/filters/LocationPicker";
import DateRangePicker from "./components/filters/DateRangePicker";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelectedHotelStore } from "./data/selectedHotel";
import { useRestoreStateFromURLParams } from "./data/restoreFiltersFromURL";

const Page = () => (
  <Suspense>
    <FiltersAndList />
  </Suspense>
);

function FiltersAndList() {
  const store = useHotelFilterStore();

  const { commonHotels, groupedHotels, isLoading, getHotels } =
    useGetFilteredHotels(store.filterValues, store.areAllMainFiltersProvided);

  const { selectedHotelId, setSelectedHotelId } = useSelectedHotelStore();

  function handleReset() {
    store.resetFilters();
    setSelectedHotelId(null);
  }

  useRestoreStateFromURLParams();
  return (
    <div className="overflow-hidden">
      {/* Main filters */}
      <div className="flex flex-row w-fit max-w-7xl mt-5 h-20 justify-stretch items-stretch p-3 mx-auto shadow-center-xl shadow-muted*40 rounded-xl">
        <LocationPicker />
        <span className="h-full w-1 bg-muted-foreground/30 mx-2" />
        <DateRangePicker />
        <span className="h-full w-1 bg-muted-foreground/30 mx-2" />
        <GuestSelector />
        <Button
          disabled={!store.areAllMainFiltersProvided}
          onClick={getHotels}
          className="h-full w-full ml-4 rounded-xl"
        >
          <Search />
        </Button>
      </div>

      <div className="flex flex-col h-screen">
        {/* Additional filters */}
        <div
          className={cn(
            "flex w-full min-h-fit gap-2 px-6 pt-6 lg:px-0 md:max-w-[90rem] md:justify-evenly md:mx-auto overflow-x-auto scrollbar-hide",
            "transition-all duration-500 ease-in-out transform-gpu",
            !store.areAllMainFiltersProvided
              ? "max-h-0 opacity-0 -translate-y-4 overflow-hidden pt-0"
              : "max-h-fit opacity-100 translate-y-0"
          )}
        >
          <HotelSortingOptions onApply={getHotels} />
          <PriceRangeSelector onApply={getHotels} />
          <AttributesSelector onApply={getHotels} />
          <GuestRatingSelector onApply={getHotels} />
          <AccommodationSelector onApply={getHotels} />
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>

        <div className="w-full pb-7 shadow-xl shadow-muted/50"></div>

        <div className="flex flex-col h-full pt-10 px-6 md:flex-row">
          <div
            className={cn(
              "mx-auto transition-all ease-out",
              selectedHotelId
                ? "duration-100 md:w-1/2"
                : "duration-1000 w-full max-w-default"
            )}
          >
            {groupedHotels?.length > 0 && commonHotels?.length >= 0 ? (
              <HotelList
                commonHotels={commonHotels}
                groupedHotels={groupedHotels}
                isLoading={isLoading}
              />
            ) : (
              <span>Search to find your next stay</span>
            )}
          </div>

          <div
            className={cn(
              "overflow-hidden transition-all duration-100 ease-out",
              selectedHotelId
                ? "ml-10 opacity-100 translate-x-0 md:w-1/2 overflow-y-scroll scrollbar-hide"
                : "opacity-0 translate-x-full w-0 pointer-events-none delay-150"
            )}
          >
            <HotelDetails hotelId={selectedHotelId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
