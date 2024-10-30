"use client";

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
  urlParamKey,
  queryFunction,
  setSelectedData,
  shouldSplitParamValue = false,
  selectData, // allow selection of nested data
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramValue = searchParams.get(urlParamKey);

  // Conditionally process the parameter value
  // If shouldSplitParamValue is true, split the parameter by underscore
  // and take the last segment (pop).
  // Otherwise, use the parameter value as is.
  const processedValue = shouldSplitParamValue
    ? paramValue?.split("_").pop()
    : paramValue;

  const { data } = useQuery({
    queryKey: [urlParamKey, processedValue],
    queryFn: () => queryFunction(processedValue),
    enabled: !!processedValue,
  });

  // ensures the hook does not interfere with external selection logic
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    // Use the provided selectData function to extract the desired object
    const item = selectData ? selectData(data) : data?.[0] ?? null;

    if (item) {
      setSelectedData(item);
      hasInitialized.current = true;
    } else {
      // If no valid item is found remove the specified URL parameter (urlParamKey)
      const params = new URLSearchParams(searchParams);
      params.delete(urlParamKey);
      router.replace(`?${params.toString()}`);
    }
  }, [data, setSelectedData, selectData]);
}
