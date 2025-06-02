import { Skeleton } from "@/components/ui/skeleton";

export default function HotelDetailsSkeleton() {
  return (
    <div className="p-4">
      <ImageGallerySkeleton />
      <OverviewSkeleton />
      <RoomsSkeleton />
      <FacilitiesSkeleton />
      <ReviewsSkeleton />
      <PolicySectionSkeleton />
    </div>
  );
}

export function ImageGallerySkeleton() {
  return (
    <div className="flex gap-4 rounded-lg">
      <Skeleton className="w-2/3 aspect-[4/3] rounded-lg" />
      <div className="flex flex-col gap-4 w-1/3">
        <Skeleton className="w-full aspect-[4/3] rounded-lg" />
        <Skeleton className="w-full aspect-[4/3] rounded-lg" />
      </div>
    </div>
  );
}

export function OverviewSkeleton() {
  return (
    <div className="mt-14 flex flex-col gap-6 sm:flex-row">
      <div className="flex-1 min-w-[300px]">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col flex-grow gap-5 p-4 pt-6 pb-3 rounded-lg bg-secondary/70">
              <Skeleton className="h-16 w-full rounded-md" />
              <div className="flex gap-3 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-6 w-24 rounded-md flex-shrink-0"
                  />
                ))}
              </div>
              <div className="flex gap-3 flex-wrap">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-5 w-40 rounded-md" />
                ))}
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden grid grid-rows-[200px_auto] min-w-[300px]">
              <Skeleton className="h-full w-full" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RoomsSkeleton() {
  return (
    <div className="mt-20 flex flex-col gap-4">
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full border" />
        ))}
      </div>
      <div className="flex gap-3 overflow-x-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="min-w-80 max-w-96 flex-shrink-0 grid grid-rows-[200px_auto_auto] border rounded-lg"
          >
            <Skeleton className="h-full w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-32" />
              {[...Array(2)].map((_, j) => (
                <Skeleton key={j} className="h-4 w-40" />
              ))}
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FacilitiesSkeleton() {
  return (
    <>
      <Skeleton className="mt-24 h-10 w-1/5 mb-4" />
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-lg w-full min-w-60">
            <div className="flex items-center justify-center gap-2 p-3 pt-4">
              <Skeleton className="w-5 h-5 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <Skeleton className="w-4 h-4 rounded-full" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function ReviewsSkeleton() {
  return (
    <div className="mt-10 flex flex-col">
      <Skeleton className="mt-24 h-10 w-1/5" />
      <div className="mt-6 flex gap-4 overflow-hidden snap-x snap-mandatory">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 p-4 border rounded-lg max-w-96 min-w-72 snap-start space-y-3"
          >
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PolicySectionSkeleton() {
  return (
    <>
      <Skeleton className="mt-24 h-10 w-1/5" />
      <div className="mt-5">
        <div className="flex gap-2 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="px-6 py-4 border rounded-lg min-w-fit space-y-2"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="w-6 h-6 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 py-2 space-y-4 rounded-lg">
        <div className="flex gap-6">
          <div className="hidden max-w-sm min-w-fit md:block">
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-40 rounded-md" />
              ))}
            </div>
          </div>
          <div className="flex-grow border md:max-h-[28rem] overflow-hidden rounded-lg">
            <div className="flex flex-col gap-5 p-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg">
                  <div className="sticky top-0 py-4 bg-background px-4 flex items-center gap-2">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <div className="flex flex-col gap-4 pl-12 pt-2 pb-4">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-4 h-4 rounded-full" />
                          <Skeleton className="h-4 w-40" />
                        </div>
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
