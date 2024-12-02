"use client";

import { getAllFilters } from "../api/queryFunctions.js";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import { transformQueryDataForFilterWithCategories } from "../utils.js";

function useFetchFilters() {
  const {
    data: categories,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["filters"],
    queryFn: () => getAllFilters(),
    select: transformQueryDataForFilterWithCategories,
  });

  return { categories, error, isLoading };
}

// TODO: provide a name that describes that it extract
function useSelectedFilters(categories = [], selectedFilters = new Set()) {
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

export function useFilters(selectedFilters) {
  const { categories, error, isLoading } = useFetchFilters();
  const selectedFilterNames = useSelectedFilters(categories, selectedFilters);

  return { categories, selectedFilterNames, error, isLoading };
}
