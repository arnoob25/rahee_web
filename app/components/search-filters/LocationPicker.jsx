"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, X, CircleAlert } from "lucide-react";
import { useState, useRef, useEffect, forwardRef } from "react";
import { useListKeyboardNavigation } from "@/hooks/use-keyboard-navigation";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useURLParams } from "@/hooks/use-url-param";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { DynamicIcon } from "../DynamicIcon";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { splitAndGetPart } from "@/lib/string-parsers";
import { useGetLocationByName } from "@/app/data/useGetLocationByName";
import debounce from "debounce";

export default function LocationPicker({
  selectedLocation,
  setSelectedLocation,
  placeholder = "Search locations",
  className = "",
}) {
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
    setSelectedLocation(null);
    setActiveIndex(-1);
    handleLocationSearch(value);
  };

  const handleSelectLocation = (location) => {
    // we display the name in the url - acts like a slug and the id allows us to look it up in the db
    setSelectedLocation(`${location.name}_${location.locationId}`); // TODO change it to just id
    setSearchTerm(location.name);
    setActiveIndex(-1);
  };

  const clearInput = () => {
    setSearchTerm("");
    setSelectedLocation(null);
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

  /* useRestoreLocationFromURLParam({
    shouldQuery: true,
    queryFunction: getLocationById,
    setSelectedData: handleSelectLocation,
    shouldSplitParamValue: true,
    selectData: (data) => data?.hotel_listing_locations[0] ?? null,
  }); */

  return (
    <div className={cn("relative w-full h-full min-w-fit", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild className="w-full">
          <SearchBar
            ref={inputRef}
            placeholder={placeholder}
            searchTerm={searchTerm}
            onFocus={() => setIsOpen(true)}
            onTextInput={handleSearchTermInputChange}
            onKeyDown={handleKeyDown}
            onClear={clearInput}
          />
        </PopoverTrigger>

        <PopoverContent
          hideWhenDetached
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="py-0 px-2 max-h-[1000px] w-[var(--radix-popover-trigger-width)]"
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
SearchBar.displayName = "SearchBar";

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

// this will only set the state for the selected location id, won't make queries
function useRestoreLocationFromURLParam({
  urlParamKey = "location",
  queryFunction = () => {},
  setSelectedData = () => {},
  shouldSplitParamValue = false,
  selectData = null,
  shouldQuery = false,
}) {
  const hasInitialized = useRef(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramValue = searchParams.get(urlParamKey);

  const processedValue = shouldSplitParamValue
    ? splitAndGetPart(paramValue, "_", "last")
    : paramValue ?? null;

  const clearURLParam = () => {
    if (hasInitialized.current) return;
    const params = new URLSearchParams(searchParams);
    params.delete(urlParamKey);
    router.replace(`?${params.toString()}`);
    hasInitialized.current = true;
  };

  const { data: location, error } = useQuery({
    queryKey: [urlParamKey, processedValue],
    queryFn: () => queryFunction(processedValue),
    enabled: shouldQuery && !!processedValue,
    select: selectData,
  });

  useEffect(() => {
    if (hasInitialized.current) return;

    if (location) {
      setSelectedData(location);
      hasInitialized.current = true;
    } else if (!location && error && processedValue) {
      clearURLParam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, error]);
}

const getLocationById = (locationId) =>
  graphQLRequest(
    `query Request($locationId: Hotel_listing_UuidBoolExp = {_eq: ""}) {
      hotel_listing_locations(limit: 1, where: {locationId: $locationId}) {
        locationId
        name
        type
        region
        country
      }
    }`,
    { locationId: { _eq: locationId } }
  );

export const FALLBACK_LOCATIONS = [
  {
    locationId: "1a2b3c4d-5678-9101-1121-314151617181",
    name: "Grand Canyon",
    type: "natural wonder",
    region: "Arizona",
    country: "United States",
  },
  {
    locationId: "2b3c4d5e-6789-0123-1314-516171819202",
    name: "Yellowstone National Park",
    type: "national park",
    region: "Wyoming",
    country: "United States",
  },
  {
    locationId: "3c4d5e6f-7890-1234-1516-718192021223",
    name: "Times Square",
    type: "city landmark",
    region: "New York",
    country: "United States",
  },
  {
    locationId: "4d5e6f7g-8901-2345-1617-819202122334",
    name: "Golden Gate Bridge",
    type: "bridge",
    region: "California",
    country: "United States",
  },
  {
    locationId: "5e6f7g8h-9012-3456-1718-920212233445",
    name: "Niagara Falls",
    type: "waterfall",
    region: "New York",
    country: "United States",
  },
  {
    locationId: "6f7g8h9i-0123-4567-1819-021223344556",
    name: "Mount Rushmore",
    type: "monument",
    region: "South Dakota",
    country: "United States",
  },
  {
    locationId: "7g8h9i0j-1234-5678-1920-122334455667",
    name: "The White House",
    type: "government building",
    region: "Washington, D.C.",
    country: "United States",
  },
  {
    locationId: "8h9i0j1k-2345-6789-2021-223344556778",
    name: "Walt Disney World",
    type: "theme park",
    region: "Florida",
    country: "United States",
  },
];
