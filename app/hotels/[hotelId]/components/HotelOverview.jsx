import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Wifi,
  Coffee,
  Utensils,
  Waves,
  MapPin,
} from "lucide-react";
import { GUEST_REVIEW_LABELS } from "../../config";
import NearbyInterests from "./NearbyInterests";
import FeaturedFacilities from "./FeaturedFacilities";
import FeaturedPolicies from "./FeaturedPolicies";
import ExpandableParagraph from "@/app/components/ExpandableParagraph";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useHorizontalScroll } from "@/hooks/use-horizontal-scrolling";
import { cn, formatCurrency } from "@/lib/utils";

const tagIcons = {
  Beachfront: Waves,
  "Free WiFi": Wifi,
  "Breakfast Included": Coffee,
  Restaurant: Utensils,
  "City Center": MapPin,
};

const HotelOverview = ({ hotelData }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-6">
      <div className="flex-1 min-w-[300px]">
        <h1 className="mb-3 text-3xl font-bold">{hotelData.name}</h1>
        <div className="flex flex-col gap-4">
          <HotelFeatures hotelData={hotelData} />
          <div className="flex flex-col gap-2 pt-2 pb-3 px-4 bg-secondary rounded-lg">
            <div>
              <Label htmlFor="description">Description</Label>
              <ExpandableParagraph
                id="description"
                text={hotelData.description}
                maxLines={5}
              />
            </div>
            <div>
              <Label htmlFor="facilities">Featured Facilities</Label>
              <FeaturedFacilities
                id="facilities"
                facilityList={hotelData.hotelFacilitiesLinks}
              />
            </div>
            <div>
              <Label htmlFor="policies">Featured Policies</Label>
              <FeaturedPolicies id="policies" />
            </div>
          </div>
        </div>
      </div>
      <NearbyInterests />
    </div>
  );
};

const HotelFeatures = ({ hotelData }) => {
  const { scrollRef, scrollTo, canScrollLeft, canScrollRight } =
    useHorizontalScroll([
      ...hotelData.hotelTagAttributesLinks,
      { type: "rating" },
      { type: "review" },
      { type: "price" },
    ]);

  return (
    <div className="relative w-full">
      {canScrollLeft && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-[-1rem] top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background shadow-md"
          onClick={() => scrollTo("left")}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Scroll left</span>
        </Button>
      )}
      <div
        ref={scrollRef}
        className="flex gap-2 relative overflow-x-auto snap-x snap-mandatory scrollbar-hide"
      >
        <StarRating stars={hotelData.starRating} />
        <ReviewScore score={hotelData.reviewScore} />
        <StartingPrice roomTypes={hotelData.roomTypes} />
        <Tags tags={hotelData.hotelTagAttributesLinks} />
      </div>
      {canScrollRight && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-[-1rem] top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background shadow-md"
          onClick={() => scrollTo("right")}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Scroll right</span>
        </Button>
      )}
    </div>
  );
};

const HotelFeatureContainer = ({ children, className = "", ...props }) => (
  <div
    className={`grid gap-1 p-4 pb-3 w-fit bg-secondary rounded-lg snap-x flex-shrink-0 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const StarRating = ({ stars, className = "" }) => (
  <HotelFeatureContainer className={className}>
    <div className="flex items-center gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < stars
              ? "fill-primary text-primary"
              : "fill-muted text-muted-foreground"
          }`}
        />
      ))}
    </div>
    <span className="text-muted-foreground" aria-label={`${stars} Stars`}>
      {stars} Stars
    </span>
  </HotelFeatureContainer>
);

const ReviewScore = ({ score, className = "" }) => {
  const reviewLabel =
    GUEST_REVIEW_LABELS.find(({ min, max }) => score >= min && score < max)
      ?.label || "No Rating";

  return (
    <HotelFeatureContainer className={className}>
      <div className="flex items-baseline gap-2">
        <span className="w-fit h-fit py-0.5 px-1.5 bg-primary text-background rounded-md text-sm">
          {score}
        </span>
        <span className="mt-1 text-base text-foreground">{reviewLabel}</span>
      </div>
      <span
        className="flex items-center font-medium text-sm text-blue-500 cursor-pointer whitespace-nowrap"
        aria-label="See all reviews"
      >
        See all reviews <ChevronRight className="w-4 h-4" />
      </span>
    </HotelFeatureContainer>
  );
};

const StartingPrice = ({ roomTypes, className = "" }) => {
  const lowestPrice = Math.min(...roomTypes.map((room) => room.pricePerNight));

  return (
    <HotelFeatureContainer className={cn("min-w-fit max-w-[200px]", className)}>
      <div className="flex flex-col justify-start gap-2">
        <span className="flex items-baseline text-xl font-bold">
          {formatCurrency(lowestPrice)}
          <span className="text-sm text-muted-foreground">{"‎ /night"}</span>
        </span>
        <span className="text-sm text-muted-foreground">Starting price</span>
      </div>
    </HotelFeatureContainer>
  );
};

const TagCard = ({ tag, Icon, className = "" }) => (
  <HotelFeatureContainer
    className={`flex-shrink-0 w-fit max-w-[200px] ${className}`}
  >
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-foreground whitespace-nowrap overflow-clip">
        {tag.name}
      </span>
    </div>
    <span className="text-sm text-muted-foreground truncate">
      {tag.description}
    </span>
  </HotelFeatureContainer>
);

const Tags = ({ tags }) => (
  <>
    {tags.map(({ tag }) => (
      <TagCard key={tag.tagId} tag={tag} Icon={tagIcons[tag.name] || MapPin} />
    ))}
  </>
);

export default HotelOverview;
