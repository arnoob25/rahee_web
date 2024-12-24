import { useQuery } from "@tanstack/react-query";
import { getHotelDetails } from "./queryFunctions";
import { mockHotelData } from "./mockData";

// TODO remove mock data, and conditionally enable the query
export function useGetHotelDetails(hotelId) {
  const { data: hotelData, error } = useQuery({
    queryKey: ["hotelDetails", hotelId],
    queryFn: () => getHotelDetails(hotelId),
    enabled: false, // !!hotelId,
    select: (data) => data?.hotel_listing_hotels[0],
    initialData: mockHotelData,
  });

  return [hotelData, error];
}
