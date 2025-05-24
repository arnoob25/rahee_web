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
    type
    description
    location {
      _id
      address
      city
      state
      country
      zipCode
    }
    starRating
    reviewCount
    reviewScore
    availableRoomCount (checkInDate: "2025-02-12", checkOutDate: "2025-02-25")
    tags
    facilities
    policies
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
      bedType
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
