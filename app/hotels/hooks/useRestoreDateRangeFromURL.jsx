"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { parse, isValid } from "date-fns";

const useRestoreDateRangeFromURL = ({
  fromDateKey,
  toDateKey,
  setDates,
  dateFormat = "dd-MM-yyyy",
}) => {
  const searchParams = useSearchParams();
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

    if (fromDate && isValid(fromDate) && toDate && isValid(toDate)) {
      setDates({ from: fromDate, to: toDate });
    }

    hasInitialized.current = true; // Set to true after the initial load
  }, [searchParams, fromDateKey, toDateKey, setDates, dateFormat]);
};

export default useRestoreDateRangeFromURL;
