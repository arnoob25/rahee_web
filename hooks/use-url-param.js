"use client";

import { splitAndGetPart } from "@/lib/string-parsers";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * A generalized hook to restore state from URL parameters.
 *
 * @param {Object} params - The parameters for the hook.
 * @param {string} params.urlParamKey - The key of the URL parameter to look for.
 * @param {Function} params.queryFunction - The function to fetch location based on the URL parameter.
 * @param {Function} params.setSelectedLocation - The function to set the selected location in the component.
 * @param {boolean} [params.shouldSplitParamValue=false] - Indicates whether to split the parameter value by underscore and use the last segment.
 * @param {Function} [params.selectLocation] - A function to extract the desired object from the fetched location.
 */
export function useRestoreLocationFromURLParam({
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
  const searchParams = useSearchParams();
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

export function useUrlParamAsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setUrlFilters = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`?${params.toString()}`);
  };

  const getUrlFilter = (key) => {
    return searchParams.get(key);
  };

  return {
    setUrlFilters,
    getUrlFilter,
  };
}
