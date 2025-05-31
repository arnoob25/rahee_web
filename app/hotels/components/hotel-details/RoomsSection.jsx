"use client";

import { observable } from "@legendapp/state";
import { observer } from "@legendapp/state/react";
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

export const selectedRoomCategory$ = observable("all");

export const Rooms = observer(function Component({ roomTypes }) {
  const selectedRoomCategory = selectedRoomCategory$.get();

  const filteredRoomTypes =
    selectedRoomCategory !== "all"
      ? roomTypes.filter(
          (roomType) =>
            toValidSelector(roomType.roomCategory) === selectedRoomCategory
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
        <RoomCategoryTabs />
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
      <HorizontalScrollButtons
        wideScreenOnly
        scrollTo={scrollTo}
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
        className="ml-auto"
      />
    </div>
  );
});

const RoomCategoryTabs = () => {
  const setSelectedCategory = selectedRoomCategory$.set;
  const roomCategories = getRoomCategories();

  return (
    <div className="w-full max-w-4xl">
      <Tabs
        defaultValue="all"
        onValueChange={setSelectedCategory}
        className="w-full"
      >
        <TabsList className="gap-1 px-0 bg-transparent">
          <CategoryTab value="all" name="All" />
          {roomCategories?.map(({ id, label }) => (
            <CategoryTab key={id} value={id} name={label} />
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

const CategoryTab = ({ value, name }) => (
  <TabsTrigger
    value={toValidSelector(value)}
    className="border rounded-full px-4 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
  >
    {name}
  </TabsTrigger>
);

const RoomCard = ({ room, className }) => (
  <Card
    className={`w-full min-w-80 max-w-96 overflow-hidden grid grid-rows-[auto_1fr_auto] ${className}`}
  >
    <CardHeader className="grid-row-span-3 relative h-[200px] p-0">
      <Carousel className="w-full h-full">
        <CarouselContent>
          {room.media.map((image) => (
            <CarouselItem key={image.mediaId}>
              <div className="h-52">
                <ImageViewer src={image.url} alt={image.name ?? "Room image"} />
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

const RoomAmenities = ({ amenities, maxGuests }) => {
  const amenityData = getAmenities(amenities);

  return (
    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4" />
        <span>Up to {maxGuests} guests</span>
      </div>
      {amenityData?.map(({ id, label, icon }) => (
        <div key={id} className="flex items-center gap-2">
          <DynamicIcon name={icon} FallbackIcon={AMENITY_DEFAULT_ICON} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
};
