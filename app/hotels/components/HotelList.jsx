"use client";

import { useURLParams } from "@/hooks/use-url-param";
import { HotelCard } from "./HotelCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

export default function HotelList({ commonHotels, groupedHotels, isLoading }) {
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const { updateURLParam } = useURLParams();

  const handleHotelSelection = (hotelId) => {
    if (hotelId === selectedHotelId) return;
    updateURLParam("hotel", hotelId);
    setSelectedHotelId(hotelId);
  };

  const multipleRoomConfigExists = groupedHotels.length > 1;

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {!multipleRoomConfigExists && (
        <div className="w-full">
          <span className="min-w-fit px-3 gap-2 whitespace-nowrap">
            {`${
              groupedHotels[0].hotels?.length > 0
                ? groupedHotels[0].hotels?.length
                : "No"
            } hotel${groupedHotels[0].hotels?.length === 1 ? "" : "s"} found`}
          </span>

          <div className="flex flex-col gap-4 mt-5">
            {groupedHotels[0].hotels.map((hotel) => (
              <HotelCard
                key={hotel._id}
                hotelData={hotel}
                onSelect={handleHotelSelection}
              />
            ))}
          </div>
        </div>
      )}

      {multipleRoomConfigExists && (
        <Tabs defaultValue="common" className="w-full">
          <div className="h-fit flex justify-start items-baseline px-3 gap-2">
            <span className="text-base min-w-fit whitespace-nowrap">
              Hotels found:{" "}
            </span>

            {/* Scroll container */}
            <div className="overflow-x-auto h-fit scrollbar-hide">
              <TabsList className="bg-transparent h-fit p-0 inline-flex">
                <TabsTrigger
                  value="common"
                  className="border-none py-0 my-0 text-base text-muted-foreground/80 shadow-none data-[state=active]:font-extrabold data-[state=active]:border-none data-[state=active]:shadow-none"
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
                    className="border-none py-0 my-0 text-base text-muted-foreground/80 shadow-none data-[state=active]:font-extrabold data-[state=active]:border-none data-[state=active]:shadow-none"
                    disabled={hotels.length <= 0}
                  >
                    {`${adults} ${adults > 1 ? "adults" : "adult"}${
                      children
                        ? `, ${children} ${children > 1 ? "children" : "child"}`
                        : ""
                    } (${hotels.length > 0 ? hotels.length : "None"})`}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          <div className="mt-5">
            {/* Common Hotels Tab */}
            <TabsContent value="common">
              <div className="flex flex-col gap-4">
                {commonHotels.map((hotel) => (
                  <HotelCard
                    key={hotel._id}
                    hotelData={hotel}
                    onSelect={handleHotelSelection}
                  />
                ))}
              </div>
            </TabsContent>

            {/* Dynamic Group Tabs */}
            {groupedHotels.map((group) => (
              <TabsContent key={group.id} value={group.id}>
                <div className="flex flex-col gap-4">
                  {group.hotels.map((hotel) => (
                    <HotelCard
                      key={hotel._id}
                      hotelData={hotel}
                      onSelect={handleHotelSelection}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      )}
    </>
  );
}
