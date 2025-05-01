"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function useURLParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  function getParamByKey(paramKey, fallbackValue = null) {
    return searchParams.get(paramKey) ?? fallbackValue;
  }

  function updateURLParam(paramName, paramValue, shouldUpdateURL = true) {
    params.set(paramName, paramValue);

    if (shouldUpdateURL) router.replace(`?${params.toString()}`);
  }

  function deleteURLParam(paramName, shouldUpdateURL = true) {
    params.delete(paramName);

    if (shouldUpdateURL) router.replace(`?${params.toString()}`);
  }

  function updateURL() {
    router.replace(`?${params.toString()}`);
  }

  return { getParamByKey, updateURLParam, deleteURLParam, updateURL };
}
