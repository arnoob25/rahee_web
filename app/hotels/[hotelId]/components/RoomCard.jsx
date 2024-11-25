"use client";

import Photo from "@/app/components/Photo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wifi, Users, Coffee } from "lucide-react";

export function RoomCard({ room }) {
  return (
    <Card className="w-full overflow-hidden grid">
      <CardHeader className="grid-rows-subgrid row-span-3 relative h-[200px] p-0">
        <Photo imageUrl={room.media[0].url} />
      </CardHeader>
      <CardContent className="grid-rows-subgrid row-span-3 p-6">
        <CardTitle className="mb-4">{room.name}</CardTitle>
        <div className="grid gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Up to {room.maxGuests} guests</span>
              </div>
              {room.roomAmenitiesLinks.map(({ amenity }) => (
                <div
                  key={amenity.amenityId}
                  className="flex whitespace-nowrap items-center gap-2"
                >
                  {amenity.name.includes("WiFi") ? (
                    <Wifi className="h-4 w-4" />
                  ) : amenity.name.includes("Breakfast") ? (
                    <Coffee className="h-4 w-4" />
                  ) : null}
                  <span className="whitespace-nowrap">{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className=" flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold">
            ৳{room.pricePerNight.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground"> / night</span>
        </div>
        <Button>Book Now</Button>
      </CardFooter>
    </Card>
  );
}
