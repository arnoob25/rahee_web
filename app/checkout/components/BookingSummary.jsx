import { useGetReservationData } from "../reservations";
import { Card, CardContent } from "@/components/ui/card";
import { DynamicIcon } from "@/app/components/DynamicIcon";
import {
  Baby,
  Bed,
  CalendarDays,
  DollarSign,
  Heart,
  LogIn,
  LogOut,
  MapPin,
  Users,
} from "lucide-react";
import { ImageViewer } from "@/app/components/ImageViewer";
import { getAmenities } from "@/app/hotels/data/format-data/roomAmenityData";
import { AMENITY_DEFAULT_ICON } from "@/config/icons-map";
import { capitalizeWord } from "@/lib/string-parsers";

export default function BookingSummary({ reservationId }) {
  const reservation = useGetReservationData(reservationId);

  if (!reservation?.hotel || !reservation?.roomType) return null;

  const {
    hotel,
    roomType,
    checkInDate,
    checkOutDate,
    duration,
    adults,
    children,
  } = reservation;

  const amenityData = getAmenities(roomType.amenities);

  return (
    <div className="bg-secondary rounded-xl p-5 pb-8">
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
                  <DynamicIcon
                    name={icon}
                    FallbackIcon={AMENITY_DEFAULT_ICON}
                  />
                  <span>{label}</span>
                </span>
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 space-y-7">
        <div className="flex justify-between items-center mt-6">
          {/* Check in date */}
          <div className="w-full h-fit flex items-center justify-start bg-background border border-border rounded-xl shadow-md px-5 py-4 gap-5 text-left">
            <LogIn className="w-6 h-6 mr-1 text-muted-foreground" />
            <div className="flex flex-col ">
              <span className="text-sm text-muted-foreground">
                Check-in Date
              </span>
              <span className="text-lg">{checkInDate}</span>
            </div>
          </div>

          <span className="h-[40px] w-[1px] bg-muted-foreground/30 mx-4 my-auto" />

          {/* Checkout date */}
          <div className="w-full h-fit flex items-center justify-start bg-background border border-border rounded-xl shadow-md px-5 py-4 gap-5 text-left">
            <LogOut className="w-6 h-6 text-muted-foreground" />
            <div className="flex flex-col ">
              <span className="text-sm text-muted-foreground">
                Check-out Date
              </span>
              <span className="text-lg">{checkOutDate}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-around items-center gap-4 px-2 md:px-0">
          {/* Duration */}
          <div className="w-full h-fit flex items-center justify-center gap-5 text-left">
            <CalendarDays className="w-6 h-6 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Duration</span>
              <span className="text-base">
                {duration} {duration === 1 ? "night" : "nights"}
              </span>
            </div>
          </div>

          {/* Adults */}
          <div className="w-full h-fit flex items-center justify-center gap-5 text-left">
            <Users className="w-6 h-6 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Adults</span>
              <span className="text-base">
                {adults.length} {adults.length === 1 ? "Adult" : "Adults"}
              </span>
            </div>
          </div>

          {/* Children */}
          {children.length > 0 && (
            <div className="w-full h-fit flex items-center justify-center gap-5 text-left">
              <Baby className="w-6 h-6 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Children</span>
                <span className="text-base">
                  {children.length}{" "}
                  {children.length === 1 ? "Child" : "Children"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
