"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Minus, Plus, Users } from "lucide-react";
import { useToggleModal } from "@/hooks/use-modal";
import {
  DEFAULT_ROOM_GUEST_CONFIG,
  GUEST_TYPES,
  MAX_ALLOWED_GUESTS_FOR_ROOM,
  MAX_ALLOWED_ROOM_CONFIGS,
  MIN_ADULT_GUEST_FOR_ROOM,
  MIN_CHILD_GUEST_FOR_ROOM,
} from "../../config";
import { useRoomConfigStore } from "../../data/hotelFilters";
import { cn } from "@/lib/utils";

export default function GuestSelector({ onApply: refetchHotels }) {
  const { rooms, setRooms, addRoom, removeRoom, updateRoomGuest } =
    useRoomConfigStore();

  const [openRooms, setOpenRooms] = useState(
    rooms?.map((room) => room.id) ?? []
  );
  const [isOpen, togglePopover] = useToggleModal();

  const areChangesMade = useRef(false);

  // set open rooms
  useEffect(() => {
    const currentRoomIds = rooms?.map((room) => room.id) ?? null;

    if (!currentRoomIds || currentRoomIds?.length === 0) return;

    setOpenRooms(currentRoomIds);
  }, [rooms]);

  const getTotalGuests = () =>
    rooms.reduce((sum, room) => sum + room.adults + room.children, 0);
  const getTotalAdults = () =>
    rooms.reduce((sum, room) => sum + room.adults, 0);
  const getTotalChildren = () =>
    rooms.reduce((sum, room) => sum + room.children, 0);

  const handleRemoveRoom = (roomId) => {
    removeRoom(roomId);
    areChangesMade.current = true;
  };

  const handleAddRoom = () => {
    addRoom();
    areChangesMade.current = true;
  };

  const toggleRoom = (roomId) => {
    setOpenRooms((current) =>
      current.includes(roomId)
        ? current.filter((id) => id !== roomId)
        : [...current, roomId]
    );
  };

  const handlePopoverClick = (isOpen) => {
    if (!isOpen && areChangesMade.current) {
      refetchHotels();
      areChangesMade.current = false;
    }
    togglePopover();
  };

  const handleReset = () => {
    setRooms(DEFAULT_ROOM_GUEST_CONFIG);
    setOpenRooms([DEFAULT_ROOM_GUEST_CONFIG[0].id]);
    areChangesMade.current = true;
  };

  return (
    <Popover open={isOpen} onOpenChange={handlePopoverClick}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-full border-0 shadow-none justify-start text-left",
            isOpen && "ring-2 ring-primary ring-offset-2"
          )}
        >
          <Users className="w-4 h-4 mr-2" />
          <div className="flex flex-col items-start">
            <span className="text-xs text-muted-foreground">
              {" "}
              Rooms and guests
            </span>
            <span className="text-base">
              {getTotalGuests()} Guest{getTotalGuests() > 1 ? "s" : ""},{" "}
              {rooms.length} Room
              {rooms.length > 1 ? "s" : ""}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[300px] p-0"
        align="start"
        side="bottom"
        sideOffset={12}
      >
        <GuestSelectorHeader
          totalAdults={getTotalAdults()}
          totalChildren={getTotalChildren()}
        />
        <GuestRooms
          rooms={rooms}
          openRooms={openRooms}
          toggleRoom={toggleRoom}
          updateGuests={updateRoomGuest}
          removeRoom={handleRemoveRoom}
          onChange={() => (areChangesMade.current = true)}
        />
        <GuestSelectorFooter
          addRoom={handleAddRoom}
          handleReset={handleReset}
          disabled={rooms.length >= MAX_ALLOWED_ROOM_CONFIGS}
        />
      </PopoverContent>
    </Popover>
  );
}

const GuestSelectorHeader = ({ totalAdults, totalChildren }) => (
  <div className="p-4 border-b bg-muted">
    <div className="font-medium">ROOMS & GUESTS</div>
    <div className="text-sm text-muted-foreground">
      {totalAdults} Adults
      {totalChildren > 0 ? `, ${totalChildren} Children` : ""}
    </div>
  </div>
);

function GuestRooms({
  rooms,
  openRooms,
  toggleRoom,
  updateGuests,
  removeRoom,
  onChange: trackChange,
}) {
  return (
    <div className="p-4 space-y-4">
      {rooms.map((room, index) => (
        <Collapsible
          key={room.id}
          open={openRooms.includes(room.id)}
          onOpenChange={() => toggleRoom(room.id)}
        >
          <div className="flex items-center justify-between">
            <CollapsibleTrigger className="flex items-center gap-2 hover:text-blue-600">
              {openRooms.includes(room.id) ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <span className="font-medium">Room {index + 1}</span>
            </CollapsibleTrigger>
            {rooms.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-blue-600 hover:text-blue-800"
                onClick={() => {
                  removeRoom(room.id);
                  trackChange();
                }}
              >
                Remove
              </Button>
            )}
          </div>
          <CollapsibleContent className="mt-4 space-y-4">
            <GuestCounter
              guestType={GUEST_TYPES.adult}
              description="10 years +"
              count={room.adults}
              onDecrease={() => updateGuests(room.id, GUEST_TYPES.adult, false)}
              onIncrease={() => updateGuests(room.id, GUEST_TYPES.adult, true)}
              onChange={trackChange}
            />
            <GuestCounter
              guestType={GUEST_TYPES.child}
              description="0-10 years"
              count={room.children}
              onDecrease={() => updateGuests(room.id, GUEST_TYPES.child, false)}
              onIncrease={() => updateGuests(room.id, GUEST_TYPES.child, true)}
              onChange={trackChange}
            />
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}

function GuestCounter({
  guestType,
  description,
  count,
  onDecrease,
  onIncrease,
  onChange: trackChange,
}) {
  const label = guestType;
  const isDecrementDisabled =
    guestType === GUEST_TYPES.adult
      ? count === MIN_ADULT_GUEST_FOR_ROOM
      : count === MIN_CHILD_GUEST_FOR_ROOM;

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8"
          onClick={() => {
            onDecrease();
            trackChange();
          }}
          disabled={isDecrementDisabled}
          aria-label={`Decrease ${label.toLowerCase()} count`}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className="w-6 text-center">{count}</span>
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8"
          onClick={() => {
            onIncrease();
            trackChange();
          }}
          disabled={count === MAX_ALLOWED_GUESTS_FOR_ROOM}
          aria-label={`Increase ${label.toLowerCase()} count`}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

function GuestSelectorFooter({ addRoom, handleReset, disabled }) {
  return (
    <div className="flex justify-between items-center mt-3 px-4 py-3 border-t">
      <Button onClick={handleReset} variant="ghost" size="sm">
        Reset
      </Button>
      <Button variant="outline" onClick={addRoom} disabled={disabled} size="sm">
        Add Room
      </Button>
    </div>
  );
}
