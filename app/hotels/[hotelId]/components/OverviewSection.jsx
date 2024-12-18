import { ChevronRight, Star } from "lucide-react";
import { GUEST_REVIEW_LABELS } from "../../config";
import ExpandableParagraph from "@/app/components/ExpandableParagraph";
import { Label } from "@/components/ui/label";
import { useHorizontalScroll } from "@/hooks/use-scroll";
import { cn, formatCurrency } from "@/lib/utils";
import { DynamicIcon } from "@/app/components/DynamicIcon";
import {
  FACILITY_DEFAULT_ICON,
  POLICY_DEFAULT_ICON,
  TAG_DEFAULT_ICON,
} from "@/config/icons-map";
import { HorizontalScrollButtons } from "@/app/components/HorizontalScrollButtons";
import {
  featuredFacilities,
  featuredPolicies,
  LOCATION_DATA,
} from "../api/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ImageViewer } from "@/app/components/ImageViewer";

export const Overview = ({ hotelData }) => {
  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <div className="flex-1 min-w-[300px]">
        <h1 className="mb-3 text-3xl font-bold">{hotelData.name}</h1>
        <div className="flex flex-col gap-4">
          <HotelFeatures hotelData={hotelData} />
          <div className="flex flex-row gap-3">
            <div className="flex flex-col flex-grow gap-2 px-4 pt-2 pb-3 rounded-lg min-h-fit bg-secondary">
              <div>
                <Label htmlFor="description">Description</Label>
                <ExpandableParagraph
                  id="description"
                  text={hotelData.description}
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
            <NearbyInterests />
          </div>
        </div>
      </div>
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
    <HorizontalScrollButtons
      canScrollLeft={canScrollLeft}
      canScrollRight={canScrollRight}
      scrollTo={scrollTo}
      wideScreenOnly
      floating
    >
      <div
        ref={scrollRef}
        className="relative flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
      >
        <StarRating stars={hotelData.starRating} />
        <ReviewScore score={hotelData.reviewScore} />
        <StartingPrice roomTypes={hotelData.roomTypes} />
        <Tags tags={hotelData.hotelTagAttributesLinks} />
      </div>
    </HorizontalScrollButtons>
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
        className="flex items-center text-sm font-medium text-blue-500 cursor-pointer whitespace-nowrap"
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

const TagCard = ({ tag, iconName, className = "" }) => (
  <HotelFeatureContainer
    className={`flex-shrink-0 w-fit max-w-[200px] ${className}`}
  >
    <div className="flex items-center gap-2">
      <DynamicIcon
        name={iconName}
        FallbackIcon={TAG_DEFAULT_ICON}
        className="w-5 h-5 text-primary"
      />
      <span className="text-foreground whitespace-nowrap overflow-clip">
        {tag.name}
      </span>
    </div>
    <span className="text-sm truncate text-muted-foreground">
      {tag.description}
    </span>
  </HotelFeatureContainer>
);

const Tags = ({ tags }) => (
  <>
    {tags.map(({ tag }) => (
      <TagCard key={tag.tagId} iconName={tag.name} tag={tag} />
    ))}
  </>
);

const FeaturedFacilities = ({ hotelData = featuredFacilities }) => (
  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
    <div className="flex w-full gap-2 overflow-y-scroll rounded-md whitespace-nowrap scrollbar-hide">
      {hotelData.hotelFacilitiesLinks.map(({ facility }) => {
        return (
          <div key={facility.facilityId} className="flex items-center gap-2">
            <DynamicIcon
              name={facility.facilityCategory.name}
              FallbackIcon={FACILITY_DEFAULT_ICON}
            />
            <span>{facility.name}</span>
          </div>
        );
      })}
    </div>
  </div>
);

const FeaturedPolicies = ({ policies = featuredPolicies, className }) => {
  return (
    <div
      className={`flex flex-wrap gap-2 text-sm text-muted-foreground ${className}`}
    >
      {policies.map((policy) => {
        return (
          <div key={policy.policyId} className="flex items-center gap-1">
            <DynamicIcon
              name={policy.type}
              FallbackIcon={POLICY_DEFAULT_ICON}
            />
            <span>{policy.description}</span>
          </div>
        );
      })}
    </div>
  );
};

function NearbyInterests({ className }) {
  return (
    <div className={`flex-shrink sm:max-w-[300px] min-w-[300px] ${className}`}>
      <Card className="overflow-hidden">
        <CardHeader className="relative aspect-[16/9] p-0">
          <ImageViewer
            src={LOCATION_DATA.mapImage}
            alt="Map view of the hotel area"
            priority
          />
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="flex flex-col gap-2 text-base">
            <span className="font-medium break-words">
              {LOCATION_DATA.address}
            </span>
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                LOCATION_DATA.address
              )}`}
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View in a map
              <ChevronRight className="w-4 h-4" />
            </Link>
          </CardTitle>
        </CardContent>
      </Card>
    </div>
  );
}
