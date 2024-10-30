import { graphQLRequest } from "@/lib/graphqlClient";


// paginate this query using offset and limit results
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

export const getLocationsByName = (name) =>
  graphQLRequest(
    `query MyQuery($name: Hotel_listing_VarcharBoolExp = {_ilike: ""}) {
      hotel_listing_locations(limit: 5, where: {name: $name}, order_by: {name: Asc}) {
        locationId
        name
        type
        region
        country
      }
    }`,
    { name: { _ilike: `%${name}%` } }
  );

export const getLocationById = (locationId) =>
  graphQLRequest(
    `query MyQuery($locationId: Hotel_listing_UuidBoolExp = {_eq: ""}) {
      hotel_listing_locations(limit: 1, where: {locationId: $locationId}) {
        locationId
        name
        type
        region
        country
      }
    }`,
    { locationId: { _eq: locationId } }
  );
