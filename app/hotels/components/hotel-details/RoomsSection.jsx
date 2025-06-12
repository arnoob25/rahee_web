"use client";

import { useState, useMemo, useEffect } from "react";
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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
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
import { useSelectedRoomConfig } from "../HotelList";
import { useSetReservations } from "@/app/checkout/reservations";
import { toast } from "sonner";

export function Rooms({ roomTypes: initialRoomTypes, id, className }) {
  const [selectedRoomCategory, setSelectedRoomCategory] = useState("all");

  const roomTypesToDisplay = useMemo(() => {
    return selectedRoomCategory !== "all"
      ? initialRoomTypes.filter(
          (roomType) =>
            toValidSelector(roomType.roomCategory) === selectedRoomCategory
        )
      : initialRoomTypes;
  }, [initialRoomTypes, selectedRoomCategory]);

  // cheapest, most popular room types come first
  const roomTypes = roomTypesToDisplay.sort((a, b) => {
    if (a.pricePerNight !== b.pricePerNight) {
      return a.pricePerNight - b.pricePerNight; // lower price first
    }
    return b.reviewScore - a.reviewScore; // higher score first
  });

  const { scrollRef, scrollTo, canScrollLeft, canScrollRight } =
    useHorizontalScroll(roomTypes);

  if (roomTypes.length === 0) return null;

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
          {roomTypes.map((room) => (
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
      <FooterComponent roomTypeId={room._id} roomCount={room.roomCount} />
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

const FooterComponent = ({ roomTypeId, roomCount }) => {
  const { rooms } = useRoomConfigStore();
  const selectedRoomConfigId = useSelectedRoomConfig();
  const selectedRoomConfig =
    rooms.length === 1 && selectedRoomConfigId === "common"
      ? rooms[0]
      : rooms.find((room) => room.id === selectedRoomConfigId);

  const {
    reservations,
    reservationExists,
    addNewReservation,
    overrideExistingReservation,
  } = useSetReservations(roomTypeId);

  const [pendingReservations, setPendingReservations] = useState([]);
  const [currentRoomConfig, setCurrentRoomConfig] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function checkIfThisRoomReserved() {
    if (
      rooms?.length === 1 ||
      (rooms?.length > 1 && selectedRoomConfigId !== "common")
    ) {
      return reservations?.some(
        (r) =>
          r?.adults === selectedRoomConfig?.adults &&
          r?.children === selectedRoomConfig?.children &&
          r?.roomTypeId === roomTypeId
      );
    }
    if (rooms?.length > 1 && selectedRoomConfigId === "common") {
      return rooms?.every((room) =>
        reservations?.some(
          (r) =>
            r?.adults === room?.adults &&
            r?.children === room?.children &&
            r?.roomTypeId === roomTypeId
        )
      );
    }
    return false;
  }

  // Process next config in queue
  useEffect(() => {
    if (!pendingReservations.length || currentRoomConfig) return;
    const [nextId, ...rest] = pendingReservations;
    const cfg = rooms.find((r) => r.id === nextId);

    if (reservationExists(nextId)) {
      // set the config to process based on user input in the dialog
      setCurrentRoomConfig(cfg);
      setIsDialogOpen(true);
    } else {
      addNewReservation(cfg);
      toast.success(
        `Reserved for ${getRoomConfigLabel(cfg.adults, cfg.children)}`
      );
      setPendingReservations(rest);
    }
  }, [
    pendingReservations,
    currentRoomConfig,
    rooms,
    reservationExists,
    addNewReservation,
  ]);

  // After override closes, dequeue and continue
  useEffect(() => {
    if (!isDialogOpen && currentRoomConfig) {
      setPendingReservations((q) =>
        q.filter((id) => id !== currentRoomConfig.id)
      );
      setCurrentRoomConfig(null);
    }
  }, [isDialogOpen, currentRoomConfig]);

  const handleBookNowClickForSingleRoomConfig = () => {
    const cfg = rooms.length === 1 ? rooms[0] : selectedRoomConfig;
    if (reservationExists(cfg.id)) {
      setCurrentRoomConfig(cfg);
      setIsDialogOpen(true);
    } else {
      addNewReservation(cfg);
      toast.success(
        `Reserved for ${getRoomConfigLabel(cfg.adults, cfg.children)}`
      );
    }
  };

  const handleBookNowClickForCommonResults = (selectedOptions) => {
    if (selectedOptions) setPendingReservations(selectedOptions);
  };

  return (
    <>
      <CardFooter className="flex flex-col justify-end items-end pt-5 gap-1.5">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {checkIfThisRoomReserved() ? (
              rooms.length > 1 && selectedRoomConfigId === "common" ? (
                "You have reserved it for all guests."
              ) : (
                `You have reserved for ${getRoomConfigLabel(
                  selectedRoomConfig.adults,
                  selectedRoomConfig.children
                )}`
              )
            ) : (
              <>
                <strong>{roomCount}</strong> rooms available
              </>
            )}
          </span>
        </span>

        {rooms.length > 1 && selectedRoomConfigId === "common" ? (
          <ButtonWithOptions
            className="h-full text-md"
            actionLabel="Book"
            label="Book Now"
            Icon={CalendarCheck}
            options={rooms.map((r) => ({
              id: r.id,
              label: getRoomConfigLabel(r.adults, r.children),
            }))}
            onOptionsSubmit={handleBookNowClickForCommonResults}
            disabled={checkIfThisRoomReserved()}
          />
        ) : (
          <Button
            className="h-full text-md"
            onClick={handleBookNowClickForSingleRoomConfig}
            disabled={checkIfThisRoomReserved()}
          >
            Book Room
          </Button>
        )}
      </CardFooter>
      <ReservationOverrideConfirmation
        isOpen={isDialogOpen}
        setOpen={setIsDialogOpen}
        currentRoomConfig={currentRoomConfig}
        onOverride={overrideExistingReservation}
      />
    </>
  );
};

export default function ReservationOverrideConfirmation({
  isOpen,
  setOpen,
  onOverride,
  currentRoomConfig,
}) {
  const handleKeep = () => {
    toast.info("Your previous reservation has been kept.");
    setOpen(false);
  };

  const handleOverride = () => {
    onOverride(currentRoomConfig);
    toast.info("Your previous reservation has been updated.");
    setOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      <AlertDialogContent className="animate-in fade-in-0 zoom-in-95 duration-300 ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
        <AlertDialogHeader>
          <AlertDialogTitle>
            You already reserved a Hotel for{" "}
            {currentRoomConfig &&
              getRoomConfigLabel(
                currentRoomConfig.adults,
                currentRoomConfig.children
              )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to override previous reservation?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleKeep}>
            {" "}
            No, keep existing
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleOverride}>
            Override
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function getRoomConfigLabel(adults, children) {
  let label = adults + " " + (adults > 1 ? "adults" : "adult");
  if (children) {
    label += ", " + children + " " + (children > 1 ? "children" : "child");
  }
  return label;
}
