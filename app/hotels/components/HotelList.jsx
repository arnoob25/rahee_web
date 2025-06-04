"use client";

import { useState, useEffect, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HotelCard } from "./HotelCard";
import { HotelListSkeleton } from "./skeletons/HotelListSkeleton";

export default function FilteredHotels({
  commonHotels = [],
  groupedHotels = [],
  isFetched,
  isLoading,
}) {
  const [activeTab, setActiveTab] = useState(null);
  const hasSetActiveTabRef = useRef(false);

  // first tab with results is active
  useEffect(() => {
    if (hasSetActiveTabRef.current || isLoading || !isFetched) return;

    let active = null;

    if (commonHotels.length > 0) {
      active = "common";
    } else {
      active = groupedHotels.find((g) => g.hotels.length > 0)?.id ?? null;
    }

    if (active !== null) {
      setActiveTab(active);
    }
  }, [commonHotels.length, groupedHotels, isFetched, isLoading]);

  if (isLoading) return <HotelListSkeleton />;

  if (!isFetched) return <span>Search to find your next stay</span>;

  // only one room config
  if (!groupedHotels.length > 1) {
    const hotels = groupedHotels[0]?.hotels ?? [];
    const hotelsCount = hotels.count;
    return (
      <div className="w-full">
        <span className="min-w-fit px-3 gap-2 whitespace-nowrap">
          {hotelsCount > 0
            ? `${hotelsCount} accommodation${
                hotelsCount === 1 ? "" : "s"
              } found`
            : "No accommodations found"}
        </span>
        <HotelList hotels={hotels} />
      </div>
    );
  }

  // separate tabs for each room-guest configuration
  return (
    <ResultsTabs
      commonHotels={commonHotels}
      groupedHotels={groupedHotels}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
}

function ResultsTabs({
  commonHotels = [],
  groupedHotels = [],
  activeTab,
  onTabChange,
}) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="h-fit flex justify-start items-baseline px-3 gap-2">
        <span className="text-base min-w-fit whitespace-nowrap">
          Accommodations found:
        </span>

        <div className="overflow-x-auto h-fit scrollbar-hide">
          <TabsList className="bg-transparent h-fit p-0 inline-flex">
            <TabsTrigger
              value="common"
              className="border-none py-0 my-0 text-base text-muted-foreground/80 shadow-none data-[state=active]:font-extrabold"
              disabled={commonHotels.length <= 0}
            >
              {`Common (${commonHotels.length || "None"})`}
            </TabsTrigger>

            {groupedHotels.map(({ id, adults, children, hotels }) => (
              <TabsTrigger
                key={id}
                value={id}
                className="border-none py-0 my-0 text-base text-muted-foreground/80 shadow-none data-[state=active]:font-extrabold"
                disabled={hotels.length <= 0}
              >
                {`${adults} ${adults > 1 ? "adults" : "adult"}${
                  children
                    ? `, ${children} ${children > 1 ? "children" : "child"}`
                    : ""
                } (${hotels.length || "None"})`}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>

      <div className="mt-5">
        <TabsContent value="common">
          <HotelList hotels={commonHotels} />
        </TabsContent>

        {groupedHotels.map((group) => (
          <TabsContent key={group.id} value={group.id}>
            <HotelList hotels={group.hotels} />
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}

function HotelList({ hotels = [] }) {
  return (
    <div className="flex flex-col gap-4 mt-5">
      {hotels.map((hotel) => (
        <HotelCard key={hotel._id} hotelData={hotel} />
      ))}
    </div>
  );
}
