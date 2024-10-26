'use client'

import { useRouter, useSearchParams } from "next/navigation";

export const useUrlParamAsFilter = () => {
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
};
