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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ImageViewer } from "@/app/components/ImageViewer";
import { getTags } from "../../data/format-data/hotelTagData";
import { getFeaturedRules } from "../../data/format-data/hotelPolicyData";
import { getFacilities } from "../../data/format-data/hotelFacilityData";

export const Overview = ({ hotelData, id, className }) => {
  const { name, description, facilities, policies, location } = hotelData;

  return (
    <section
      id={id}
      className={cn("flex flex-col gap-6 sm:flex-row", className)}
    >
      <div className="flex-1 min-w-[300px]">
        <h1 className="mb-3 text-3xl font-bold">{name}</h1>
        <div className="flex flex-col gap-4">
          <HotelFeatures hotelData={hotelData} />
          <div className="flex flex-row gap-3">
            <div className="flex flex-col flex-grow gap-2 px-4 pt-2 pb-3 rounded-lg min-h-fit bg-secondary">
              <div>
                <Label htmlFor="description">Description</Label>
                <ExpandableParagraph id="description" text={description} />
              </div>
              <div>
                <Label htmlFor="facilities">Featured Facilities</Label>
                <FeaturedFacilities id="facilities" facilities={facilities} />
              </div>
              <div>
                <Label htmlFor="policies">Featured Policies</Label>
                <FeaturedPolicies
                  id="policies"
                  policies={getFeaturedRules(policies)}
                />
              </div>
            </div>
            <HotelLocation location={location} />
          </div>
        </div>
      </div>
    </section>
  );
};

const HotelFeatures = ({ hotelData }) => {
  const { stars, reviewScore, roomTypes } = hotelData;
  const tags = getTags(hotelData.tags);

  const { scrollRef, scrollTo, canScrollLeft, canScrollRight } =
    useHorizontalScroll([
      ...tags,
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
        <StarRating stars={stars} />
        <ReviewScore score={reviewScore} />
        <StartingPrice roomTypes={roomTypes} />
        <Tags tags={tags} />
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
    <span
      className="text-muted-foreground"
      aria-label={`${Math.floor(stars)} Stars`}
    >
      {stars} Stars
    </span>
  </HotelFeatureContainer>
);

const ReviewScore = ({ score, className = "" }) => {
  const reviewLabel =
    GUEST_REVIEW_LABELS.find(({ min, max }) => score >= min && score <= max)
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

const TagCard = ({ tag, className = "" }) => (
  <HotelFeatureContainer
    className={`flex-shrink-0 w-fit max-w-[200px] ${className}`}
  >
    <div className="flex items-center gap-2">
      <DynamicIcon
        name={tag.icon}
        FallbackIcon={TAG_DEFAULT_ICON}
        className="w-5 h-5 text-primary"
      />
      <span className="text-foreground whitespace-nowrap overflow-clip">
        {tag.label}
      </span>
    </div>
    <span className="text-sm truncate text-muted-foreground">
      {tag.description}
    </span>
  </HotelFeatureContainer>
);

const Tags = ({ tags }) => (
  <>
    {tags?.map((tag) => (
      <TagCard key={tag.id} tag={tag} />
    ))}
  </>
);

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
            <span className="block max-w-xs truncate">
              {label} - {description}
            </span>
          </div>
        );
      })}
    </div>
  );
};

function HotelLocation({ location, className }) {
  return (
    <div className={`flex-shrink sm:max-w-[300px] min-w-[300px] ${className}`}>
      <Card className="overflow-hidden">
        <CardHeader className="relative aspect-[16/9] p-0">
          <ImageViewer
            src={
              "https://res.cloudinary.com/dpmjwfqxw/image/upload/v1746078776/fallback_map_vector_zdqvs5.png"
            }
            alt="Map view of the hotel area"
            priority
          />
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="flex flex-col gap-2 text-base">
            <span className="font-medium break-words">{location?.address}</span>
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                location?.address
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
