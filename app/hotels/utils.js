import { FILTER_TYPES, PRICE_CALCULATION_METHODS } from "./config";

export function transformQueryDataForFilterWithCategories(data) {
  const tagFilters = data?.hotel_listing_tags?.map((tag) => ({
    id: tag.tagId,
    name: tag.name,
    description: tag.description,
  }));

  const facilityFilter =
    data?.hotel_listing_facilityCategories?.map((category) => ({
      type: FILTER_TYPES.checkbox,
      id: category.categoryId,
      title: category.name,
      description: category.description,
      options:
        category.facilities?.map((facility) => ({
          id: facility.facilityId,
          name: facility.name,
          description: facility.description,
        })) ?? [],
    })) ?? [];

  const amenityFilters = data?.hotel_listing_amenities?.map((amenity) => ({
    id: amenity.amenityId,
    name: amenity.name,
    description: amenity.description,
  }));

  return [
    {
      type: FILTER_TYPES.checkbox,
      id: "tags",
      title: "Tags",
      options: tagFilters,
    },
    {
      type: FILTER_TYPES.selection,
      id: "rating",
      title: "Hotel Rating",
      options: [1, 2, 3, 4, 5],
    },
    ...facilityFilter,
    {
      type: FILTER_TYPES.checkbox,
      id: "amenity",
      title: "Amenities",
      options: amenityFilters,
    },
  ];
}

function extractHotelFeatureIds(hotel) {
  const tagIds = hotel?.hotelTagAttributesLinks ?? [];
  const facilityIds = hotel?.hotelFacilitiesLinks ?? [];
  const amenityIdsForEachRoomType = hotel?.roomTypes?.flatMap(
    (roomType) => roomType?.roomAmenitiesLinks ?? []
  );
  return new Set([...tagIds, ...facilityIds, ...amenityIdsForEachRoomType]);
}

function extractHotelPriceRange(hotel) {
  if (!hotel?.roomTypes || hotel.roomTypes.length === 0) {
    return { lowest: null, highest: null };
  }
  const prices = hotel.roomTypes
    .map((room) => room.pricePerNight)
    .filter(Boolean);
  return {
    lowest: Math.min(...prices),
    highest: Math.max(...prices),
  };
}

function filterByPrice(hotelPriceRange, stayDuration, pricingFilter) {
  const { range, method } = pricingFilter;

  if (!hotelPriceRange.lowest || !hotelPriceRange.highest) return false;

  const minPrice = range[0];
  const maxPrice = range[1];

  switch (method) {
    case PRICE_CALCULATION_METHODS.night:
      return (
        hotelPriceRange.lowest >= minPrice &&
        hotelPriceRange.highest <= maxPrice
      );
    case PRICE_CALCULATION_METHODS.totalStay: {
      const lowestTotal = hotelPriceRange.lowest * stayDuration;
      const highestTotal = hotelPriceRange.highest * stayDuration;
      return lowestTotal >= minPrice && highestTotal <= maxPrice;
    }
    default:
      return false;
  }
}

export function filterHotels(hotels, stayDuration, filters) {
  return hotels.filter((hotel) => {
    const hotelPriceRange = extractHotelPriceRange(hotel);
    const hotelFeatureIds = extractHotelFeatureIds(hotel);
    const hotelRating = Math.round(parseFloat(hotel?.starRating)) ?? null;
    const guestRating = parseFloat(hotel?.reviewScore) ?? null;

    const doesFeaturesExist = filters.FilterSelector.every((featureId) =>
      hotelFeatureIds.has(featureId)
    );

    // match hotel by exact star rating
    const doesHotelRatingMatch = filters.hotelRating
      ? filters.hotelRating === hotelRating
      : true;

    // match hotel on or above selected guest rating
    const doesGuestRatingMatch = filters.guestRating
      ? filters.guestRating < guestRating
      : true;

    const doesPriceMatch = filterByPrice(
      hotelPriceRange,
      stayDuration,
      filters.hotelPricing
    );

    return (
      doesFeaturesExist &&
      doesHotelRatingMatch &&
      doesGuestRatingMatch &&
      doesPriceMatch
    );
  });
}

const sortByReviewScore = (hotels, isDescending) =>
  hotels.sort((a, b) =>
    isDescending ? b.reviewScore - a.reviewScore : a.reviewScore - b.reviewScore
  );

const sortByPrice = (hotels, isDescending) =>
  hotels.sort((a, b) => {
    const priceA = extractHotelPriceRange(a).lowest ?? Infinity;
    const priceB = extractHotelPriceRange(b).lowest ?? Infinity;
    return isDescending ? priceB - priceA : priceA - priceB;
  });

export function sortHotels(hotels, sortingOptions) {
  const { criteria, isDescending } = sortingOptions;

  let sortedHotels = hotels;

  if (criteria.reviewScore) {
    sortedHotels = sortByReviewScore(sortedHotels, isDescending);
  }

  if (criteria.price) {
    sortedHotels = sortByPrice(sortedHotels, isDescending);
  }

  return sortedHotels;
}
