import { graphQLRequest } from "@/lib/graphqlClient";

// paginate this query using offset and limit results
export const getFilteredHotels = (
  locationId,
  adults,
  children,
  checkInDate,
  checkOutDate
) => {
  const totalGuests = Number(adults) + Number(children);

  return graphQLRequest(
    `query MyQuery($locationId: Hotel_listing_UuidBoolExp = {_eq: ""}, $maxAdults: Hotel_listing_Int8BoolExp = {_gte: ""}, $complementaryChild: Hotel_listing_Int8BoolExp = {_gte: ""}, $maxGuests: Hotel_listing_Int8BoolExp = {_gte: ""}, $desiredCheckIn: Hotel_listing_Date = "", $desiredCheckOut: Hotel_listing_Date = "") {
      hotel_listing_hotels(
        where: {_and: {location: {locationId: $locationId}, roomTypes: {maxAdults: $maxAdults, complementaryChild: $complementaryChild, maxGuests: $maxGuests, rooms: {reservations: {_and: {status: {_eq: "Pending"}, _or: [{checkOutDate: {_lte: $desiredCheckIn}}, {checkInDate: {_gte: $desiredCheckOut}}]}}}}}}
      ) {
          hotelId
          name
          starRating
          reviewScore
          hotelTagAttributesLinks {
            tagId
          }
          hotelFacilitiesLinks {
            facilityId
          }
          roomTypes {
            pricePerNight
          }
        }
      }`,
    {
      locationId: {
        _eq: locationId,
      },
      maxAdults: {
        _gte: adults,
      },
      complementaryChild: {
        _gte: children,
      },
      maxGuests: {
        _gte: totalGuests,
      },
      desiredCheckIn: checkInDate,
      desiredCheckOut: checkOutDate,
    }
  );
};

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

export const getAllFilters = () =>
  graphQLRequest(
    `query MyQuery {
      hotel_listing_tags {
        tagId
        name
      }
      hotel_listing_facilityCategories(where: {}) {
        categoryId
        name
        description
        facilities(where: {isStandard: {_eq: "true"}}) {
          categoryId
          facilityId
          name
          description
        }
      }
      hotel_listing_amenities(where: {isStandard: {_eq: "true"}}) {
        amenityId
        name
        description
      }
    }`
  );
