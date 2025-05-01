import { graphQLRequest } from "@/lib/api/graphql-client";
import { useQuery } from "@tanstack/react-query";

export function useGetHotels() {
  const query = useQuery({
    queryKey: ["hotelList"],
    queryFn: () => graphQLRequest(GET_HOTELS),
    select: (data) => data?.findHotels,
  });

  return query;
}

const GET_HOTELS = `query getHotels {
  findHotels {
    _id
    name
    description
    starRating
    reviewScore
    reviewCount
    startingPrice
    facilities
    policies
    availableRoomCount
    media {
      _id
      caption
      isCover
      isFeatured
      url
    }
  }
}`;
