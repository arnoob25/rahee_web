"use client";

import { useQueries } from "@tanstack/react-query";
import { graphQLRequest } from "@/lib/api/graphql-client";
import { MIN_ALLOWED_PRICE, PRICE_CALCULATION_METHODS } from "../config";
import { differenceInDays } from "date-fns";
import { toast } from "sonner";

export default function useGetFilteredHotels(
  { roomConfigs, ...queryParams },
  shouldQuery = false
) {
  const queries = useQueries({
    queries: roomConfigs.map(({ id, adults, children }) => ({
      queryKey: ["filtered_hotels", id],
      queryFn: () => getFilteredHotels({ ...queryParams, adults, children }),
      select: (data) => data.filterHotels,
      enabled: false, // don't fetched automatically
    })),
  });

  const hotelsGroupedByRoomConfig = queries.map((query, index) => {
    const roomConfig = roomConfigs[index];

    return {
      ...roomConfig,
      hotels: query.data ?? [],
    };
  });

  const commonHotels = queries.every((q) => q.data)
    ? getCommonHotelsById(hotelsGroupedByRoomConfig)
    : [];

  const handleFilteringHotels = () => {
    if (!shouldQuery) {
      toast.warning("Pick your destination to find your ideal stay.");
      return;
    }

    // Start all queries and show detailed progress for each room
    queries.forEach((query, index) => {
      const roomConfig = roomConfigs[index];
      const guestInfo = formatGuestInfo(roomConfig.adults, roomConfig.children);

      // Show detailed search info for each room
      toast.info(`Searching hotels for Room ${index + 1}`, {
        description: `Looking for accommodations with ${guestInfo}`,
        duration: 3000,
      });

      // Start the query
      query.refetch().catch((error) => {
        toast.error(`Search failed for Room ${roomConfig.id}`, {
          description: `Could not find hotels for ${guestInfo}`,
        });
      });
    });
  };

  return {
    isLoading: false, // TODO properly implement the loading process
    commonHotels,
    groupedHotels: hotelsGroupedByRoomConfig,
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
    const hotelsInCurrentRoom = new Set();

    for (const { _id: id, ...rest } of room.hotels) {
      // Avoid counting duplicates from same room config
      if (!hotelsInCurrentRoom.has(id)) {
        hotelIdToCountMap.set(id, (hotelIdToCountMap.get(id) ?? 0) + 1);

        if (!hotelIdToDataMap.has(id)) {
          hotelIdToDataMap.set(id, rest);
        }

        hotelsInCurrentRoom.add(id); // track counted hotels
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
