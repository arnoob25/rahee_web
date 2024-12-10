import { graphQLRequest } from "@/api/graphql-client";

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
    `query Request($locationId: Hotel_listing_UuidBoolExp = {_eq: ""}, $maxAdults: Hotel_listing_Int8BoolExp = {_gte: ""}, $complementaryChild: Hotel_listing_Int8BoolExp = {_gte: ""}, $maxGuests: Hotel_listing_Int8BoolExp = {_gte: ""}, $desiredCheckIn: Hotel_listing_Date = "", $desiredCheckOut: Hotel_listing_Date = "") {
      hotel_listing_hotels(
        where: {_and: {location: {locationId: $locationId}, roomTypes: {maxAdults: $maxAdults, complementaryChild: $complementaryChild, maxGuests: $maxGuests, rooms: {reservations: {_and: {status: {_eq: "Pending"}, _or: [{checkOutDate: {_lte: $desiredCheckIn}}, {checkInDate: {_gte: $desiredCheckOut}}]}}}}}},
        order_by: {starRating: Desc}
      ) {
          hotelId
          name
          description
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

export const getAllFilters = () =>
  graphQLRequest(
    `query Request {
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
