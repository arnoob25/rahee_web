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
      <div className="mt-36 mx-auto max-w-md rounded-2xl border border-border px-8 pt-10 pb-20 text-center shadow-sm relative bg-muted/40">
        <div className="text-lg font-semibold text-foreground mb-4">
          No reservations have been made
        </div>
        <div className="relative flex justify-center items-center mx-auto w-4h-44 h-44">
          <Hotel className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10" />
          <X className="absolute -bottom-14 right-12 w-32 h-32 opacity-15" />
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
