"use client"

import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImageViewer } from "@/app/components/ImageViewer";
import PriceString from "@/app/components/PriceString";
import { Badge } from "@/components/ui/badge";
import { DynamicIcon } from "@/app/components/DynamicIcon";
import { FACILITY_DEFAULT_ICON, POLICY_DEFAULT_ICON } from "@/config/icons-map";
import { getFacilities } from "../[hotelId]/data/hotelFacilityData";
import { getFeaturedRules } from "../[hotelId]/data/hotelPolicyData";
import { useGetCategorizedImages } from "../data/categorizeImages";
import { useHotelFilterStore } from "../data/hotelFilters";
import { PRICE_CALCULATION_METHODS } from "../config";

// TODO when pricing method is total, multiply per night price by stay duration

export function HotelCard({ hotelData }) {
  const { coverImages, featuredImages } = useGetCategorizedImages(
    hotelData.media
  );

  if (!hotelData._id) return <>Loading</>;

  return (
    <Card className="min-w-[300px] overflow-hidden">
      <CardContent className="flex flex-col p-0 sm:flex-row">
        <div className="w-full sm:w-1/3">
          <HotelImageCarousel
            images={[...coverImages, ...featuredImages]}
            altBase={hotelData.name}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between flex-1">
          <HotelDetails
            name={hotelData.name}
            description={hotelData.description}
            stars={hotelData.stars}
            reviewScore={hotelData.reviewScore}
            facilities={hotelData.facilities}
            policies={hotelData.policies}
          />

          <HotelPriceAndAction
            hotelId={hotelData._id}
            startingPrice={hotelData.startingPrice}
            availableRooms={hotelData.availableRoomCount}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function HotelImageCarousel({ images = [], altBase = "Hotel Image" }) {
  return (
    <Carousel>
      <CarouselContent>
        {images.map(({ _id, caption, url }) => (
          <CarouselItem key={_id} className="h-52">
            <ImageViewer src={url} alt={caption ?? `${altBase} ${index + 1}`} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}

function HotelDetails({
  name,
  description,
  stars = 0,
  reviewScore = 0,
  facilities = [],
  policies = [],
}) {
  return (
    <div className="p-4 sm:pr-0 flex-1">
      <div className="flex items-start justify-between mb-2 gap-2">
        <div className="flex gap-2">
          <h3 className="text-xl font-semibold">{name || "Hotel Name"}</h3>{" "}
          <Badge className="bg-muted text-muted-foreground h-fit">Hotel</Badge>
        </div>
        <div className="flex items-center ml-auto gap-2">
          <div className="flex items-center gap-1 px-2 py-1 text-sm rounded-md bg-primary text-primary-foreground whitespace-nowrap">
            <Star className="w-3.5 h-3.5 fill-current text-sm font-bold" />
            {stars} • {reviewScore}/10
          </div>
        </div>
      </div>
      <p className="mt-8 mb-2 text-sm text-muted-foreground line-clamp-2">
        {description}
      </p>
      <div className="space-y-2">
        <FeaturedFacilities facilities={facilities} />
        <FeaturedPolicies policies={getFeaturedRules(policies)} />
      </div>
    </div>
  );
}

function HotelPriceAndAction({ hotelId, startingPrice, availableRooms }) {
  const { priceCalcMethod, getStayDuration } = useHotelFilterStore();

  const shouldCalcTotalStay =
    priceCalcMethod === PRICE_CALCULATION_METHODS.totalStay;
  const stayDuration = getStayDuration();

  const displayPrice = shouldCalcTotalStay
    ? startingPrice * stayDuration
    : startingPrice;

  const displayUnit = shouldCalcTotalStay
    ? `${stayDuration} night${stayDuration > 1 ? "s" : ""}`
    : "night";

  return (
    <div className="flex md:min-w-[180px] flex-col items-center justify-between p-3 sm:rounded-r-lg bg-accent">
      <div>
        <PriceString
          price={displayPrice}
          unit={displayUnit}
          label="Starts from"
        />
      </div>
      {availableRooms > 0 ? (
        <Button asChild>
          <Link href={`/hotels/${hotelId || "placeholder-id"}`}>
            {availableRooms} room{availableRooms > 1 ? "s" : ""} available
          </Link>
        </Button>
      ) : (
        <Button variant="outline" disabled={true}>
          Unavailable
        </Button>
      )}
    </div>
  );
}

const FeaturedFacilities = ({ facilities }) => {
  const facilityData = getFacilities(facilities);

  return (
    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
      <div className="flex w-full overflow-y-scroll rounded-md gap-x-4 gap-y-2 whitespace-nowrap scrollbar-hide">
        {facilityData?.map(({ id, label, icon }) => {
          return (
            <div key={id} className="flex items-center gap-2">
              <DynamicIcon name={icon} FallbackIcon={FACILITY_DEFAULT_ICON} />
              <span>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FeaturedPolicies = ({ policies, className }) => {
  return (
    <div
      className={`flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground ${className}`}
    >
      {policies.map(({ id, label, icon, description }) => {
        return (
          <div key={id} className="flex items-center gap-1">
            <DynamicIcon name={icon} FallbackIcon={POLICY_DEFAULT_ICON} />
            <span className="block max-w-xs truncate">{label}</span>
          </div>
        );
      })}
    </div>
  );
};
