import { useQuery } from "@tanstack/react-query";
import { getRoomCategories } from "./queryFunctions";

export function useGetRoomCategories() {
  const { data: roomCategories = [], isLoading } = useQuery({
    queryKey: ["roomCategories"],
    queryFn: async () => getRoomCategories(),
    select: (data) => data?.hotel_listing_roomCategories,
  });

  return [roomCategories, isLoading];
}
