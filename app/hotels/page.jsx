"use client";

import { Suspense } from "react";
import HotelList from "./components/HotelList";
import useGetFilteredHotels from "./data/getHotels";
import { useHotelFilterStore, useRoomConfigStore } from "./data/hotelFilters";
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
import { Loader, RotateCcw, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { selectedHotelStore } from "./data/selectedHotel";
import { useRestoreStateFromURLParams } from "./data/restoreFiltersFromURL";
import { reservationsStore } from "../checkout/reservations";

const Page = () => (
  <Suspense>
    <FiltersAndResult />
  </Suspense>
);

function FiltersAndResult() {
  const store = useHotelFilterStore();

  const { commonHotels, groupedHotels, isLoading, isFetched, refetch } =
    useGetFilteredHotels(store.filterValues, store.areAllMainFiltersProvided);

  const setSelectedHotelId = selectedHotelStore(
    (state) => state.setSelectedHotelId
  );

  const setReservations = reservationsStore((state) => state.setReservations);

  function handleReset() {
    store.resetFilters();
    setSelectedHotelId(null);
    setReservations(null);
  }

  function filterHotels() {
    setSelectedHotelId(null);
    return refetch();
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
        <LocationPicker onApply={filterHotels} />
        <span className="h-full w-1 bg-muted-foreground/30 mx-2" />
        <DateRangePicker onApply={filterHotels} />
        <span className="h-full w-1 bg-muted-foreground/30 mx-2" />
        <GuestSelector onApply={filterHotels} />
        <Button
          disabled={!store.areAllMainFiltersProvided || isFetched || isLoading}
          onClick={filterHotels}
          className="h-full w-full ml-4 rounded-xl"
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
            <HotelSortingOptions onApply={filterHotels} />
            <PriceRangeSelector onApply={filterHotels} />
            <AttributesSelector onApply={filterHotels} />
            <GuestRatingSelector onApply={filterHotels} />
            <AccommodationSelector onApply={filterHotels} />
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
      <BookingsTracker />
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
          selectedHotelId && isFetched
            ? "ml-10 opacity-100 translate-x-0 md:w-1/2 overflow-y-scroll scrollbar-hide"
            : "opacity-0 translate-x-full w-0 pointer-events-none delay-150"
        )}
      >
        <HotelDetails hotelId={selectedHotelId} />
      </div>
    </div>
  );
}

function BookingsTracker() {
  const { rooms } = useRoomConfigStore();

  if (rooms?.length <= 1) return null;

  return (
    <div className="flex justify-between items-center w-full h-fit px-8 py-4 bg-background shadow-[0_-4px_16px_hsl(var(--muted)/0.8)] fixed bottom-0 left-0 z-100">
      <span className="flex justify-start items-center gap-5">
        {rooms.map((room, index) => (
          <span
            key={room.id}
            className="flex flex-col items-start justify-start gap-1"
          >
            <span className="text-xs text-muted-foreground">
              {getRoomConfigLabel(index, room.adults, room.children)}
            </span>
            <Button variant="outline" size="lg" disabled className="text-lg">
              Not Booked
            </Button>
          </span>
        ))}
      </span>
      <span className="space-x-2">
        <Button variant="secondary" size="lg" className="text-lg">
          Book Next
        </Button>
        <Button size="lg" className="text-lg">
          Checkout
        </Button>
        <Button variant="ghost" size="lg" className="text-lg p-2 m-0">
          <X />
        </Button>
      </span>
    </div>
  );
}

function getRoomConfigLabel(index, adults, children) {
  let label = adults + " " + (adults > 1 ? "adults" : "adult");
  if (children) {
    label += ", " + children + " " + (children > 1 ? "children" : "child");
  }
  return `Room #${index + 1}: (${label})`;
}

export default Page;
