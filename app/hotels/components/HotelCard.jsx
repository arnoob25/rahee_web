"use client";

import { ChevronRight, Heart, Star } from "lucide-react";
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
import { useDateRangeStore, usePriceRangeStore } from "../data/hotelFilters";
import { PRICE_CALCULATION_METHODS } from "../config";
import { getFacilities } from "../data/format-data/hotelFacilityData";
import { getFeaturedRules } from "../data/format-data/hotelPolicyData";
import { useGetCategorizedImages } from "../data/format-data/categorizeImages";
import { selectedHotelStore } from "../data/selectedHotel";
import { useImageViewerModal } from "@/app/components/ImageViewerModal";

export function HotelCard({ hotelData, disabled }) {
  const { selectedHotelId, setSelectedHotelId } = selectedHotelStore();
  const { coverImages, featuredImages } = useGetCategorizedImages(
    hotelData.media
  );

  const isCardSelected = hotelData._id === selectedHotelId;

  if (!hotelData._id) return <>Loading</>;

  return (
    <Card
      className={`max-w-6xl min-w-80 overflow-hidden ${
        isCardSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      <CardContent className="flex flex-col p-0 sm:flex-row">
        <div className="relative  w-full sm:w-1/3">
          <Badge className="absolute top-1 left-1 z-50 h-fit">Hotel</Badge>
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
            onClick={setSelectedHotelId}
            isSelected={isCardSelected}
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function HotelImageCarousel({ images = [], altBase = "Hotel Image" }) {
  const displayModal = useImageViewerModal();
  return (
    <Carousel>
      <CarouselContent>
        {images.map(({ _id, caption, url }, index) => (
          <CarouselItem
            key={_id}
            className="h-52"
            onClick={() => displayModal(images, index)}
          >
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
        <h3 className="text-xl font-semibold">{name || "Hotel Name"}</h3>{" "}
        <div className="flex items-center gap-2 px-2 py-1 ml-auto text-sm rounded-md border whitespace-nowrap">
          <span className="flex items-center gap-0.5">
            <Star className="w-3.5 h-3.5 text-sm font-bold" />
            {stars}
          </span>
          <span className="flex items-center gap-0.5">
            <Heart className="w-3.5 h-3.5 text-sm font-bold" />
            {reviewScore}
          </span>
        </div>
      </div>
      {/* <p className="mt-8 mb-2 text-sm text-muted-foreground line-clamp-2">
        {description}
      </p> */}
      <div className="space-y-2 max-w-full overflow-hidden">
        <FeaturedFacilities facilities={facilities} />
        <FeaturedPolicies policies={getFeaturedRules(policies)} />
      </div>
    </div>
  );
}

function HotelPriceAndAction({
  hotelId,
  startingPrice,
  availableRooms,
  onClick,
  isSelected,
  disabled,
}) {
  const { priceCalcMethod } = usePriceRangeStore();
  const { getStayDuration } = useDateRangeStore();

  const shouldCalcTotalStay =
    priceCalcMethod === PRICE_CALCULATION_METHODS.TOTAL_STAY;
  const stayDuration = getStayDuration();

  const displayPrice = shouldCalcTotalStay
    ? startingPrice * stayDuration
    : startingPrice;

  const displayUnit = shouldCalcTotalStay
    ? `${stayDuration} night${stayDuration > 1 ? "s" : ""}`
    : "night";

  return (
    <div className="flex md:min-w-[30%] flex-col items-center justify-between p-3 sm:rounded-r-lg bg-accent">
      <div>
        <PriceString
          size="md"
          price={displayPrice}
          unit={displayUnit}
          label="Starts from"
        />
      </div>
      {availableRooms > 0 ? (
        <Button
          disabled={disabled}
          onClick={() => onClick(hotelId)}
          className={
            isSelected
              ? "bg-secondary border-muted-foreground text-secondary-foreground shadow-none hover:text-primary-foreground"
              : ""
          }
        >
          <span className="flex justify-start items-center gap-2">
            {availableRooms} room{availableRooms > 1 ? "s" : ""} available{" "}
            <ChevronRight className="w-4 h-4" />
          </span>
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
    <div className="text-sm text-muted-foreground">
      <div className="flex flex-wrap gap-x-4 gap-y-2 max-h-[3.5rem] overflow-hidden">
        {facilityData?.map(({ id, label, icon }) => (
          <div key={id} className="flex items-center gap-1">
            <DynamicIcon name={icon} FallbackIcon={FACILITY_DEFAULT_ICON} />
            <span className="whitespace-nowrap">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FeaturedPolicies = ({ policies, className }) => {
  return (
    <div
      className={`flex flex-nowrap overflow-hidden gap-x-4 text-sm text-muted-foreground ${className}`}
    >
      {policies.map(({ id, label, icon }) => (
        <div key={id} className="flex items-center gap-1 shrink-0">
          <DynamicIcon name={icon} FallbackIcon={POLICY_DEFAULT_ICON} />
          <span className="truncate max-w-40">{label}</span>
        </div>
      ))}
    </div>
  );
};
