"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Users } from "lucide-react";
import Image from "next/image";
import { AmenityIcon } from "./AmenityIcon";

export const RoomCard = ({ room, className }) => (
  <Card
    className={`w-full min-w-[300px] max-w-[400px] overflow-hidden grid grid-rows-[auto_1fr_auto] ${className}`}
  >
    <CardHeader className="grid-row-span-3 relative h-[200px] p-0">
      <Carousel className="w-full h-full">
        <CarouselContent>
          {room.media.map((image) => (
            <CarouselItem key={image.mediaId}>
              <div className="relative h-[200px]">
                <Image
                  src={image.url}
                  alt={image.name ?? "Room image"}
                  fill
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </CardHeader>
    <CardContent className="grid-rows-subgrid p-6">
      <CardTitle className="flex flex-col mb-5 gap-2">
        <span className="flex items-baseline text-3xl font-bold">
          {`৳${room.pricePerNight.toLocaleString()}`}
          <span className="text-sm text-muted-foreground">{"‎ /night"}</span>
        </span>
        <span className="text-muted-foreground">{room.name}</span>
      </CardTitle>
      <RoomAmenities room={room} />
    </CardContent>
    <CardFooter className="flex items-center justify-between">
      <div>
        <span>
          <strong>{room.roomsAggregate._count}</strong> rooms available
        </span>
      </div>
      <Button>Book Now</Button>
    </CardFooter>
  </Card>
);

const RoomAmenities = ({ room }) => (
  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
    <div className="flex items-center gap-2">
      <Users className="h-4 w-4" />
      <span>Up to {room.maxGuests} guests</span>
    </div>
    {room.roomAmenitiesLinks.map(({ amenity }) => (
      <div key={amenity.amenityId} className="flex items-center gap-2">
        <AmenityIcon name={amenity.name} />
        <span>{amenity.name}</span>
      </div>
    ))}
  </div>
);

export default RoomCard;
