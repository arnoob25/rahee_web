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
import { useHotelFilterStore } from "../../data/hotelFilterStore";
import { DEFAULT_ROOM_GUEST_CONFIG } from "../../config";
import { useURLParams } from "@/hooks/use-url-param";

export default function GuestSelector() {
  const { rooms, setRooms, addRoom, removeRoom, updateRoomGuest } =
    useHotelFilterStore();

  const [openRooms, setOpenRooms] = useState([1]);
  const [isOpen, togglePopover] = useToggleModal();

  const getTotalGuests = () =>
    rooms.reduce((sum, room) => sum + room.adults + room.children, 0);
  const getTotalAdults = () =>
    rooms.reduce((sum, room) => sum + room.adults, 0);
  const getTotalChildren = () =>
    rooms.reduce((sum, room) => sum + room.children, 0);

  const updateGuests = (roomId, guestType, shouldIncrement) => {
    updateRoomGuest(roomId, guestType, shouldIncrement);
  };

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

  useRestoreGuestsFromURL();

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
          updateGuests={updateGuests}
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
              label="Adults"
              description="10 years +"
              count={room.adults}
              onDecrease={() => updateGuests(room.id, "adults", false)}
              onIncrease={() => updateGuests(room.id, "adults", true)}
            />
            <GuestCounter
              label="Child"
              description="0-10 years"
              count={room.children}
              onDecrease={() => updateGuests(room.id, "children", false)}
              onIncrease={() => updateGuests(room.id, "children", true)}
            />
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}

function GuestCounter({ label, description, count, onDecrease, onIncrease }) {
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
          disabled={count === 0}
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

function useRestoreGuestsFromURL() {
  const { setRooms } = useHotelFilterStore();
  const { getParamByKey } = useURLParams();
  const hasRestored = useRef(false);

  useEffect(() => {
    if (hasRestored.current) return;

    const roomsParam = getParamByKey("rooms");
    const adultsParam = getParamByKey("adults");
    const childrenParam = getParamByKey("children");

    if (roomsParam && adultsParam) {
      const roomsCount = parseInt(roomsParam, 10);
      const adultsArray = adultsParam.split(",").map(Number);
      const childrenArray = childrenParam
        ? childrenParam.split(",").map(Number)
        : [];

      const rooms = Array.from({ length: roomsCount }, (_, index) => ({
        id: index + 1,
        adults: adultsArray[index] || 0,
        children: childrenArray[index] || 0,
      }));

      setRooms(rooms);
      hasRestored.current = true;
    }
  }, [getParamByKey, setRooms]);
}
