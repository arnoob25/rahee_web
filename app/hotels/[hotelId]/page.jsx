"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { ImageGallery } from "./components/ImageGallery";
import { RoomCard } from "./components/RoomCard";
import { FacilitiesSection } from "./components/FacilitiesSection";
import { Star } from "lucide-react";
import { mockHotelData } from "./mockData";
import { HotelNav } from "./components/HotelNav";
import { getHotelDetails } from "./queryFunctions";
import RoomTypes from "./components/RoomTypes";
import HotelOverview from "./components/HotelOverview";

export default function Page() {
  const { hotelId } = useParams();

  // In development, use mock data
  const { data } = useQuery({
    queryKey: ["hotelDetails", hotelId],
    queryFn: () => getHotelDetails(hotelId),
    enabled: false, // !!hotelId,
    initialData: mockHotelData,
  });

  // TODO: use select property instead
  const hotelData = useMemo(() => data?.hotel_listing_hotels[0], [data]);

  if (!hotelData) return null;
  return (
    <div className="defaultPageWidth min-h-screen">
      {/* <section id="header">
        <ImageGallery images={hotelData.media} />
      </section>

      <HotelNav className='mt-2' /> */}

      {/* <section id="overview">
        <HotelOverview hotelData={hotelData} />
      </section> */}

      {/* <section id="rooms" className="container">
        <RoomTypes roomTypes={hotelData.roomTypes} />
      </section> */}

      <section id="facilities" className="container px-4 py-12 bg-muted/50">
        <h2 className="text-2xl font-bold mb-6">Facilities</h2>
        <FacilitiesSection facilities={hotelData.hotelFacilitiesLinks} />
      </section>

      {/* <section id="nearby" className="container px-4 py-12">
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
      </section> */}

      {/* // TODO similar properties: display other hotels that appeared in the search result */}
    </div>
  );
}
