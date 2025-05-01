"use client";

import { useParams } from "next/navigation";
import { HotelNav } from "./components/HotelNav";
import { Rooms } from "./components/RoomsSection";
import { Overview } from "./components/OverviewSection";
import { useGetHotelData } from "./data/useGetHotelData";
import { PolicySection as Policies } from "./components/PolicySection";
import { Reviews } from "./components/ReviewSection";
import { Facilities } from "./components/FacilitiesSection";
import { ImageGallery } from "./components/ImageGallery";

export default function Page() {
  const { hotelId } = useParams();

  const { data: hotel, isLoading, error } = useGetHotelData(hotelId);

  if (!hotel || isLoading || error) return "loading";

  return (
    <div className="min-h-screen max-w-default">
      <section id="header">
        <ImageGallery images={hotel.media} />
      </section>

      <HotelNav className="mt-2" />

      <section id="overview">
        <Overview hotelData={hotel} />
      </section>

      <section id="rooms" className="mt-16">
        <Rooms roomTypes={hotel.roomTypes} />
      </section>

      <section id="facilities" className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">Facilities</h2>
        <Facilities facilities={hotel.facilities} />
      </section>

      <section id="reviews" className="mt-28">
        <Reviews
          reviews={hotel.reviews}
          reviewCount={hotel.reviewCount}
          reviewScore={hotel.reviewScore}
        />
      </section>

      <section id="policy" className="mt-20">
        <h2 className="mb-6 text-2xl font-bold">Hotel Policy</h2>
        <Policies policies={hotel.policies} />
      </section>
    </div>
  );
}
