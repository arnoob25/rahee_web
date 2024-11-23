import { useQuery } from "@tanstack/react-query";
import { getFilteredHotels } from "../queryFunctions";
import { useSearchParams } from "next/navigation";
import { compareDates } from "@/lib/dateParsers";
import { splitAndGetPart } from "@/lib/stringParsers";
import { INTERNAL_DATE_FORMAT } from "@/config/dateFormats";
import { useEffect } from "react";

export default function useFetchFilteredHotelsFromURL() {
  const searchParams = useSearchParams();

  const locationParam = searchParams.get("location");
  const locationId = splitAndGetPart(locationParam, "_", "last");
  const checkInDate = searchParams.get("fromDate");
  const checkOutDate = searchParams.get("toDate");
  const rooms = searchParams.get("rooms") ?? 1;
  const adultGuests = searchParams.get("adults") ?? 0;
  const childGuests = searchParams.get("children") ?? 0;
  let isCheckInBeforeCheckOut = false;

  if (checkInDate && checkOutDate) {
    isCheckInBeforeCheckOut = compareDates(
      checkInDate,
      checkOutDate,
      INTERNAL_DATE_FORMAT,
      "before"
    );
  }

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "hotelList",
      locationId,
      adultGuests,
      childGuests,
      checkInDate,
      checkOutDate,
    ],
    queryFn: () =>
      getFilteredHotels(
        locationId,
        adultGuests,
        childGuests,
        checkInDate,
        checkOutDate
      ),
    select: (data) => data?.hotel_listing_hotels,
    enabled: !!locationId && isCheckInBeforeCheckOut,
  });

  useEffect(() => {
    refetch();
  }, [
    locationId,
    checkInDate,
    checkOutDate,
    rooms,
    adultGuests,
    childGuests,
    refetch,
  ]);

  return { data, isLoading, error };
}
