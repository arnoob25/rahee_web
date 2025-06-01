"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, X, CircleAlert } from "lucide-react";
import { useState, forwardRef } from "react";
import { useListKeyboardNavigation } from "@/hooks/use-keyboard-navigation";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Label } from "@/components/ui/label";
import { useGetLocationByName } from "@/app/data/useGetLocationByName";
import debounce from "debounce";
import { useHotelFilterStore } from "../../data/hotelFilters";
import { DynamicIcon } from "@/app/components/DynamicIcon";
import { FALLBACK_LOCATIONS, LOCATION_TYPES } from "../../config";

export default function LocationPicker({
  placeholder = "Search locations",
  className = "",
}) {
  const {
    city: selectedCity,
    locationId: selectedLocation,
    setCity,
    setLocationId,
  } = useHotelFilterStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [textSearchTerm, setTextSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  const {
    locations,
    status: locationQueryStatus,
    refetch,
  } = useGetLocationByName(textSearchTerm);

  const filteredLocations = locations ?? [];
  const areLocationsFound = filteredLocations.length > 0;

  const handleLocationSearch = debounce((searchTerm) => {
    setTextSearchTerm(searchTerm);
    refetch();
  }, 700);

  const shouldDisplayFallbackMessage =
    searchTerm.trim().length > 0 &&
    !areLocationsFound &&
    locationQueryStatus === "success";

  const handleSearchTermInputChange = (e) => {
    const value = e.target.value;
    if (value.trim() && !isOpen) setIsOpen(true);

    setSearchTerm(value);
    setActiveIndex(-1);
    handleLocationSearch(value);
  };

  const handleSelectLocation = (location) => {
    // we display the name in the url - acts like a slug and the id allows us to look it up in the db
    if (location.type === LOCATION_TYPES.LOCATION) {
      setLocationId(`${location.name}_${location.locationId}`);
    } else {
      setCity(location.city);
    }
    setSearchTerm(location.name);
    setActiveIndex(-1);
  };

  const clearInput = () => {
    setSearchTerm("");
    setLocationId(null);
    setCity(null);
    setActiveIndex(-1);
  };

  const { inputRef, listRef, handleKeyDown } = useListKeyboardNavigation({
    isOpen,
    activeIndex,
    items: areLocationsFound ? filteredLocations : FALLBACK_LOCATIONS,
    setIsOpen,
    onSelect: handleSelectLocation,
    setActiveIndex,
  });

  const placeholderName = selectedCity
    ? FALLBACK_LOCATIONS.find((location) => location.city === selectedCity)
        ?.name
    : FALLBACK_LOCATIONS.find(
        (location) => location.locationId === selectedLocation
      )?.name;

  return (
    <div className={cn("relative w-full h-full min-w-fit", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild className="w-full">
          <Button
            variant="outline"
            className="h-full border-0 shadow-none justify-start text-left focus-within:outline-none focus-within:ring-2 focus-within:ring-primary"
          >
            <MapPin className="w-4 h-4 mr-2" />
            <div className="flex flex-col items-start">
              <span className="text-xs text-muted-foreground">
                {" "}
                Destination
              </span>
              <SearchBar
                ref={inputRef}
                placeholder={placeholderName ?? placeholder}
                searchTerm={searchTerm}
                onTextInput={handleSearchTermInputChange}
                onKeyDown={handleKeyDown}
                onClear={clearInput}
              />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          hideWhenDetached
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="py-0 px-2 w-[var(--radix-popover-trigger-width)]"
          sideOffset={10}
        >
          <ul ref={listRef} className="flex flex-col gap-1 py-2">
            {shouldDisplayFallbackMessage && (
              <FallbackMessage fallbackListId="locations" />
            )}
            <LocationList
              id="locations"
              locations={
                areLocationsFound ? filteredLocations : FALLBACK_LOCATIONS
              }
              selectedItemIndex={activeIndex}
              onSelect={handleSelectLocation}
              onKeyDown={handleKeyDown}
            />
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}

const SearchBar = forwardRef(
  (
    { placeholder, searchTerm, onFocus, onTextInput, onKeyDown, onClear },
    ref
  ) => (
    <div>
      <Input
        ref={ref}
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={onTextInput}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        className="w-full h-fit text-base p-0 m-0 pr-10 border-0 shadow-none focus-visible:ring-0"
      />
      {Boolean(searchTerm.trim()) && (
        <div
          role="button"
          className="absolute -translate-y-1/2 right-2 top-1/2 hover:bg-transparent"
          onClick={onClear}
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  )
);
SearchBar.displayName = "SearchBar";

function LocationList({ locations, selectedItemIndex, onSelect, onKeyDown }) {
  return (
    <>
      {locations.map((location, index) => (
        <li key={location?.locationId ?? location.city}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start px-4 py-2 h-auto font-normal",
              index === selectedItemIndex && "bg-accent text-accent-foreground"
            )}
            onClick={() => onSelect(location)}
            onKeyDown={onKeyDown}
            data-index={index}
          >
            <div className="flex items-center gap-2">
              <DynamicIcon
                name={location.type}
                FallbackIcon={MapPin}
                className="flex-shrink-0 w-4 h-4 text-muted-foreground"
              />
              <div className="text-left">
                <p className="text-sm font-medium">{location.name}</p>
                <p className="text-xs text-muted-foreground">
                  {location.type} ·{" "}
                  {location?.region ?? location?.country ?? null}
                </p>
              </div>
            </div>
          </Button>
        </li>
      ))}
    </>
  );
}

const FallbackMessage = ({ fallbackListId }) => (
  <div className="flex flex-col gap-4">
    <p className="flex items-center justify-start gap-1 p-3 text-sm rounded-sm bg-muted text-muted-foreground">
      <CircleAlert className="w-3 h-3" />
      {`Sorry, we don't support this location yet`}
    </p>
    <Label htmlFor={fallbackListId}>Other locations you can consider</Label>
  </div>
);
