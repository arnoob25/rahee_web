"use client";

import { format } from "date-fns";
import { getDurationBetweenDateStrings } from "@/lib/date-parsers";
import { useGetReservationData } from "../reservations";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useRef, useState } from "react";

export function PriceSummary({ reservations }) {
  const checkInDate = reservations[0]?.checkInDate;
  const checkOutDate = reservations[0]?.checkOutDate;

  const duration =
    checkInDate && checkOutDate
      ? getDurationBetweenDateStrings(checkInDate, checkOutDate)
      : 0;

  const totalCost = reservations.reduce((totalCost, reservation) => {
    const totalCostForRoom = reservation.pricePerNight * duration;
    return totalCost + totalCostForRoom;
  }, 0);

  return (
    <Card className="max-w-3xl mx-auto bg-background text-foreground shadow-sm">
      <CardHeader className="bg-muted/40 rounded-t-lg border-b">
        <CardTitle>
          <div className="text-base text-muted-foreground">Booking Summary</div>
          <div className="text-xl mt-0.5">
            {checkInDate && checkOutDate && (
              <>
                {format(new Date(checkInDate), "EEE, MMM d")} –{" "}
                {format(new Date(checkOutDate), "EEE, MMM d")}
                <span className="text-foreground/60">
                  {" "}
                  ({duration} {duration !== 1 ? "nights" : "night"})
                </span>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 py-6 px-3">
        <Accordion type="multiple" className="w-full">
          {reservations.map((reservation) => (
            <ReservationPriceCard
              key={reservation.id}
              reservation={reservation}
            />
          ))}
        </Accordion>

        <div className="flex flex-col pt-6 px-4 border-t">
          <span className="text-muted-foreground">Total Cost: </span>
          <span className="text-4xl text-primary/90">{totalCost}৳</span>
        </div>
      </CardContent>
    </Card>
  );
}

function ReservationPriceCard({ reservation }) {
  const { hotel, roomType, duration, totalCost } = useGetReservationData(
    reservation.id
  );
  const pricePerNight = roomType?.pricePerNight || 0;
  const totalGuests = reservation.adults.length + reservation.children.length;

  const guestsLabel = `${reservation.adults.length} adult${
    reservation.adults.length !== 1 ? "s" : ""
  }${
    reservation.children.length
      ? ` and ${reservation.children.length} child${
          reservation.children.length !== 1 ? "ren" : ""
        }`
      : ""
  }`;

  return (
    <AccordionItem value={reservation.id}>
      <AccordionTrigger className="text-sm sm:text-base px-3 font-medium text-foreground hover:text-primary hover:no-underline transition">
        <div className="flex flex-col items-start text-left">
          <span>
            ৳{" "}
            <span className="font-semibold text-primary">{totalCost} for </span>
            {totalGuests} {totalGuests !== 1 ? "guests" : "guest"}
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="space-y-2 px-3 text-sm">
        <div className="text-foreground/90">
          {roomType?.name || "Room"} for {guestsLabel}{" "}
          <span className="text-muted-foreground">
            at {hotel?.name || "Hotel"}
          </span>
        </div>

        <div>
          Stay: {duration} night{duration !== 1 ? "s" : ""} × {pricePerNight}৳
        </div>
        <div className="text-foreground font-semibold">
          Room Total: {totalCost}৳
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
