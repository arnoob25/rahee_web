"use client";

import { useState } from "react";
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
import useRestoreGuestsFromURL from "../../hooks/useRestoreGuestsFromURL";

export default function Component() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [rooms, setRooms] = useState([{ id: 1, adults: 1, children: 0 }]);
  const [openRooms, setOpenRooms] = useState([1]);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const getTotalGuests = () => {
    return rooms.reduce((sum, room) => sum + room.adults + room.children, 0);
  };

  const getTotalAdults = () => {
    return rooms.reduce((sum, room) => sum + room.adults, 0);
  };

  const getTotalChildren = () => {
    return rooms.reduce((sum, room) => sum + room.children, 0);
  };

  const updateGuests = (roomId, type, increment) => {
    setRooms(
      rooms.map((room) => {
        if (room.id === roomId) {
          const newValue = increment ? room[type] + 1 : room[type] - 1;
          if (newValue >= 0) {
            return { ...room, [type]: newValue };
          }
        }
        return room;
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

    const params = new URLSearchParams(searchParams);

    const adults = rooms.map((room) => room.adults).join(",");
    const children = rooms.map((room) => room.children);

    params.set("rooms", rooms.length.toString());
    params.set("adults", adults);

    // Check if any room has children, and only then set the "children" parameter
    if (children.some((count) => count > 0)) {
      params.set("children", children.join(","));
    } else {
      params.delete("children");
    }

    router.replace(`?${params.toString()}`);
    setPopoverOpen(false);
  };

  useRestoreGuestsFromURL(setRooms);

  return (
    <Popover open={popoverOpen} onOpenChange={() => setPopoverOpen(true)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-start text-left font-normal border-2"
          onClick={() => setPopoverOpen(true)}
        >
          <Users className="mr-2 h-4 w-4" />
          <span>
            {rooms.length} Rooms, {getTotalGuests()} Guests
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start" side="bottom">
        <div className="p-4 border-b bg-muted">
          <div className="font-medium">ROOMS & GUESTS</div>
          <div className="text-sm text-muted-foreground">
            {getTotalAdults()} Adults
            {getTotalChildren() > 0 ? `, ${getTotalChildren()} Children` : ""}
          </div>
        </div>
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
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  <span className="font-medium">Room {index + 1}</span>
                </CollapsibleTrigger>
                {rooms.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 h-8 px-2 hover:text-blue-800"
                    onClick={() => removeRoom(room.id)}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <CollapsibleContent className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Adults</div>
                    <div className="text-sm text-muted-foreground">
                      10 years +
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateGuests(room.id, "adults", false)}
                      disabled={room.adults === 0}
                      aria-label="Decrease adult count"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{room.adults}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateGuests(room.id, "adults", true)}
                      aria-label="Increase adult count"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Child</div>
                    <div className="text-sm text-muted-foreground">
                      0-10 years
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateGuests(room.id, "children", false)}
                      disabled={room.children === 0}
                      aria-label="Decrease child count"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{room.children}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateGuests(room.id, "children", true)}
                      aria-label="Increase child count"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
        <div className="border-t p-4 flex justify-between">
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
            disabled={getTotalGuests() === 0}
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
