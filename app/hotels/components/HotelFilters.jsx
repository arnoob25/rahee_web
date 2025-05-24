"use client";

import AttributesSelector from "./filters/AttributesSelector";
import GuestRatingSelector from "./filters/GuestRatingSelector";
import PriceRangeSelector from "./filters/PriceRangeSelector";
import AccommodationSelector from "./filters/AccommodationTypeSelector";
import HotelListSortingOptions from "./filters/SortingOptions";
import { useState } from "react";
import { useURLParams } from "@/hooks/use-url-param";
import { Button } from "@/components/ui/button";

export default function HotelQueryFilters() {
  // Local state for filters
  // hotel attributes
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [selectedFacilities, setSelectedFacilities] = useState(new Set());
  const [selectedAmenities, setSelectedAmenities] = useState(new Set());
  const [selectedRating, setSelectedRating] = useState(null);

  // apply and reset buttons
  const [hasUnappliedFilters, setHasUnappliedFilters] = useState(false);

  // URL param helpers
  const { updateURLParam, updateURLParamArray, updateURL, deleteURLParam } =
    useURLParams();

  const handleApplyingFilters = () => {
    updateURLParamArray("tags", selectedTags, false);
    updateURLParamArray("facilities", selectedFacilities, false);
    updateURLParamArray("amenities", selectedAmenities, false);
    updateURLParam("stars", selectedRating, false);

    setHasUnappliedFilters(false);
    updateURL();
  };

  const handleResettingFilters = () => {
    const paramsToDelete = ["tags", "facilities", "amenities", "stars"];

    paramsToDelete.forEach((item) => deleteURLParam(item, false));

    setSelectedTags(new Set());
    setSelectedFacilities(new Set());
    setSelectedAmenities(new Set());
    setSelectedRating(null);

    setHasUnappliedFilters(false);
    updateURL();
  };

  const allAttributes = [
    ...selectedTags,
    ...selectedFacilities,
    ...selectedAmenities,
  ];

  const attributeFilterCount = allAttributes.length + selectedRating ? 1 : 0;

  return (
    <div className="flex items-start gap-2 overflow-x-scroll">
      <HotelListSortingOptions />
      <PriceRangeSelector />
      <AttributesSelector
        selectedTags={selectedTags}
        selectedFacilities={selectedFacilities}
        selectedAmenities={selectedAmenities}
        selectedRating={selectedRating}
        setSelectedTags={setSelectedTags}
        setSelectedFacilities={setSelectedFacilities}
        setSelectedAmenities={setSelectedAmenities}
        setSelectedRating={setSelectedRating}
        setHasUnappliedFilters={(isNewFilterApplied) =>
          isNewFilterApplied && !hasUnappliedFilters
            ? setHasUnappliedFilters(true)
            : null
        }
      />
      <GuestRatingSelector />
      <AccommodationSelector />
      <Button disabled={!hasUnappliedFilters} onClick={handleApplyingFilters}>
        Done
      </Button>
      <Button
        disabled={!hasUnappliedFilters && attributeFilterCount === 0}
        onClick={handleResettingFilters}
      >
        Reset
      </Button>
    </div>
  );
}
