import { Skeleton } from "@/components/ui/skeleton";

export function HotelListSkeleton() {
  return (
    <div className="flex flex-col gap-4 mt-5">
      {[...Array(3)].map((_, i) => (
        <HotelCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HotelCardSkeleton() {
  return (
    <div className="max-w-6xl min-w-80 overflow-hidden border rounded-lg">
      <div className="flex flex-col p-0 sm:flex-row">
        <div className="relative w-full sm:w-[30%]">
          <Skeleton className="h-52 w-full" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between flex-1">
          <div className="px-6 py-4 sm:pr-0 flex-1 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-6 w-24" />
            </div>

            <div className="pt-5 space-y-2">
              <div className="flex w-full overflow-y-scroll rounded-md gap-x-4 gap-y-3 whitespace-nowrap scrollbar-hide">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex md:min-w-[220px] flex-col items-center justify-between p-3 bg-accent space-y-4">
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-28" />
            </div>
            <Skeleton className="h-9 w-40 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
