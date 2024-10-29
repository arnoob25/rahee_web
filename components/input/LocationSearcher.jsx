"use client";

import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Home, X } from "lucide-react";
import { observable } from "@legendapp/state";
import { observer } from "@legendapp/state/react";

const states$ = observable({
  query: "",
  isOpen: false,
  fetchedLocations: [
    { id: 1, name: "Chittagong", type: "City", country: "Bangladesh" },
    {
      id: 2,
      name: "Cox's Bazar, Chittagong",
      type: "Beach",
      country: "Bangladesh",
    },
    { id: 3, name: "Dhaka", type: "City", country: "Bangladesh" },
    { id: 4, name: "Sylhet", type: "City", country: "Bangladesh" },
  ],
  filteredLocations: [],
  selectedLocation: null,
  activeIndex: -1,
});

const handleInputChange = (e) => {
  const value = e.target.value;
  states$.query.set(value);
  states$.isOpen.set(value.length > 0);
  states$.filteredLocations.set(
    states$.fetchedLocations
      .get()
      .filter((location) =>
        location.name.toLowerCase().includes(value.toLowerCase())
      )
  );
  states$.selectedLocation.set(null);
  states$.activeIndex.set(-1);
};

const clearInput = () => {
  states$.query.set("");
  states$.isOpen.set(false);
  states$.filteredLocations.set(states$.fetchedLocations.get());
  states$.selectedLocation.set(null);
  states$.activeIndex.set(-1);
};

const handleSelectLocation = (location) => {
  states$.selectedLocation.set(location);
  states$.query.set(location.name);
  states$.isOpen.set(false);
  states$.activeIndex.set(-1);
};

const LocationSearcher = observer(function Component() {
  const query = states$.query.get();
  const isOpen = states$.isOpen.get();
  const filteredLocations = states$.filteredLocations.get();
  const activeIndex = states$.activeIndex.get();
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeElement = listRef.current.querySelector(
        `[data-index="${activeIndex}"]`
      );
      if (activeElement) {
        activeElement.focus();
      }
    }
  }, [activeIndex, isOpen]);

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown") {
        states$.isOpen.set(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        states$.activeIndex.set((prevIndex) =>
          prevIndex < filteredLocations.length - 1 ? prevIndex + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        states$.activeIndex.set((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredLocations.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0) {
          handleSelectLocation(filteredLocations[activeIndex]);
        }
        break;
      case "Escape":
        states$.isOpen.set(false);
        inputRef.current?.focus();
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search locations"
          value={query}
          onChange={handleInputChange}
          onFocus={() => states$.isOpen.set(true)}
          onKeyDown={handleKeyDown}
          className="pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={clearInput}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {isOpen && query.length > 0 && (
        <Card className="absolute mt-1 w-full z-10">
          <CardContent className="p-0">
            {filteredLocations.length > 0 ? (
              <ul className="py-2" ref={listRef}>
                {filteredLocations.map((location, index) => (
                  <li key={location.id}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start px-4 py-2 h-auto font-normal ${
                        index === activeIndex
                          ? "bg-accent text-accent-foreground"
                          : ""
                      }`}
                      onClick={() => handleSelectLocation(location)}
                      onKeyDown={handleKeyDown}
                      data-index={index}
                    >
                      <div className="flex items-center">
                        {location.type === "City" ? (
                          <Home className="h-4 w-4 mr-2 text-gray-500" />
                        ) : (
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        )}
                        <div className="text-left">
                          <p className="font-medium">{location.name}</p>
                          <p className="text-sm text-gray-500">
                            {location.type} · {location.country}
                          </p>
                        </div>
                      </div>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-2">No results found</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
});

export default LocationSearcher;
