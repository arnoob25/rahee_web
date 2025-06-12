"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HotelCard } from "./HotelCard";
import { HotelListSkeleton } from "./skeletons/HotelListSkeleton";
import { Info, Search, AlertTriangle } from "lucide-react";
import { create } from "zustand";

export const selectedRoomConfigStore = create((set) => ({
  selectedRoomConfigId: null,
  setSelectedRoomConfigId: (selectedRoomConfigId) =>
    set({ selectedRoomConfigId }),
}));

export function useSelectedRoomConfigSetter() {
  const { setSelectedRoomConfigId } = selectedRoomConfigStore();
  return setSelectedRoomConfigId;
}

export function useSelectedRoomConfig() {
  const { selectedRoomConfigId } = selectedRoomConfigStore();
  return selectedRoomConfigId;
}

export default function FilteredHotels({
  commonHotels: initialCommonHotels = [],
  groupedHotels: initialGroupedHotels = [],
  isFetched,
  isLoading,
}) {
  const [commonHotels, setCommonHotels] = useState([]);
  const [groupedHotels, setGroupedHotels] = useState([]);

  const activeTab = useSelectedRoomConfig();
  const setActiveTab = useSelectedRoomConfigSetter();

  // set hotels to display
  useEffect(() => {
    if (isLoading || !isFetched || initialGroupedHotels.length === 0) return;

    setCommonHotels(initialCommonHotels);
    setGroupedHotels(initialGroupedHotels);
    setActiveTab(null);
  }, [
    initialCommonHotels,
    initialGroupedHotels,
    isFetched,
    isLoading,
    setActiveTab,
  ]);

  // set active tab
  useEffect(() => {
    if (activeTab !== null) return;

    let activeTabValue = null;
    if (commonHotels.length > 0) {
      activeTabValue = "common";
    } else {
      activeTabValue =
        groupedHotels.find((g) => g.hotels.length > 0)?.id ?? null;
    }

    if (activeTabValue === null) return;

    setActiveTab(activeTabValue);
  }, [activeTab, groupedHotels, commonHotels.length, setActiveTab]);

  if (isLoading) return <HotelListSkeleton />;

  if (groupedHotels.length === 1) {
    return <SingleGroupHotels group={groupedHotels[0]} isFetched={isFetched} />;
  }

  if (groupedHotels.length > 1) {
    return (
      <MultipleGroupHotels
        groupedHotels={groupedHotels}
        commonHotels={commonHotels}
        isFetched={isFetched}
      />
    );
  }

  return (
    <Message
      type="default"
      past={!isFetched && groupedHotels.length > 0}
      hasResults={
        groupedHotels.length > 0
          ? groupedHotels.length > 1
            ? groupedHotels.some((group) => group.hotels.length > 0)
            : groupedHotels[0].hotels.length > 0
          : false
      }
    />
  );
}

function SingleGroupHotels({ group, isFetched }) {
  const { hotels = [], adults, children } = group;
  const count = hotels.length;

  const pastResultsText = `Past results (${adults} ${
    adults > 1 ? "adults" : "adult"
  }${
    children > 0 ? `, ${children} ${children > 1 ? "children" : "child"}` : ""
  }): ${count > 0 ? count + " accommodations" : "None"}`;

  const currentResultsText =
    count > 0
      ? `${count} accommodation${count === 1 ? "" : "s"} found`
      : "No accommodations found";

  return (
    <>
      {!isFetched && (
        <Message type="new-search" past hasResults={hotels.length > 0} />
      )}
      {count > 0 ? (
        <span className="min-w-fit px-3 gap-2 whitespace-nowrap">
          {!isFetched ? pastResultsText : currentResultsText}
        </span>
      ) : (
        <Message type="no-results" past={isFetched} hasResults={false} />
      )}
      <HotelList hotels={hotels} isFetched={isFetched} />
    </>
  );
}

function MultipleGroupHotels({ commonHotels, groupedHotels, isFetched }) {
  const activeTab = useSelectedRoomConfig();
  const setActiveTab = useSelectedRoomConfigSetter();

  const hasAnyResults =
    commonHotels.length > 0 ||
    groupedHotels.some((group) => group.hotels.length > 0);

  return (
    <>
      {!isFetched && (
        <Message type="new-search" past hasResults={hasAnyResults} />
      )}
      {groupedHotels.some((group) => group.hotels.length > 0) ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsHeader
            commonHotels={commonHotels}
            groupedHotels={groupedHotels}
            isFetched={isFetched}
          />
          <TabsContentArea
            commonHotels={commonHotels}
            groupedHotels={groupedHotels}
            isFetched={isFetched}
          />
        </Tabs>
      ) : (
        <Message type="no-results" past={isFetched} hasResults={false} />
      )}
    </>
  );
}

function TabsHeader({ commonHotels = [], groupedHotels = [], isFetched }) {
  const setActiveTab = useSelectedRoomConfigSetter();
  return (
    <div className="h-fit flex justify-start items-baseline px-3 gap-2">
      <span className="text-base min-w-fit whitespace-nowrap">
        {isFetched ? "Accommodations found:" : "Past results:"}
      </span>
      <div className="overflow-x-auto h-fit scrollbar-hide">
        <TabsList className="bg-transparent h-fit p-0 inline-flex">
          <TabsTrigger
            value="common"
            className="border-none py-0 my-0 text-base text-muted-foreground/80 shadow-none data-[state=active]:font-extrabold"
            onClick={() => setActiveTab("common")}
            disabled={commonHotels.length <= 0}
          >
            {`Common (${commonHotels.length || "None"})`}
          </TabsTrigger>

          {groupedHotels.map(({ id, adults, children, hotels }) => (
            <TabsTrigger
              key={id}
              value={id}
              className="border-none py-0 my-0 text-base text-muted-foreground/80 shadow-none data-[state=active]:font-extrabold"
              onClick={() => setActiveTab(id)}
              disabled={hotels.length <= 0}
            >
              {getRoomConfigLabel(adults, children, hotels.length)}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </div>
  );
}

function TabsContentArea({ commonHotels = [], groupedHotels = [], isFetched }) {
  return (
    <div className="mt-5">
      <TabsContent value="common">
        <HotelList hotels={commonHotels} isFetched={isFetched} />
      </TabsContent>

      {groupedHotels.map((group) => (
        <TabsContent key={group.id} value={group.id}>
          <HotelList hotels={group.hotels} isFetched={isFetched} />
        </TabsContent>
      ))}
    </div>
  );
}

function HotelList({ hotels = [], isFetched }) {
  return (
    <div className="flex flex-col gap-4 mt-5">
      {hotels.length > 0
        ? hotels.map((hotel) => (
            <HotelCard
              key={hotel._id}
              hotelData={hotel}
              disabled={!isFetched}
            />
          ))
        : null}
    </div>
  );
}

function Message({ type = "default", past = false, hasResults = false }) {
  let icon, bgColor, borderColor, textColor, message;

  switch (type) {
    case "no-results":
      icon = <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      bgColor = "bg-yellow-50";
      borderColor = "border-yellow-300/30";
      textColor = "text-yellow-800";
      message = past ? (
        <>
          <span className="font-medium">No luck this time.</span>{" "}
          <span>Try changing your filters.</span>
        </>
      ) : (
        <>
          <span className="font-medium">Your last search had no matches.</span>{" "}
          <span>Try widening your filters or explore nearby areas.</span>
        </>
      );
      break;

    case "new-search":
      icon = <Search className="w-5 h-5 text-gray-500" />;
      bgColor = "bg-gray-50";
      borderColor = "border-gray-200";
      textColor = "text-gray-600";
      message = past ? (
        hasResults ? (
          <>
            <span className="font-medium">Keep applying filters</span>{" "}
            <span>to narrow down your ideal stay.</span>
          </>
        ) : (
          <>
            <span className="font-medium">Search with broader filters</span>{" "}
            <span>to find more results.</span>
          </>
        )
      ) : (
        <>
          <span className="font-medium">Start your search</span>{" "}
          <span>and explore places to stay.</span>
        </>
      );
      break;

    default:
      icon = <Info className="w-5 h-5 text-blue-600" />;
      bgColor = "bg-blue-50";
      borderColor = "border-blue-300/30";
      textColor = "text-blue-800";
      message = past ? (
        hasResults ? (
          <>
            <span className="font-medium">Still planning?</span>{" "}
            <span>Take a look through the options we found earlier.</span>
          </>
        ) : (
          <>
            <span className="font-medium">Still looking?</span>{" "}
            <span>Let’s try a broader search to see more results.</span>
          </>
        )
      ) : (
        <>
          <span className="font-medium">Planning for a trip?</span>{" "}
          <span>Search to find your ideal stay.</span>
        </>
      );
  }

  return (
    <div
      className={`w-full flex items-center gap-3 px-4 py-6 border ${borderColor} ${bgColor} ${textColor} rounded-xl mb-10 shadow-sm`}
    >
      {icon}
      <div className="text-sm">{message}</div>
    </div>
  );
}

function getRoomConfigLabel(adults, children, hotelsCount) {
  return `${adults} ${adults > 1 ? "adults" : "adult"}${
    children ? `, ${children} ${children > 1 ? "children" : "child"}` : ""
  } (${hotelsCount || "None"})`;
}
