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

export function HotelCard({ hotelData = [{}] }) {
  const startingPrice = // lowest price
    hotelData.roomTypes?.length > 0
      ? Math.min(...hotelData.roomTypes.map((room) => room.pricePerNight))
      : 0;

  const hotelPreviewImages = [
    hotelData?.coverImage,
    ...(hotelData?.featuredImages ?? []),
  ];

  return (
    <Card className="min-w-[300px] overflow-hidden">
      <CardContent className="flex flex-col p-0 sm:flex-row">
        <div className="w-full sm:w-1/3">
          <HotelImageCarousel
            images={hotelPreviewImages}
            altBase={hotelData.name}
          />
        </div>

        <div className="flex flex-row justify-between flex-1">
          <HotelDetails
            name={hotelData.name}
            description={hotelData.description}
            starRating={hotelData.starRating}
            reviewScore={hotelData.reviewScore}
          />

          <HotelPriceAndAction
            startingPrice={startingPrice}
            hotelId={hotelData.hotelId}
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
        {images.map((image, index) => (
          <CarouselItem key={index} className="h-56">
            <ImageViewer src={image} alt={`${altBase} ${index + 1}`} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}

function HotelDetails({ name, description, starRating = 0, reviewScore = 0 }) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-xl font-semibold">{name || "Hotel Name"}</h3>
          <p className="text-sm text-muted-foreground">Hotel</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 text-sm rounded-md bg-primary text-primary-foreground">
            <Star className="w-4 h-4 fill-current" />
            {starRating}
          </div>
          <div className="text-sm text-muted-foreground">
            {reviewScore} rating
          </div>
        </div>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function HotelPriceAndAction({ startingPrice, hotelId }) {
  return (
    <div className="flex flex-col items-center justify-between p-3 rounded-lg bg-accent">
      <div>
        <PriceString price={startingPrice} label="Starts from" />
      </div>
      <Button asChild>
        <Link href={`/hotels/${hotelId || "placeholder-id"}`}>
          See availability
        </Link>
      </Button>
    </div>
  );
}
