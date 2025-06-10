"use client";

import { useState, useMemo } from "react";
import { toValidSelector } from "@/lib/string-parsers";
import { useHorizontalScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { DynamicIcon } from "@/app/components/DynamicIcon";
import { AMENITY_DEFAULT_ICON } from "@/config/icons-map";
import { HorizontalScrollButtons } from "@/app/components/HorizontalScrollButtons";
import { Users } from "lucide-react";
import { ImageViewer } from "@/app/components/ImageViewer";
import PriceString from "@/app/components/PriceString";
import { getRoomCategories } from "../../data/format-data/roomCategoryData";
import { getAmenities } from "../../data/format-data/roomAmenityData";
import { cn } from "@/lib/utils";
import { useImageViewerModal } from "@/app/components/ImageViewerModal";

export function Rooms({ roomTypes, id, className }) {
  const [selectedRoomCategory, setSelectedRoomCategory] = useState("all");

  const filteredRoomTypes = useMemo(() => {
    return selectedRoomCategory !== "all"
      ? roomTypes.filter(
          (roomType) =>
            toValidSelector(roomType.roomCategory) === selectedRoomCategory
        )
      : roomTypes;
  }, [roomTypes, selectedRoomCategory]);

  const { scrollRef, scrollTo, canScrollLeft, canScrollRight } =
    useHorizontalScroll(filteredRoomTypes);

  if (filteredRoomTypes.length === 0) return null;

  return (
    <section id={id} className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-col gap-3">
        <RoomCategoryTabs
          onChange={setSelectedRoomCategory}
          roomTypes={roomTypes}
        />
        <div
          ref={scrollRef}
          className="flex flex-row gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        >
          {filteredRoomTypes.map((room) => (
            <RoomCard key={room._id} room={room} className="snap-start" />
          ))}
        </div>
      </div>
      <HorizontalScrollButtons
        wideScreenOnly
        scrollTo={scrollTo}
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
        className="ml-auto"
      />
    </section>
  );
}

const RoomCategoryTabs = ({ onChange, roomTypes }) => {
  const roomCategories = getRoomCategories();

  // Get available category IDs from actual roomTypes
  const availableCategoryIds = new Set(
    roomTypes.map((room) => toValidSelector(room.roomCategory))
  );

  return (
    <div className="w-full max-w-4xl ml-0.5">
      <Tabs defaultValue="all" onValueChange={onChange} className="w-full">
        <TabsList className="gap-2 px-0 bg-transparent">
          <CategoryTab value="all" name="All" disabled={false} />
          {roomCategories?.map(({ id, label }) => (
            <CategoryTab
              key={id}
              value={id}
              name={label}
              disabled={!availableCategoryIds.has(toValidSelector(id))}
            />
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

const CategoryTab = ({ value, name, disabled }) => (
  <TabsTrigger
    value={toValidSelector(value)}
    disabled={disabled}
    className="border rounded-full px-4 py-1 data-[state=active]:bg-secondary data-[state=active]:ring-1 data-[state=active]:ring-primary data-[state=active]:text-secondary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {name}
  </TabsTrigger>
);

const RoomCard = ({ room, className }) => {
  const displayModal = useImageViewerModal();

  return (
    <Card
      className={`w-full min-w-80 max-w-96 overflow-hidden grid grid-rows-[auto_1fr_auto] ${className}`}
    >
      <CardHeader className="grid-row-span-3 relative h-[200px] p-0">
        <Carousel className="w-full h-full">
          <CarouselContent>
            {room.media.map((image, index) => (
              <CarouselItem
                key={image._id}
                onClick={() => displayModal(room.media, index)}
              >
                <div className="h-52">
                  <ImageViewer
                    src={image.url}
                    alt={image.name ?? "Room image"}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </CardHeader>
      <CardContent className="p-6 grid-rows-subgrid">
        <CardTitle className="flex flex-col gap-2 mb-5">
          <PriceString price={room.pricePerNight} />
          <span className="text-muted-foreground">{room.name}</span>
        </CardTitle>
        <RoomAmenities
          amenities={room.amenities}
          maxGuests={room.maxAdults + room.complementaryChild}
        />
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div>
          <span>
            <strong>{room.roomCount}</strong> rooms available
          </span>
        </div>
        <Button>Book Now</Button>
      </CardFooter>
    </Card>
  );
};

const RoomAmenities = ({ amenities, maxGuests }) => {
  const amenityData = getAmenities(amenities);

  return (
    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4" />
        <span>Up to {maxGuests} guests</span>
      </div>
      {amenityData?.map(({ _id, label, icon }) => (
        <div key={_id} className="flex items-center gap-2">
          <DynamicIcon name={icon} FallbackIcon={AMENITY_DEFAULT_ICON} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
};
