"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { observer } from "@legendapp/state/react";
import { useURLParams } from "@/hooks/use-url-param";

const GuestSelector = observer(function Component() {
  const [rooms, setRooms] = useState([{ id: 1, adults: 1, children: 0 }]);
  const [openRooms, setOpenRooms] = useState([1]);
  const [isOpen, togglePopover] = useToggleModal();
  const { updateURLParam, deleteURLParam, updateURL } = useURLParams();

  const getTotalGuests = () =>
    rooms.reduce((sum, room) => sum + room.adults + room.children, 0);
  const getTotalAdults = () =>
    rooms.reduce((sum, room) => sum + room.adults, 0);
  const getTotalChildren = () =>
    rooms.reduce((sum, room) => sum + room.children, 0);

  const updateGuests = (roomId, guestType, shouldIncrement) => {
    setRooms(
      rooms.map((room) => {
        if (room.id !== roomId) return room;

        const updatedValue = shouldIncrement
          ? room[guestType] + 1
          : room[guestType] - 1;

        if (updatedValue < 0) return room;

        return { ...room, [guestType]: updatedValue };
      })
    );
  };

  const removeRoom = (roomId) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter((room) => room.id !== roomId));
      setOpenRooms(openRooms.filter((id) => id !== roomId));
    }
  };

  const addRoom = () => {
    const newId = rooms.length + 1;
    setRooms([...rooms, { id: newId, adults: 0, children: 0 }]);
    setOpenRooms([...openRooms, newId]);
  };

  const toggleRoom = (roomId) => {
    setOpenRooms((current) =>
      current.includes(roomId)
        ? current.filter((id) => id !== roomId)
        : [...current, roomId]
    );
  };

  const handleDone = () => {
    if (getTotalGuests() === 0) return;

    const adults = rooms.map((room) => room.adults).join(",");
    const children = rooms.map((room) => room.children);

    updateURLParam("rooms", rooms.length.toString(), false);
    updateURLParam("adults", adults, false);

    if (children.some((count) => count > 0)) {
      updateURLParam("children", children.join(","), false);
    } else {
      deleteURLParam("children", false);
    }

    updateURL(); // batch update all the changes
    togglePopover();
  };

  useRestoreGuestsFromURL(setRooms);

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
          removeRoom={removeRoom}
        />
        <GuestSelectorFooter
          addRoom={addRoom}
          handleDone={handleDone}
          totalGuests={getTotalGuests()}
        />
      </PopoverContent>
    </Popover>
  );
});

export default GuestSelector;

const GuestSelectorHeader = ({ totalAdults, totalChildren }) => (
  <div className="p-4 border-b bg-muted">
    <div className="font-medium">ROOMS & GUESTS</div>
    <div className="text-sm text-muted-foreground">
      {totalAdults} Adults
      {totalChildren > 0 ? `, ${totalChildren} Children` : ""}
    </div>
  </div>
);

const GuestRooms = ({
  rooms,
  openRooms,
  toggleRoom,
  updateGuests,
  removeRoom,
}) => (
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

const GuestCounter = ({
  label,
  description,
  count,
  onDecrease,
  onIncrease,
}) => (
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
      <span className="w-8 text-center">{count}</span>
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

const GuestSelectorFooter = ({ addRoom, handleDone, totalGuests }) => (
  <div className="flex justify-between p-4 border-t">
    <Button
      variant="ghost"
      size="sm"
      className="text-blue-600 hover:text-blue-800"
      onClick={addRoom}
    >
      Add Another Room
    </Button>
    <Button
      size="sm"
      variant="default"
      onClick={handleDone}
      disabled={totalGuests === 0}
    >
      Done
    </Button>
  </div>
);

function useRestoreGuestsFromURL(setRooms) {
  const searchParams = useSearchParams();
  const hasRestored = useRef(false);

  useEffect(() => {
    if (hasRestored.current) return;

    const roomsParam = searchParams.get("rooms");
    const adultsParam = searchParams.get("adults");
    const childrenParam = searchParams.get("children");

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
  }, [searchParams, setRooms]);
}
