"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { parse, isValid } from "date-fns";

const useRestoreDateRangeFromURL = ({
  fromDateKey,
  toDateKey,
  setDates,
  dateFormat = "yyyy-MM-dd",
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasInitialized = useRef(false); // Track if initial load has happened

  useEffect(() => {
    // Only run on the first render
    if (hasInitialized.current) return;

    const fromDateString = searchParams.get(fromDateKey);
    const toDateString = searchParams.get(toDateKey);

    const fromDate = fromDateString
      ? parse(fromDateString, dateFormat, new Date())
      : null;
    const toDate = toDateString
      ? parse(toDateString, dateFormat, new Date())
      : null;

    const isFromDateValid = fromDate && isValid(fromDate);
    const isToDateValid = toDate && isValid(toDate);

    // Set dates if both dates are valid
    if (isFromDateValid && isToDateValid) {
      setDates({ from: fromDate, to: toDate });
    } else {
      // Create a new URLSearchParams instance to modify the parameters
      const newSearchParams = new URLSearchParams(searchParams);

      // Delete invalid parameters
      if (!isFromDateValid) newSearchParams.delete(fromDateKey);
      if (!isToDateValid) newSearchParams.delete(toDateKey);

      // Update the URL with modified parameters
      router.replace(`?${newSearchParams.toString()}`);
    }

    hasInitialized.current = true; // Set to true after the initial load
  }, [searchParams, fromDateKey, toDateKey, setDates, dateFormat, router]);
};

export default useRestoreDateRangeFromURL;
