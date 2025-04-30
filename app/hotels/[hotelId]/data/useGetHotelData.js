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
    starRating
    reviewCount
    reviewScore
    tags
    facilities
    media {
      _id
      type
      url
      isCover
      isFeatured
    }
    roomTypes {
      _id
      roomCategory
    	name
      pricePerNight
      maxAdults
      complementaryChild
      roomCount
      amenities
      media {
        _id
        type
        url
        isCover
        isFeatured
      }
    }
    reviews {
			_id
      rating
      content
      createdAt
      author {
        username
      }
    }
  }
}`;
