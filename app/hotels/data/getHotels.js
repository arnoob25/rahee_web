"use client";

import { useQueries, useQueryClient } from "@tanstack/react-query";
import { graphQLRequest } from "@/lib/api/graphql-client";
import { MIN_ALLOWED_PRICE, PRICE_CALCULATION_METHODS } from "../config";
import { differenceInDays } from "date-fns";
import { toast } from "sonner";

export default function useGetFilteredHotels(
  { roomConfigs, ...queryParams },
  shouldQuery = false
) {
  const queryClient = useQueryClient();

  const roomConfigsWithQueryKey = injectQueryKeysIntoRoomConfigs(
    roomConfigs,
    queryParams
  );

  const queries = useQueries({
    queries: roomConfigsWithQueryKey.map(({ adults, children, queryKey }) => ({
      queryKey,
      queryFn: () => getFilteredHotels({ ...queryParams, adults, children }),
      select: (data) => data.filterHotels,
      staleTime: 1000 * 60 * 30, // 30 minutes
      cacheTime: 1000 * 60 * 60 * 1, // 1 hour
      enabled: false,
    })),
  });

  function handleFilteringHotels() {
    if (!shouldQuery) {
      toast.warning("Pick your destination to find your ideal stay.");
      return;
    }

    // Start all queries and show detailed progress for each room
    queries.forEach((query, index) => {
      const roomConfig = roomConfigsWithQueryKey[index];
      const cachedData = queryClient.getQueryData(roomConfig.queryKey);

      if (cachedData) return;

      const guestInfo = formatGuestInfo(roomConfig.adults, roomConfig.children);

      // Show detailed search info for each room
      toast.info(`Searching hotels for Room ${index + 1}`, {
        description: `Looking for accommodations with ${guestInfo}`,
        duration: 3000,
      });

      // retry logic
      query.refetch().catch((error) => {
        toast.error(`Search failed for Room ${roomConfig.id}`, {
          description: `Could not find hotels for ${guestInfo}`,
        });
      });
    });
  }

  const hotelsGroupedByRoomConfig = queries.map((query, index) => {
    if (query.isLoading) return;

    return {
      ...roomConfigs[index],
      hotels: query.data ?? [],
    };
  });

  const hotelsForEveryRoomConfig = hotelsGroupedByRoomConfig.every(
    (room) => room?.hotels?.length > 0
  )
    ? getCommonHotelsById(hotelsGroupedByRoomConfig)
    : []; // no common hotels when one of them has no hotels

  const areAllFetched = queries.every((query) => query.isFetched);
  const isLoading = queries.some((query) => query.isLoading);

  return {
    isLoading: isLoading,
    isFetched: areAllFetched,
    commonHotels: hotelsForEveryRoomConfig ?? [],
    groupedHotels: hotelsGroupedByRoomConfig ?? [],
    getHotels: handleFilteringHotels,
  };
}

function getFilteredHotels({ priceCalcMethod, ...filters }) {
  const FILTER_HOTELS = `query FilterHotels($filters: FilterHotelsInput!, $checkInDate: String!, $checkOutDate: String!) {
    filterHotels(filters: $filters) {
      _id
      name
      description
      stars
      reviewScore
      reviewCount
      startingPrice
      facilities
      policies
      accommodationType
      availableRoomCount(checkInDate: $checkInDate, checkOutDate: $checkOutDate)
      media {
        _id
        caption
        isCover
        isFeatured
        url
      }
    }
  }`;

  const stayDuration = differenceInDays(
    filters.checkOutDate,
    filters.checkInDate
  );

  const queryVariables = {
    filters: {
      ...filters,
      // calculate what prices per night must be to account for total stay duration
      minPrice: adjustPriceForCalcMethod(
        filters.minPrice,
        stayDuration,
        priceCalcMethod
      ),
      maxPrice: adjustPriceForCalcMethod(
        filters.maxPrice,
        stayDuration,
        priceCalcMethod
      ),
    },
    checkInDate: filters.checkInDate,
    checkOutDate: filters.checkOutDate,
  };

  return graphQLRequest(FILTER_HOTELS, queryVariables);
}

function adjustPriceForCalcMethod(initialPrice, stayDuration, calcMethod) {
  const adjustedPrice =
    calcMethod === PRICE_CALCULATION_METHODS.TOTAL_STAY
      ? initialPrice / stayDuration
      : initialPrice;

  return adjustedPrice < MIN_ALLOWED_PRICE ? MIN_ALLOWED_PRICE : adjustedPrice;
}

function formatGuestInfo(adults, children) {
  const parts = [];
  if (adults > 0) {
    parts.push(`${adults} adult${adults !== 1 ? "s" : ""}`);
  }
  if (children > 0) {
    parts.push(`${children} child${children !== 1 ? "ren" : ""}`);
  }
  return parts.join(" and ");
}

function getCommonHotelsById(hotelsGroupedByRoomConfig) {
  const commonHotelIds = [];
  const totalRoomConfigs = hotelsGroupedByRoomConfig.length;
  const hotelIdToCountMap = new Map(); // track which ids appear how many times
  const hotelIdToDataMap = new Map(); // use to get the data using the id

  // count how many times each hotel appears in other rooms
  for (const room of hotelsGroupedByRoomConfig) {
    const hotelIdsInCurrentRoom = new Set(); // count each hotel once, per room config

    for (const { _id: id, ...rest } of room.hotels) {
      // Avoid counting duplicates from same room config
      if (!hotelIdsInCurrentRoom.has(id)) {
        hotelIdToCountMap.set(id, (hotelIdToCountMap.get(id) ?? 0) + 1);

        if (!hotelIdToDataMap.has(id)) {
          hotelIdToDataMap.set(id, rest);
        }

        hotelIdsInCurrentRoom.add(id);
      }
    }
  }

  // Filter out only hotels that appear in all room configs
  for (const [id, count] of hotelIdToCountMap.entries()) {
    if (count === totalRoomConfigs) {
      commonHotelIds.push(id);
    }
  }

  const commonHotels = commonHotelIds.map((id) => {
    const data = hotelIdToDataMap.get(id);
    return { _id: id, ...data };
  });

  return commonHotels ?? [];
}

function injectQueryKeysIntoRoomConfigs(roomConfigs, queryParams) {
  return roomConfigs.map((roomConfig) => ({
    ...roomConfig,
    queryKey: [
      "filtered_hotels",
      queryParams.city ?? queryParams.locationId,
      queryParams.checkInDate,
      queryParams.checkOutDate,
      roomConfig.adults,
      roomConfig.children,
      queryParams.minPrice,
      queryParams.maxPrice,
      queryParams.priceCalcMethod,
      queryParams.stars,
      queryParams.minRating,
      queryParams.accommodationTypes?.sort()?.join(","),
      queryParams.priceSort,
      queryParams.popularitySort,
      queryParams.tags?.sort()?.join(","),
      queryParams.facilities?.sort()?.join(","),
      queryParams.amenities?.sort()?.join(","),
    ],
  }));
}
