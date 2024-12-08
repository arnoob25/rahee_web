"use client";

import { useParams } from "next/navigation";
import { ImageGallery } from "./components/ImageGallery";
import { HotelNav } from "./components/HotelNav";
import { Rooms } from "./components/RoomsSection";
import { Overview } from "./components/OverviewSection";
import { useGetHotelDetails } from "./api/useGetHotelDetails";
import { Policies } from "./components/PolicySection";
import { Reviews } from "./components/ReviewSection";
import { Facilities } from "./components/FacilitiesSection";

export default function Page() {
  const { hotelId } = useParams();

  const [hotelData, error] = useGetHotelDetails(hotelId);

  return (
    <div className="min-h-screen defaultPageWidth">
      <section id="header">
        <ImageGallery images={hotelData.media} />
      </section>

      <HotelNav className="mt-2" />

      <section id="overview">
        <Overview hotelData={hotelData} />
      </section>

      <section id="rooms">
        <Rooms roomTypes={hotelData.roomTypes} />
      </section>

      <section id="facilities">
        <h2 className="mb-6 text-2xl font-bold">Facilities</h2>
        <Facilities facilities={hotelData.hotelFacilitiesLinks} />
      </section>

      <section id="policy">
        <h2 className="mb-6 text-2xl font-bold">Hotel Policy</h2>
        <Policies />
      </section>

      <section id="reviews">
        <h2 className="mb-6 text-2xl font-bold">Reviews</h2>
        <Reviews />
      </section>
    </div>
  );
}

// TODO similar properties: display other hotels that appeared in the search result */
