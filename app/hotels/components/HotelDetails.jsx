import { HotelNav } from "./hotel-details/HotelNav";
import { Overview } from "./hotel-details/OverviewSection";
import { useGetHotelData } from "../data/getHotelDetails";
import { PolicySection as Policies } from "./hotel-details/PolicySection";
import { Facilities } from "./hotel-details/FacilitiesSection";
import { ImageGallery } from "./hotel-details/ImageGallery";
import { Reviews } from "./hotel-details/ReviewSection";
import { Rooms } from "./hotel-details/RoomsSection";
import { toast } from "sonner";
import HotelDetailsSkeleton from "./skeletons/HotelDetailSkeleton";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export default function HotelDetails({ hotelId, className }) {
  const { data: hotel, isLoading, error } = useGetHotelData(hotelId);
  const pageRef = useRef(null);

  if (error) {
    const message = error?.response?.errors?.[0]?.message;
    toast.error("Couldn't find hotel.", { description: message });
  }

  if (!hotel || isLoading) return <HotelDetailsSkeleton />;

  return (
    <div
      className={cn("h-full pb-20 overflow-y-auto scrollbar-hide", className)}
      ref={pageRef}
    >
      <section id="header">
        <ImageGallery images={hotel.media} />
      </section>

      <HotelNav className="mt-5 mb-10" containerRef={pageRef} />

      <div className="pb-6 space-y-52">
        <Overview id="overview" hotelData={hotel} />

        <Rooms id="rooms" roomTypes={hotel.roomTypes} />

        <Facilities id="facilities" facilities={hotel.facilities} />

        <Reviews
          id="reviews"
          reviews={hotel.reviews}
          reviewCount={hotel.reviewCount}
          reviewScore={hotel.reviewScore}
        />

        <Policies id="policies" policies={hotel.policies} />
      </div>
    </div>
  );
}
