"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function useURLParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  function updateURL() {
    router.replace(`?${params.toString()}`);
  }

  function getParamByKey(paramKey, fallbackValue = null) {
    return searchParams.get(paramKey) ?? fallbackValue;
  }

  function updateURLParam(paramKey, paramValue, shouldUpdateURL = true) {
    if (paramValue === null || paramValue === undefined) {
      params.delete(paramKey);
    } else {
      params.set(paramKey, paramValue);
    }

    if (shouldUpdateURL) updateURL();
  }

  function updateURLParamArray(paramKey, newArray, shouldUpdateURL = true) {
    // Initialize parameter values from provided array
    const paramValues = new Set(newArray);

    // Set the updated parameter value
    if (paramValues.size > 0) {
      params.set(paramKey, Array.from(paramValues).join(","));
    } else {
      // If all values are deleted, remove the parameter or set to empty string
      params.delete(paramKey);
    }

    if (shouldUpdateURL) updateURL();
  }

  function deleteURLParam(paramKey, shouldUpdateURL = true) {
    params.delete(paramKey);

    if (shouldUpdateURL) updateURL();
  }

  return {
    getParamByKey,
    updateURLParam,
    updateURLParamArray,
    deleteURLParam,
    updateURL,
  };
}
