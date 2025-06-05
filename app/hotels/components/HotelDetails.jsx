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
      className={cn("h-full overflow-y-auto scrollbar-hide", className)}
      ref={pageRef}
    >
      <section id="header">
        <ImageGallery images={hotel.media} />
      </section>

      <HotelNav className="mt-2 mb-5" containerRef={pageRef} />

      <div className="space-y-32">
        <section id="overview">
          <Overview hotelData={hotel} />
        </section>

        <section id="rooms">
          <Rooms roomTypes={hotel.roomTypes} />
        </section>

        <section id="facilities">
          <h2 className="py-2 text-2xl font-bold">Facilities</h2>
          <Facilities facilities={hotel.facilities} />
        </section>

        <section id="reviews" className="pt-12">
          <Reviews
            reviews={hotel.reviews}
            reviewCount={hotel.reviewCount}
            reviewScore={hotel.reviewScore}
          />
        </section>

        <section id="policy">
          <h2 className="mb-6 text-2xl font-bold">Hotel Policy</h2>
          <Policies policies={hotel.policies} />
        </section>
      </div>
    </div>
  );
}
