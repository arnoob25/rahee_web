"use client";

import { observable } from "@legendapp/state";
import { RoomCard } from "./RoomCard";
import RoomCategories from "./RoomCategories";
import { observer } from "@legendapp/state/react";
import { toValidSelector } from "@/lib/string-parsers";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHorizontalScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const selectedRoomCategory$ = observable("all");

const RoomTypes = observer(function Component({ roomTypes }) {
  const selectedRoomCategory = selectedRoomCategory$.get();

  const filteredRoomTypes =
    selectedRoomCategory !== "all"
      ? roomTypes.filter(
          (roomType) =>
            toValidSelector(roomType.roomCategoryId) === selectedRoomCategory
        )
      : roomTypes;

  const { scrollRef, scrollTo, canScrollLeft, canScrollRight } =
    useHorizontalScroll(filteredRoomTypes);

  //TODO don't display unavailable rooms
  //TODO sort rooms by price

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold">Available Rooms</h2>
        <RoomCategories />
        <div
          ref={scrollRef}
          className="flex flex-row gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        >
          {filteredRoomTypes.map((room) => (
            <RoomCard
              key={room.roomTypeId}
              room={room}
              className="snap-start"
            />
          ))}
        </div>
      </div>
      <div
        className={cn(
          "flex flex-row gap-2 ml-auto w-fit h-fit",
          !canScrollLeft && !canScrollRight ? "hidden" : ""
        )}
      >
        <Button
          variant="outlined"
          className="p-2 rounded-full border"
          onClick={() => scrollTo("left")}
          aria-label="Scroll left"
          disabled={!canScrollLeft}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="outlined"
          className="p-2 rounded-full border"
          onClick={() => scrollTo("right")}
          aria-label="Scroll right"
          disabled={!canScrollRight}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
});

export default RoomTypes;
