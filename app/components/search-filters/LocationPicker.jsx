"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, X, CircleAlert } from "lucide-react";
import { observable } from "@legendapp/state";
import { observer } from "@legendapp/state/react";
import { useListKeyboardNavigation } from "@/hooks/use-keyboard-navigation";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useURLParams } from "@/hooks/use-url-param";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { useToggleModal } from "@/hooks/use-modal";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { DynamicIcon } from "../DynamicIcon";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, forwardRef } from "react";
import { splitAndGetPart } from "@/lib/string-parsers";
import { useQuery } from "@tanstack/react-query";
import { getLocationById } from "@/app/data/queryFunctions";

const store$ = observable({
  searchTerm: "",
  selectedLocation: null,
  // indicates the index of the selected item
  // negative implies no item in the list is selected
  activeIndex: -1,
});

// exported component
const LocationPicker = observer(function Component({
  placeholder = "Search locations",
  locations = [],
  fallbackLocations = [],
  setSearchTerm = () => {},
  locationQueryStatus = "",
  className = "",
}) {
  const [isOpen, togglePopover] = useToggleModal();

  const searchTerm = store$.searchTerm.get();
  const activeIndex = store$.activeIndex.get();

  const filteredLocations = locations ?? [];
  const areLocationsFound = filteredLocations.length > 0;
  const shouldDisplayFallbackMessage =
    searchTerm.trim().length > 0 &&
    !areLocationsFound &&
    locationQueryStatus === "success";

  function handleSearchTermInputChange(e) {
    const value = String(e.target.value);
    if (value.trim() && !isOpen) togglePopover(); // opens the popover if its closed

    store$.searchTerm.set(value);
    store$.isOpen.set(value.length > 0);
    store$.selectedLocation.set(null);
    store$.activeIndex.set(-1);
    setSearchTerm(value);
  }

  const { updateURLParam, deleteURLParam } = useURLParams();

  const handleSelectLocation = (location) => {
    store$.selectedLocation.set(location);
    store$.searchTerm.set(location.name);
    store$.activeIndex.set(-1);
    updateURLParam("location", `${location.name}_${location.locationId}`);
  };

  function clearInput() {
    store$.searchTerm.set("");
    store$.selectedLocation.set(null);
    store$.activeIndex.set(-1);
    deleteURLParam("location");
  }

  const { inputRef, listRef, handleKeyDown } = useListKeyboardNavigation({
    isOpen,
    activeIndex,
    items: areLocationsFound ? filteredLocations : fallbackLocations,
    setIsOpen: store$.isOpen.set,
    onSelect: handleSelectLocation,
    setActiveIndex: store$.activeIndex.set,
  });

  useRestoreLocationFromURLParam({
    shouldQuery: true,
    queryFunction: getLocationById,
    setSelectedData: handleSelectLocation,
    shouldSplitParamValue: true,
    selectData: (data) => data?.hotel_listing_locations[0] ?? null,
  });
  // #endregion

  return (
    <div className={cn("relative w-full", className)}>
      <Popover open={isOpen} onOpenChange={togglePopover}>
        <PopoverTrigger asChild className="w-full">
          <SearchBar
            ref={inputRef}
            placeholder={placeholder}
            searchTerm={searchTerm}
            onFocus={togglePopover}
            onTextInput={handleSearchTermInputChange}
            onKeyDown={handleKeyDown}
            onClear={clearInput}
          />
        </PopoverTrigger>

        <PopoverContent
          hideWhenDetached
          onOpenAutoFocus={(e) => {
            // the search bar remains focused
            e.preventDefault();
          }}
          className="py-0 px-2 max-h-[1000px] w-[var(--radix-popover-trigger-width)]"
        >
          <ul ref={listRef} className="flex flex-col gap-1 py-2">
            {shouldDisplayFallbackMessage && (
              <FallbackMessage fallbackListId="locations" />
            )}
            <LocationList
              id="locations"
              locations={
                areLocationsFound ? filteredLocations : fallbackLocations
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
});

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
        className="w-full pr-10"
      />
      {Boolean(searchTerm.trim()) && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -translate-y-1/2 right-2 top-1/2 hover:bg-transparent"
          onClick={onClear}
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </Button>
      )}
    </div>
  )
);

function LocationList({ locations, selectedItemIndex, onSelect, onKeyDown }) {
  return (
    <>
      {locations.map((location, index) => (
        <li key={location.locationId}>
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
                  {location.type} · {location.region}
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

function useRestoreLocationFromURLParam({
  urlParamKey = "location",
  queryFunction = () => {},
  setSelectedLocation = () => {},
  shouldSplitParamValue = false,
  selectLocationData = null, // allow selection of nested location
  shouldQuery = false,
}) {
  // ensures the hook does not interfere with external selection logic
  const hasInitialized = useRef(false);
  const router = useRouter();

  // TODO: extract the url param extracting logic into a custom hook
  /* const searchParams = useSearchParams(); */
  const paramValue = searchParams.get(urlParamKey);

  // Conditionally process the parameter value
  // If shouldSplitParamValue is true, split the parameter by underscore
  // and take the last segment (pop).
  // Otherwise, use the parameter value as is.
  const processedValue = shouldSplitParamValue
    ? splitAndGetPart(paramValue, "_", "last") // this is the ID
    : paramValue ?? null;

  const clearURLParam = () => {
    if (hasInitialized) return;
    const params = new URLSearchParams(searchParams);
    params.delete(urlParamKey);
    router.replace(`?${params.toString()}`);
    hasInitialized.current = true;
  };

  // set the location directly if query not required
  if (!shouldQuery) {
    if (!processedValue) clearURLParam();
    setSelectedLocation(urlParamKey, processedValue);
  }

  // query for the location when needed
  const { data: location, error } = useQuery({
    queryKey: [urlParamKey, processedValue],
    queryFn: () => queryFunction(processedValue),
    enabled: shouldQuery && !!processedValue,
    select: selectLocationData, // Use the provided function to extract the desired object
  });

  // set the queried location
  useEffect(() => {
    if (hasInitialized.current) return;

    if (location) {
      setSelectedLocation(location);
      hasInitialized.current = true;
    } else if (!location && error && processedValue) {
      // Clear the URL parameter if no location found and there was an error
      clearURLParam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, setSelectedLocation, selectLocationData]);
}

export default LocationPicker;
SearchBar.displayName = SearchBar;
