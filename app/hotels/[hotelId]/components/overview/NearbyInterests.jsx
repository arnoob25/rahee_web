"use client";

import { ChevronRight, MapPin, Plane } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const LOCATION_DATA = {
  address: "78 Gulshan Avenue, Dhaka, 1212",
  coordinates: { lat: 23.7925, lng: 90.4078 },
  mapImage: "https://i.ibb.co/4dSdbzj/Screenshot-from-2024-11-27-10-35-28.png",
  nearbyPlaces: [
    { name: "Gulshan Circle 1", distance: "5 min walk", type: "location" },
    {
      name: "Gulshan South Paka Market D.N.C.C.",
      distance: "6 min walk",
      type: "location",
    },
    {
      name: "Embassy of the United States of America",
      distance: "4 min drive",
      type: "location",
    },
    {
      name: "Dhaka (DAC-Shahjalal Intl.)",
      distance: "35 min drive",
      type: "airport",
    },
  ],
};

export default function NearbyInterests({ className }) {
  return (
    <div className={`flex-shrink sm:max-w-[300px] min-w-[300px] ${className}`}>
      <Card className="overflow-hidden">
        <CardHeader className="relative aspect-[16/9] p-0">
          <Image
            src={LOCATION_DATA.mapImage}
            alt="Map view of the hotel area"
            fill
            className="object-cover"
            priority
          />
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="flex flex-col gap-2 text-base">
            <span className="font-medium break-words">
              {LOCATION_DATA.address}
            </span>
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                LOCATION_DATA.address
              )}`}
              className="text-primary hover:underline text-sm inline-flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              View in a map
              <ChevronRight className="h-4 w-4" />
            </Link>
          </CardTitle>
        </CardContent>
      </Card>

      {/* <Link
        href="#"
        className="inline-flex items-center text-primary hover:underline mt-4 text-sm group"
      >
        See more about this area
        <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
      </Link> */}

      {/* <div id="attractions" className="mt-3 space-y-2">
        {LOCATION_DATA.nearbyPlaces.map((place, index) => (
          <div key={index} className="flex items-start gap-3 text-sm">
            {place.type === "airport" ? (
              <Plane className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            ) : (
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-4">
                <span className="font-medium break-words">{place.name}</span>
                <span className="text-muted-foreground whitespace-nowrap flex-shrink-0">
                  {place.distance}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}
