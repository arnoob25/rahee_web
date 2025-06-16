"use client";

import { reservationsStore } from "./reservations";
import AuthChecker from "./components/AuthChecker";

import { PriceSummary } from "./components/PriceSummary";
import ReviewBookings from "./components/ReviewBookings";
import { PaymentMethod } from "./components/PaymentMethods";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Hotel, X } from "lucide-react";

export default function Page() {
  const { reservations } = reservationsStore();
  const router = useRouter();

  if (reservations.length === 0) {
    router.push(`/hotels`);
    toast.warning("No reservation has been made.", {
      description: "Search to find your ideal stay.",
    });

    return (
      <div className="w-full relative h-screen">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-fit h-fit rounded-2xl border border-border px-8 pt-10 pb-20 text-center shadow-sm bg-background">
          <div className="text-lg text-foreground/60 mb-7">
            No reservations have been made
          </div>

          <div className="relative w-44 h-44 mx-auto">
            {/* Hotel icon as faint background */}
            <Hotel className="absolute inset-0 w-full h-full opacity-10 text-foreground" />

            {/* Main red X on top-right corner */}
            <X
              strokeWidth={3}
              className="absolute -bottom-5 -right-2 w-20 h-20 text-muted-foreground opacity-20 z-10"
            />

            {/* Subtle translucent X overlay */}
            <X
              strokeWidth={7}
              className="absolute -bottom-5 -right-2 w-20 h-20 text-background z-0"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 max-w-6xl mx-auto gap-24 px-4">
      <div className="col-span-3 mr-8">
        <AuthChecker />
        <ReviewBookings reservations={reservations} />
      </div>
      <div className="sticky top-28 m-0 right-0 z-[100] h-fit col-span-2">
        <PriceSummary reservations={reservations} />
        <PaymentMethod />
      </div>
    </div>
  );
}
