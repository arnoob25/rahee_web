import { graphQLRequest } from "@/lib/api/graphql-client";

export const getHotelDetails = (hotelId) =>
  graphQLRequest(
    `query Request($hotelId: Hotel_listing_UuidBoolExp = {_eq: ""}) {
      hotel_listing_hotels(where: {hotelId: $hotelId}, limit: 1) {
        hotelId
        name
        description
        address
        contactInfo
        starRating
        reviewScore
        media {
          mediaId
          url
          isCover
          isFeatured
        }
        roomTypes {
          roomCategoryId
          roomTypeId
          name
          pricePerNight
          maxAdults
          maxGuests
          complementaryChild
          bedTypeId
          media {
            mediaId
            url
            isCover
            isFeatured
          }
          roomAmenitiesLinks {
            amenity {
              amenityId
              name
              description
            }
          }
          rooms {
            reservations(where: {status: {_eq: "Pending"}}) {
              checkInDate
              checkOutDate
            }
          }
          roomsAggregate {
            _count
          }
        }
        hotelTagAttributesLinks(where: {tag: {isActive: {_eq: "true"}}}) {
          tag {
            tagId
            name
            description
          }
        }
        hotelFacilitiesLinks {
          facility {
            facilityCategory {
              categoryId
              name
              description
            }
            facilityId
            name
            description
          }
        }
      }
    }`,
    { hotelId: { _eq: hotelId } }
  );

export const getRoomCategories = () =>
  graphQLRequest(
    `query MyQuery {
      hotel_listing_roomCategories {
        categoryId
        name
        description
      }
    }`
  );
