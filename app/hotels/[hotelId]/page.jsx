"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";
import { getHotelDetails } from "../queryFunctions";

const Page = () => {
  const { hotelId } = useParams();
  const { data } = useQuery({
    queryKey: ["hotelDetails", hotelId],
    queryFn: getHotelDetails(hotelId),
    enabled: !!hotelId,
  });

  const hotelData = useMemo(() => data?.hotel_listing_hotels[0], [data]) || {};

  return <div>This is the {hotelData?.name || "unknown"}</div>;
};

export default Page;
