import { useQuery } from "@tanstack/react-query";
import { FILTER_TYPES } from "../config";
import { graphQLRequest } from "@/lib/api/graphql-client";

// TODO revise based on what the output is
export function useGetAllFilters() {
  const {
    data: filters,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["filters"],
    queryFn: () => getAllFilters(),
    select: transformQueryDataForFilterWithCategories,
  });

  return { filters, error, isLoading };
}

const getAllFilters = () =>
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

function transformQueryDataForFilterWithCategories(data) {
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
