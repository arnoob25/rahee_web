"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

function useRestoreGuestsFromURL(setRooms) {
  const searchParams = useSearchParams();
  const hasRestored = useRef(false); // Track if restoration has happened

  useEffect(() => {
    if (hasRestored.current) return; // Only run once on initial mount

    const roomsParam = searchParams.get("rooms");
    const adultsParam = searchParams.get("adults");
    const childrenParam = searchParams.get("children");

    if (roomsParam && adultsParam) {
      const roomsCount = parseInt(roomsParam, 10);
      const adultsArray = adultsParam.split(",").map(Number);
      const childrenArray = childrenParam
        ? childrenParam.split(",").map(Number)
        : [];

      const rooms = Array.from({ length: roomsCount }, (_, index) => ({
        id: index + 1,
        adults: adultsArray[index] || 0,
        children: childrenArray[index] || 0,
      }));

      setRooms(rooms);
      hasRestored.current = true; // Mark as restored
    }
  }, [searchParams, setRooms]);
}

export default useRestoreGuestsFromURL;
