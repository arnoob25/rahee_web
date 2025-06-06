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
import { Loader, RotateCcw, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { selectedHotelStore } from "./data/selectedHotel";
import { useRestoreStateFromURLParams } from "./data/restoreFiltersFromURL";

const Page = () => (
  <Suspense>
    <FiltersAndList />
  </Suspense>
);

function FiltersAndList() {
  const store = useHotelFilterStore();

  const { commonHotels, groupedHotels, isLoading, isFetched, getHotels } =
    useGetFilteredHotels(store.filterValues, store.areAllMainFiltersProvided);

  const setSelectedHotelId = selectedHotelStore(
    (state) => state.setSelectedHotelId
  );

  function handleReset() {
    store.resetFilters();
    setSelectedHotelId(null);
  }

  useRestoreStateFromURLParams();
  return (
    <div className={cn("overflow-hidden", isLoading ? "cursor-progress" : "")}>
      <div
        className={`flex flex-row min-w-fit max-w-default mt-3 h-20 justify-stretch items-stretch p-3 mx-auto shadow-center-xl shadow-muted*40 rounded-xl ${
          isLoading ? "pointer-events-none select-none" : ""
        }`}
        tabIndex={isLoading ? -1 : 0}
        aria-disabled={isLoading}
      >
        <LocationPicker onApply={getHotels} />
        <span className="h-full w-1 bg-muted-foreground/30 mx-2" />
        <DateRangePicker onApply={getHotels} />
        <span className="h-full w-1 bg-muted-foreground/30 mx-2" />
        <GuestSelector onApply={getHotels} />
        <Button
          disabled={!store.areAllMainFiltersProvided || isFetched || isLoading}
          onClick={getHotels}
          className="h-full w-full ml-2 rounded-xl"
        >
          {isLoading ? <Loader className="animate-spin" /> : <Search />}
        </Button>
      </div>

      <div className="flex flex-col h-screen">
        <div
          className={cn(
            "transition-all duration-500 ease-out transform-gpu overflow-hidden",
            !store.areAllMainFiltersProvided
              ? "max-h-0 pt-0 pb-0 opacity-0 pointer-events-none shadow-none shadow-transparent"
              : "max-h-fit pt-6 pb-7 opacity-100 shadow-xl shadow-muted/50"
          )}
        >
          {" "}
          <div className="flex w-full min-h-fit gap-2 px-6 lg:px-0 md:max-w-[90rem] md:justify-evenly md:mx-auto overflow-x-auto scrollbar-hide">
            <HotelSortingOptions onApply={getHotels} />
            <PriceRangeSelector onApply={getHotels} />
            <AttributesSelector onApply={getHotels} />
            <GuestRatingSelector onApply={getHotels} />
            <AccommodationSelector onApply={getHotels} />
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw />
              Reset
            </Button>
          </div>
        </div>

        <ResultsSection
          commonHotels={commonHotels}
          groupedHotels={groupedHotels}
          isLoading={isLoading}
          isFetched={isFetched}
          className={cn(
            "flex flex-col pt-10 pb-6 px-6 md:flex-row",
            !store.areAllMainFiltersProvided ? "h-full" : "h-[92%]"
          )}
        />
      </div>
    </div>
  );
}

function ResultsSection({
  commonHotels,
  groupedHotels,
  isLoading,
  isFetched,
  className,
}) {
  const selectedHotelId = selectedHotelStore((state) => state.selectedHotelId);

  return (
    <div className={cn("", className)}>
      <div
        className={cn(
          "mx-auto transition-all ease-out rounded-xl overflow-y-hidden",
          selectedHotelId
            ? "duration-100 md:w-1/2 px-2"
            : "duration-1000 w-full max-w-default"
        )}
      >
        <HotelList
          commonHotels={commonHotels}
          groupedHotels={groupedHotels}
          isFetched={isFetched}
          isLoading={isLoading}
        />
      </div>

      <div
        className={cn(
          "h-full rounded-xl overflow-hidden transition-all duration-100 ease-out",
          selectedHotelId
            ? "ml-10 opacity-100 translate-x-0 md:w-1/2 overflow-y-scroll scrollbar-hide"
            : "opacity-0 translate-x-full w-0 pointer-events-none delay-150"
        )}
      >
        <HotelDetails hotelId={selectedHotelId} />
      </div>
    </div>
  );
}

export default Page;
