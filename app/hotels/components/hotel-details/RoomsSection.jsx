"use client";

import { useState, useMemo } from "react";
import { capitalizeWord, toValidSelector } from "@/lib/string-parsers";
import { useHorizontalScroll } from "@/hooks/use-scroll";
import { Button, ButtonWithOptions } from "@/components/ui/button";
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
import { Baby, Bed, CalendarCheck, Heart, Info, Users } from "lucide-react";
import { ImageViewer } from "@/app/components/ImageViewer";
import PriceString from "@/app/components/PriceString";
import { getRoomCategories } from "../../data/format-data/roomCategoryData";
import { getAmenities } from "../../data/format-data/roomAmenityData";
import { cn } from "@/lib/utils";
import { useImageViewerModal } from "@/app/components/ImageViewerModal";
import { HorizontalScrollButtons } from "@/app/components/HorizontalScrollButtons";
import { useRoomConfigStore } from "../../data/hotelFilters";
import { selectedRoomConfigStore } from "../HotelList";

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
        <CardTitle className="flex justify-between items-start pt-3 gap-2 mb-9">
          <span className="flex flex-col gap-2">
            <PriceString price={room.pricePerNight} size="lg" />
            <span className="text-lg text-muted-foreground">{room.name}</span>
          </span>
          <span className="flex items-center gap-0.5 px-2 py-1 text-sm rounded-md border whitespace-nowrap">
            <Heart className="w-3.5 h-3.5 text-sm font-bold text-muted-foreground" />
            {room.reviewScore} /10
          </span>
        </CardTitle>

        <RoomAttributes
          amenities={room.amenities}
          maxAdults={room.maxAdults}
          maxChildren={room.complementaryChild}
          bedType={room.bedType}
        />
      </CardContent>
      <FooterComponent roomCount={room.roomCount} />
    </Card>
  );
};

const RoomAttributes = ({ maxAdults, maxChildren, bedType, amenities }) => {
  const amenityData = getAmenities(amenities);
  return (
    <>
      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <strong>
            {maxAdults} {maxAdults > 1 ? "Adults" : "Adult"}
          </strong>
        </div>
        <div className="flex items-center gap-2">
          <Baby className="w-4 h-4" />
          <span>
            {maxChildren} {maxChildren > 1 ? "Children" : "Child"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Bed className="w-4 h-4" />
          <span>{capitalizeWord(bedType)} Bed</span>
        </div>
      </div>

      <div className="flex flex-wrap mt-4 gap-3 text-sm text-muted-foreground">
        {amenityData?.map(({ id, label, icon }) => (
          <div key={id} className="flex items-center gap-2">
            <DynamicIcon name={icon} FallbackIcon={AMENITY_DEFAULT_ICON} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </>
  );
};

const FooterComponent = ({ roomCount }) => {
  const { rooms } = useRoomConfigStore();

  const { selectedRoomConfig } = selectedRoomConfigStore();

  const { adults, children } =
    rooms.find((room) => room.id === selectedRoomConfig) ?? {};

  return (
    <CardFooter className="flex flex-col justify-end items-end pt-5 gap-1.5">
      {rooms.length > 1 && selectedRoomConfig !== "common" ? (
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {getRoomConfigLabel(adults, children)}
          </span>
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            <strong>{roomCount}</strong> rooms available
          </span>
        </span>
      )}

      {rooms.length > 1 && selectedRoomConfig === "common" ? (
        <ButtonWithOptions
          className="h-full text-md"
          actionLabel="Book"
          label="Book for All"
          Icon={CalendarCheck}
          options={rooms.map(({ id, adults, children }) => ({
            id: id,
            label: getRoomConfigLabel(adults, children),
          }))}
          onOptionsSubmit={(selected) => console.log("Submit with:", selected)}
        />
      ) : (
        <Button className="h-full text-md">Book Room</Button>
      )}
    </CardFooter>
  );
};

function getRoomConfigLabel(adults, children) {
  let label = adults + " " + (adults > 1 ? "adults" : "adult");
  if (children) {
    label += ", " + children + " " + (children > 1 ? "children" : "child");
  }
  return label;
}
