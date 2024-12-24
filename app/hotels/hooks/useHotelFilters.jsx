"use client";

import { useEffect, useState, useMemo } from "react";
import { useGetAllFilters } from "../data/useGetAllFilters";

// TODO provide comments for improved readability
function useExtractSelectedFilterNames(categories = [], selectedFilters = new Set()) {
  const [selectedFilterNames, setSelectedFilterNames] = useState([]);

  const categoriesMap = useMemo(() => {
    if (!categories) return new Map();
    return new Map(
      categories.flatMap((category) =>
        category.options.map((option) => [option.id, option])
      )
    );
  }, [categories]);

  useEffect(() => {
    const names = Array.from(selectedFilters)
      .map((id) => {
        const option = categoriesMap.get(id);
        return option ? { id, name: option.name } : null;
      })
      .filter(Boolean);

    // Only update if the names have actually changed to avoid re-rendering loops
    setSelectedFilterNames((prevNames) => {
      const areEqual =
        prevNames.length === names.length &&
        prevNames.every((item, index) => item.id === names[index].id);

      return areEqual ? prevNames : names;
    });
  }, [selectedFilters, categoriesMap]);

  return selectedFilterNames;
}

// TODO explicitly define the function of the hook
export function useHotelFilters(selectedFilters) {
  const { filters, error, isLoading } = useGetAllFilters();
  const selectedFilterNames = useExtractSelectedFilterNames(filters, selectedFilters);

  return { filters, selectedFilterNames, error, isLoading };
}
