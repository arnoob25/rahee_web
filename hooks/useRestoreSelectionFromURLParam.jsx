"use client";

import { splitAndGetPart } from "@/lib/stringParsers";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * A generalized hook to restore state from URL parameters.
 *
 * @param {Object} params - The parameters for the hook.
 * @param {string} params.urlParamKey - The key of the URL parameter to look for.
 * @param {Function} params.queryFunction - The function to fetch data based on the URL parameter.
 * @param {Function} params.setSelectedData - The function to set the selected data in the component.
 * @param {boolean} [params.shouldSplitParamValue=false] - Indicates whether to split the parameter value by underscore and use the last segment.
 * @param {Function} [params.selectData] - A function to extract the desired object from the fetched data.
 */
export default function useRestoreFromURLParam({
  urlParamKey = "",
  queryFunction = () => {},
  setSelectedData = () => {},
  shouldSplitParamValue = false,
  selectData = null, // allow selection of nested data
  shouldQuery = false,
}) {
  // ensures the hook does not interfere with external selection logic
  const hasInitialized = useRef(false);
  const router = useRouter();
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

  // set the data directly if query not required
  if (!shouldQuery) {
    if (!processedValue) clearURLParam();
    setSelectedData(urlParamKey, processedValue);
  }

  // query for the data when needed
  const { data, error } = useQuery({
    queryKey: [urlParamKey, processedValue],
    queryFn: () => queryFunction(processedValue),
    enabled: shouldQuery && !!processedValue,
  });

  // set the queried data
  useEffect(() => {
    if (hasInitialized.current) return;
    // Use the provided selectData function to extract the desired object
    const item = selectData ? selectData(data) : data?.[0] ?? null;

    if (item) {
      setSelectedData(item);
      hasInitialized.current = true;
    } else if (!item && error && processedValue) {
      // Clear the URL parameter if no data found and there was an error
      clearURLParam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setSelectedData, selectData]);
}
