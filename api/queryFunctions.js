export const getLocationsByName = (name) =>
  graphQLRequest(
    `query Request($name: Hotel_listing_VarcharBoolExp = {_ilike: ""}) {
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
