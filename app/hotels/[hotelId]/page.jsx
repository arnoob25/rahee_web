"use client";

import { useParams } from "next/navigation";
import { HotelNav } from "./components/HotelNav";
import { Rooms } from "./components/RoomsSection";
import { Overview } from "./components/OverviewSection";
import { useGetHotelDetails } from "./api/useGetHotelDetails";
import { Policies } from "./components/PolicySection";
import { Reviews } from "./components/ReviewSection";
import { Facilities } from "./components/FacilitiesSection";
import { images } from "./api/mockData";
import { ImageGallery } from "./components/ImageGallery";

export default function Page() {
  const { hotelId } = useParams();

  const [hotelData, error] = useGetHotelDetails(hotelId);

  return (
    <div className="min-h-screen max-w-default">
      <section id="header">
        <ImageGallery images={images} />
      </section>

      <HotelNav className="mt-2" />

      <section id="overview">
        <Overview hotelData={hotelData} />
      </section>

      <section id="rooms" className="mt-16">
        <Rooms roomTypes={hotelData.roomTypes} />
      </section>

      <section id="facilities" className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">Facilities</h2>
        <Facilities facilities={hotelData.hotelFacilitiesLinks} />
      </section>

      <section id="reviews" className="mt-28">
        <Reviews />
      </section>

      <section id="policy" className="mt-20">
        <h2 className="mb-6 text-2xl font-bold">Hotel Policy</h2>
        <Policies />
      </section>
    </div>
  );
}

// TODO similar properties: display other hotels that appeared in the search result */
