import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function BookingSummarySkeleton() {
  return (
    <div className="h-full overflow-hidden bg-secondary rounded-xl px-5 pt-6 pb-7 space-y-8">
      <Card className="w-full flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-sm">
        {/* Image Placeholder */}
        <div className="w-full md:w-1/3 h-60 md:h-auto">
          <Skeleton className="object-cover w-full h-full" />
        </div>

        {/* Content Placeholder */}
        <CardContent className="flex-1 py-4 flex flex-col justify-between gap-5">
          <div>
            <Skeleton className="h-6 w-2/3 mb-2" />
            <div className="flex items-center gap-4 text-sm">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-2 max-h-[3.5rem] overflow-hidden mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-20" />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 space-y-7">
        {/* Duration / Guests Section */}
        <div className="flex justify-around items-center gap-4 px-2 md:px-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-full flex items-center justify-center gap-5"
            >
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <GuestDetailsFormSkeleton />
      </div>
    </div>
  );
}

function GuestDetailsFormSkeleton({ adultsCount = 2, childrenCount = 1 }) {
  return (
    <div className="border border-border rounded-xl space-y-9 p-5 py-8">
      <div className="space-y-6">
        {Array.from({ length: adultsCount }).map((_, index) => (
          <PersonSkeleton key={index} />
        ))}
      </div>

      <div className="space-y-6">
        {Array.from({ length: childrenCount }).map((_, index) => (
          <PersonSkeleton key={index + adultsCount} />
        ))}
      </div>
    </div>
  );
}

function PersonSkeleton() {
  return (
    <div className="space-y-1.5">
      <Skeleton className="h-6 w-32" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}
