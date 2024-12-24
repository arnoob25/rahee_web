import { graphQLRequest } from "../../lib/api/graphql-client";

export const getLocationById = (locationId) =>
  graphQLRequest(
    `query Request($locationId: Hotel_listing_UuidBoolExp = {_eq: ""}) {
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
