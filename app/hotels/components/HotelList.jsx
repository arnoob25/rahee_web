"use client";

import { HotelCard } from "./HotelCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState, useEffect, useRef } from "react";
import { HotelListSkeleton } from "./skeletons/HotelListSkeleton";

export default function HotelList({
  commonHotels = [],
  groupedHotels = [],
  isFetched,
  isLoading,
}) {
  const [activeTab, setActiveTab] = useState(null);
  const hasSetActiveTabRef = useRef(false);

  // set first tab with results as active
  useEffect(() => {
    if (hasSetActiveTabRef.current || isLoading) return; // only set once

    let activeTabValue = null;

    if (commonHotels.length > 0) {
      activeTabValue = "common";
    } else if (groupedHotels.length > 0) {
      activeTabValue =
        groupedHotels.find((group) => group.hotels.length > 0)?.id ?? null;
    }

    if (activeTabValue === null) return;

    hasSetActiveTabRef.current = true;
    setActiveTab(activeTabValue);
  }, [commonHotels.length, groupedHotels, isLoading]);

  const multipleRoomConfigExists = groupedHotels.length > 1;

  if (isLoading) return <HotelListSkeleton />;

  return (
    <>
      {isFetched ? (
        <>
          {!multipleRoomConfigExists && (
            <div className="w-full">
              <span className="min-w-fit px-3 gap-2 whitespace-nowrap">
                {`${
                  groupedHotels[0]?.hotels?.length > 0
                    ? groupedHotels[0]?.hotels?.length
                    : "No"
                } accommodation${
                  groupedHotels[0]?.hotels?.length === 1 ? "" : "s"
                } found`}
              </span>

              <div className="flex flex-col gap-4 mt-5">
                {groupedHotels[0]?.hotels.map((hotel) => (
                  <HotelCard key={hotel._id} hotelData={hotel} />
                ))}
              </div>
            </div>
          )}

          {multipleRoomConfigExists && (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="h-fit flex justify-start items-baseline px-3 gap-2">
                <span className="text-base min-w-fit whitespace-nowrap">
                  Accommodations found:{" "}
                </span>

                <div className="overflow-x-auto h-fit scrollbar-hide">
                  <TabsList className="bg-transparent h-fit p-0 inline-flex">
                    <TabsTrigger
                      value="common"
                      className="border-none py-0 my-0 text-base text-muted-foreground/80 shadow-none data-[state=active]:font-extrabold"
                      disabled={commonHotels.length <= 0}
                    >
                      {`Common (${
                        commonHotels.length > 0 ? commonHotels.length : "None"
                      })`}
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
                            ? `, ${children} ${
                                children > 1 ? "children" : "child"
                              }`
                            : ""
                        } (${hotels.length > 0 ? hotels.length : "None"})`}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>

              <div className="mt-5">
                <TabsContent value="common">
                  <div className="flex flex-col gap-4">
                    {commonHotels.map((hotel) => (
                      <HotelCard key={hotel._id} hotelData={hotel} />
                    ))}
                  </div>
                </TabsContent>

                {groupedHotels.map((group) => (
                  <TabsContent key={group.id} value={group.id}>
                    <div className="flex flex-col gap-4">
                      {group.hotels.map((hotel) => (
                        <HotelCard key={hotel._id} hotelData={hotel} />
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          )}
        </>
      ) : (
        <span>Search to find your next stay</span>
      )}
    </>
  );
}
