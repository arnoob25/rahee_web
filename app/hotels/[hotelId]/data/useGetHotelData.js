import { useQuery } from "@tanstack/react-query";
import { graphQLRequest } from "@/lib/api/graphql-client";

export function useGetHotelData(hotelId) {
  const query = useQuery({
    queryKey: ["hotelData", hotelId],
    queryFn: () =>
      graphQLRequest(GET_HOTEL_DATA, {
        hotelId: hotelId,
      }),
    enabled: !!hotelId,
    select: (data) => data?.findOneHotel,
  });
  return query;
}

const GET_HOTEL_DATA = `query getHotelData ($hotelId: String!) {
  findOneHotel (id: $hotelId) {
    _id
    name
    description
    address
    star_rating
    review_score
    tags
    facilities
    media {
      _id
      type
      url
      is_cover
      is_featured
    }
    roomTypes {
      _id
      room_category
    	name
      price_per_night
      max_adults
      complementary_child
      roomCount
      amenities
      media {
        _id
        type
        url
        is_cover
        is_featured
      }
    }
  }
}`;
