"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Home, X } from "lucide-react";
import { observable } from "@legendapp/state";
import { observer } from "@legendapp/state/react";
import { useListKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import useRestoreSelectionFromURLParam from "@/hooks/useRestoreSelectionFromURLParam";
import { getLocationById } from "@/app/hotels/queryFunctions";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const states$ = observable({
  query: "",
  isOpen: false,
  selectedLocation: null,
  activeIndex: -1,
});

const LocationPicker = observer(function Component({
  placeholder = "Search locations",
  locations = [],
  setSearchTerm = () => {},
  className = "",
}) {
  const query = states$.query.get();
  const isOpen = states$.isOpen.get();
  const activeIndex = states$.activeIndex.get();
  const filteredLocations = locations ?? [];

  const router = useRouter();
  const searchParams = useSearchParams();

  function handleInputChange(e) {
    const value = e.target.value;
    states$.query.set(value);
    states$.isOpen.set(value.length > 0);
    states$.selectedLocation.set(null);
    states$.activeIndex.set(-1);
    setSearchTerm(value);
  }

  function updateURLParam(location) {
    const params = new URLSearchParams(searchParams);
    params.set("location", `${location.name}_${location.locationId}`);
    router.replace(`?${params.toString()}`);
  }

  function deleteURLParam() {
    const params = new URLSearchParams(searchParams);
    params.delete("location");
    router.replace(`?${params.toString()}`);
  }

  const handleSelectLocation = (location) => {
    states$.selectedLocation.set(location);
    states$.query.set(location.name);
    states$.isOpen.set(false);
    states$.activeIndex.set(-1);
    updateURLParam(location);
  };

  function clearInput() {
    states$.query.set("");
    states$.isOpen.set(false);
    states$.selectedLocation.set(null);
    states$.activeIndex.set(-1);
    deleteURLParam();
  }

  const { inputRef, listRef, handleKeyDown } = useListKeyboardNavigation({
    isOpen,
    activeIndex,
    items: filteredLocations,
    setIsOpen: states$.isOpen.set,
    onSelect: handleSelectLocation,
    setActiveIndex: states$.activeIndex.set,
  });

  useRestoreSelectionFromURLParam({
    shouldQuery: true,
    urlParamKey: "location",
    queryFunction: getLocationById,
    setSelectedData: handleSelectLocation,
    shouldSplitParamValue: true,
    selectData: (data) => data?.hotel_listing_locations[0] ?? null,
  });

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => states$.isOpen.set(true)}
          onKeyDown={handleKeyDown}
          className="w-full pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
            onClick={clearInput}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>
      {isOpen && query.length > 0 ? (
        <Card className="absolute mt-1 w-full z-10 shadow-md">
          <CardContent className="p-0">
            {filteredLocations.length > 0 ? (
              <ul ref={listRef} className="py-2">
                {filteredLocations.map((location, index) => (
                  <li key={location.locationId}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start px-4 py-2 h-auto font-normal",
                        index === activeIndex &&
                          "bg-accent text-accent-foreground"
                      )}
                      onClick={() => handleSelectLocation(location)}
                      onKeyDown={handleKeyDown}
                      data-index={index}
                    >
                      <div className="flex items-center gap-2">
                        {location.type === "City" ? (
                          <Home className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <div className="text-left">
                          <p className="font-medium text-sm">{location.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {location.type} · {location.region}
                          </p>
                        </div>
                      </div>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-4 text-sm text-muted-foreground">
                No results found
              </p>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
});

export default LocationPicker;
