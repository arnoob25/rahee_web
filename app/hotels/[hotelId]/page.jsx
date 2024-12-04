"use client";

import { useParams } from "next/navigation";
import { ImageGallery } from "./components/ImageGallery";
import { FacilitiesSection } from "./components/FacilitiesSection";
import { HotelNav } from "./components/HotelNav";
import Rooms from "./components/RoomsSection";
import HotelOverview from "./components/HotelOverview";
import { useGetHotelDetails } from "./api/useGetHotelDetails";

export default function Page() {
  const { hotelId } = useParams();

  const [hotelData, error] = useGetHotelDetails(hotelId);

  return (
    <div className="defaultPageWidth min-h-screen">
      <section id="header">
        <ImageGallery images={hotelData.media} />
      </section>

      <HotelNav className="mt-2" />

      <section id="overview">
        <HotelOverview hotelData={hotelData} />
      </section>

      <section id="rooms" className="container">
        <Rooms roomTypes={hotelData.roomTypes} />
      </section>

      <section id="facilities" className="container">
        <h2 className="text-2xl font-bold mb-6">Facilities</h2>
        <FacilitiesSection facilities={hotelData.hotelFacilitiesLinks} />
      </section>

      <section id="nearby" className="container px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">What's Nearby</h2>
        <p className="text-muted-foreground">Located at {hotelData.address}</p>
      </section>

      <section id="policy" className="container px-4 py-12 bg-muted/50">
        <h2 className="text-2xl font-bold mb-6">Hotel Policy</h2>
        <div
          className="prose
max-w-none"
        >
          <h3>Check-in/Check-out</h3>
          <ul>
            <li>Check-in time: 2:00 PM</li>
            <li>Check-out time: 12:00 PM</li>
          </ul>
          <h3>Cancellation Policy</h3>
          <p>
            Free cancellation up to 24 hours before check-in. Please check room
            conditions for more details.
          </p>
        </div>
      </section>

      {/* // TODO similar properties: display other hotels that appeared in the search result */}
    </div>
  );
}
