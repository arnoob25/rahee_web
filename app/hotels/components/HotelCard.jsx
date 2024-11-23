"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function HotelCard({ hotelData = [{}] }) {
  const lowestPrice =
    hotelData.roomTypes.length > 0
      ? Math.min(...hotelData.roomTypes.map((room) => room.pricePerNight))
      : 0; // Fallback to 0 if no room types

  return (
    <Card className="min-w-[300px] overflow-hidden">
      <CardContent className="p-0 flex flex-col sm:flex-row">
        {/* Image Carousel */}
        <div className="relative w-full sm:w-1/3">
          <Carousel className="w-full h-full">
            <CarouselContent>
              {[...Array(5)].map((_, index) => (
                <CarouselItem key={index} className="h-full">
                  <div className="relative aspect-[4/3] sm:aspect-auto sm:h-full">
                    <Image
                      src="/placeholder.svg" // Placeholder image
                      alt={`${hotelData.name} photo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
          {/* <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white/90"
          >
            <Heart className="h-5 w-5" />
            <span className="sr-only">Add to favorites</span>
          </Button> */}
        </div>

        {/* Hotel Details */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-xl">
                  {hotelData.name || "Hotel Name"}
                </h3>
                <p className="text-sm text-muted-foreground">Hotel</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary text-primary-foreground text-sm px-2 py-1 rounded-md flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current" />
                  {hotelData.starRating || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  {hotelData.reviewScore || 0} rating
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {hotelData.description}
            </p>
          </div>

          {/* Price and Action */}
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-muted-foreground">From</div>
              <div className="font-semibold text-2xl">${lowestPrice}</div>
            </div>
            <Button asChild>
              <Link href={`/hotels/${hotelData.hotelId || "placeholder-id"}`}>
                See availability
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
