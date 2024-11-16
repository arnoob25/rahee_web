export function transformQueryDataForFilterWithCategories(data) {
  const tagFilters = data?.hotel_listing_tags?.map((tag) => ({
    id: tag.tagId,
    name: tag.name,
    //description: tag.description,
  }));

  const facilityFilter =
    data?.hotel_listing_facilityCategories?.map((category) => ({
      id: category.categoryId,
      title: category.name,
      //description: category.description,
      options:
        category.facilities?.map((facility) => ({
          id: facility.facilityId,
          name: facility.name,
          //description: facility.description,
        })) ?? [],
    })) ?? [];

  const amenityFilters = data?.hotel_listing_amenities?.map((amenity) => ({
    id: amenity.amenityId,
    name: amenity.name,
    description: amenity.description,
  }));

  return [
    {
      id: "tags",
      title: "Tags",
      options: tagFilters,
    },
    ...facilityFilter,
    { id: "amenity", title: "Amenities", options: amenityFilters },
  ];
}
