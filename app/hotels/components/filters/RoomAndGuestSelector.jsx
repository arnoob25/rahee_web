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
  MIN_ADULT_GUEST_FOR_ROOM,
  MIN_CHILD_GUEST_FOR_ROOM,
} from "../../config";
import { useHotelFilterStore } from "../../data/hotelFilters";

export default function GuestSelector() {
  const { rooms, setRooms, addRoom, removeRoom, updateRoomGuest } =
    useHotelFilterStore();

  const [openRooms, setOpenRooms] = useState([0]);
  const [isOpen, togglePopover] = useToggleModal();

  const getTotalGuests = () =>
    rooms.reduce((sum, room) => sum + room.adults + room.children, 0);
  const getTotalAdults = () =>
    rooms.reduce((sum, room) => sum + room.adults, 0);
  const getTotalChildren = () =>
    rooms.reduce((sum, room) => sum + room.children, 0);

  const handleRemoveRoom = (roomId) => {
    removeRoom(roomId);
    setOpenRooms((current) => current.filter((id) => id !== roomId));
  };

  const handleAddRoom = () => {
    addRoom();
    setOpenRooms((current) => [...current, rooms.length + 1]);
  };

  const toggleRoom = (roomId) => {
    setOpenRooms((current) =>
      current.includes(roomId)
        ? current.filter((id) => id !== roomId)
        : [...current, roomId]
    );
  };

  const handleReset = () => {
    setRooms(DEFAULT_ROOM_GUEST_CONFIG);
    togglePopover();
  };

  return (
    <Popover open={isOpen} onOpenChange={togglePopover}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-start font-normal text-left border-2"
        >
          <Users className="w-4 h-4 mr-2" />
          <span>
            {rooms.length} Rooms, {getTotalGuests()} Guests
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start" side="bottom">
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
        />
        <GuestSelectorFooter
          addRoom={handleAddRoom}
          handleReset={handleReset}
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
                onClick={() => removeRoom(room.id)}
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
            />
            <GuestCounter
              guestType={GUEST_TYPES.child}
              description="0-10 years"
              count={room.children}
              onDecrease={() => updateGuests(room.id, GUEST_TYPES.child, false)}
              onIncrease={() => updateGuests(room.id, GUEST_TYPES.child, true)}
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
          onClick={onDecrease}
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
          onClick={onIncrease}
          disabled={count === MAX_ALLOWED_GUESTS_FOR_ROOM}
          aria-label={`Increase ${label.toLowerCase()} count`}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

function GuestSelectorFooter({ addRoom, handleReset }) {
  return (
    <div className="p-4 border-t flex justify-between">
      <Button onClick={handleReset} variant="ghost">
        Reset
      </Button>
      <Button variant="outline" onClick={addRoom}>
        Add Room
      </Button>
    </div>
  );
}
