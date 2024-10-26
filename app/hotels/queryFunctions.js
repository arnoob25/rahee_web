import { graphQLRequest } from "@/lib/graphql-client";

export const getFilteredHotels = (nameFilter) =>
  graphQLRequest(
    `query MyQuery($name: Hotel_listing_VarcharBoolExp!) {
      hotel_listing_hotels(where: {name: $name}) {
        hotelId
        name
      }
    }`,
    { name: { _ilike: `%${nameFilter}%` } }
  );

export const getHotelDetails = (hotelId) =>
  graphQLRequest(
    `query MyQuery($hotelId: Hotel_listing_UuidBoolExp = {_eq: ""}) {
      hotel_listing_hotels(where: {hotelId: $hotelId}, limit: 1) {
        hotelId
        name
        description
      }
    }`,
    { hotelId: { _eq: hotelId } }
  );
