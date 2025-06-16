"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DynamicIcon } from "@/app/components/DynamicIcon";
import {
  Baby,
  Bed,
  CalendarDays,
  DollarSign,
  Heart,
  MapPin,
  Users,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageViewer } from "@/app/components/ImageViewer";
import { getAmenities } from "@/app/hotels/data/format-data/roomAmenityData";
import { AMENITY_DEFAULT_ICON } from "@/config/icons-map";
import { capitalizeWord } from "@/lib/string-parsers";
import GuestDetailsForm from "./GuestDetailsForm";
import { useGetReservationData } from "../reservations";
import { cn } from "@/lib/utils";
import BookingSummarySkeleton from "./BookingSummarySkeleton";

export default function ReviewBookings({ reservations, className }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Refs to hidden control buttons
  const nextBtnRef = useRef(null);
  const prevBtnRef = useRef(null);

  // Trigger next
  const handleNext = () => {
    if (currentIndex < reservations.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      nextBtnRef.current?.click();
    }
  };

  // Trigger previous
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      prevBtnRef.current?.click();
    }
  };

  return (
    <div className={cn(className, "relative")}>
      <div className="sticky top-0 pt-28 z-[90] bg-background">
        <div className="flex justify-between items-center h-fit pb-5">
          <span className="text-2xl mt-1 text-center text-muted-foreground">
            Reservation{" "}
            {reservations.length > 1 &&
              `${currentIndex + 1} of ${reservations.length}`}
          </span>
          {reservations.length > 1 && (
            <span className="justify-end">
              <Button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="bg-background text-foreground hover:bg-secondary shadow-none rounded-xl h-10 w-fit"
              >
                ‹ Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={currentIndex === reservations.length - 1}
                className="bg-background text-foreground hover:bg-secondary shadow-none rounded-xl h-10 w-fit"
              >
                Next ›
              </Button>
            </span>
          )}
        </div>
      </div>

      <Carousel opts={{ watchDrag: false }} className="space-y-5">
        <CarouselContent>
          {reservations.map((reservation) => (
            <CarouselItem key={reservation.id}>
              <BookingSummary
                reservationId={reservation.id}
                onConfirm={handleNext}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Hidden actual carousel controls */}
        <CarouselPrevious ref={prevBtnRef} className="hidden" />
        <CarouselNext ref={nextBtnRef} className="hidden" />

        {/* Visible buttons to trigger the hidden ones */}
      </Carousel>
    </div>
  );
}

function BookingSummary({
  reservationId,
  onConfirm: scrollToNextBooking,
  className,
}) {
  const reservation = useGetReservationData(reservationId);

  if (!reservation?.hotel || !reservation?.roomType)
    return <BookingSummarySkeleton />;

  const { hotel, roomType, duration, adults, children } = reservation;

  if (!reservation?.hotel || !reservation?.roomType)
    return <BookingSummarySkeleton />;

  const amenityData = getAmenities(roomType.amenities);

  const totalPrice = roomType.pricePerNight * duration;

  return (
    <div className={cn("bg-secondary rounded-xl p-5 space-y-7", className)}>
      <RoomTypeOverviewCard
        hotel={hotel}
        roomType={roomType}
        amenityData={amenityData}
      />

      <div className="space-y-7">
        <div className="flex justify-around items-center gap-4 px-2 md:px-0">
          <InfoItem
            Icon={Users}
            label="Adults"
            value={`${adults.length} ${
              adults.length === 1 ? "Adult" : "Adults"
            }`}
          />

          {children.length > 0 && (
            <InfoItem
              Icon={Baby}
              label="Children"
              value={`${children.length} ${
                children.length === 1 ? "Child" : "Children"
              }`}
            />
          )}

          <InfoItem
            Icon={CalendarDays}
            label="Duration"
            value={`${duration} ${duration === 1 ? "night" : "nights"}`}
          />

          <InfoItem
            Icon={DollarSign}
            label="Total Cost"
            value={`${totalPrice} taka`}
          />
        </div>
      </div>

      <div>
        <span className="text-xs text-muted-foreground">Guest Details</span>
        <GuestDetailsForm
          reservation={reservation}
          roomTypeName={roomType.name}
          onSubmission={scrollToNextBooking}
          className="h-full mt-1 p-5 border border-border rounded-xl"
        />
      </div>
    </div>
  );
}

function RoomTypeOverviewCard({ hotel, roomType, amenityData }) {
  return (
    <Card className="w-full flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-md">
      {/* Room Image */}
      <div className="w-full md:w-1/3 h-60 md:h-auto">
        <ImageViewer
          src={roomType.media?.[0]?.url}
          alt={roomType.name}
          priority
          className="object-cover w-full h-full"
        />
      </div>

      {/* Room Info */}
      <CardContent className="flex-1 py-4 flex flex-col justify-between gap-5">
        {/* Title and Hotel Info */}
        <div>
          <h2 className="text-xl">
            {roomType.name}
            <span className="font-medium text-muted-foreground">
              {" "}
              at {hotel.name}
            </span>
          </h2>

          <div className="flex items-center mt-1 gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <DollarSign className="w-4 h-4" />
              <span>{roomType.pricePerNight} per night</span>
            </span>
            <span className="flex items-center gap-0.5">
              <MapPin className="w-4 h-4" />
              <span>{hotel.location.address}</span>
            </span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground max-h-[3.5rem] overflow-hidden">
          <span className="flex items-center gap-0.5">
            <Heart className="w-4 h-4" />
            <span>{roomType.reviewScore} / 10</span>
          </span>

          <span className="flex items-center gap-0.5">
            <Bed className="w-4 h-4" />
            <span>{capitalizeWord(roomType.bedType)} Bed</span>
          </span>

          {amenityData?.length > 0 &&
            amenityData.map(({ id, label, icon }) => (
              <span key={id} className="flex items-center gap-0.5">
                <DynamicIcon name={icon} FallbackIcon={AMENITY_DEFAULT_ICON} />
                <span>{label}</span>
              </span>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

function InfoItem({ Icon, label, value }) {
  return (
    <div className="w-full h-fit flex items-center justify-center gap-5 text-left">
      <Icon className="w-6 h-6 text-muted-foreground" />
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-base">{value}</span>
      </div>
    </div>
  );
}
