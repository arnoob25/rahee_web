import { Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { reviews } from "../api/mockData";
import { useHorizontalScroll } from "@/hooks/use-scroll";

export function Reviews() {
  const { scrollRef, scrollTo, canScrollLeft, canScrollRight } =
    useHorizontalScroll(reviews);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-start">
        <RatingAggregate className="mt-5 mr-14" />
        <ReviewList listRef={scrollRef} />
      </div>
      <ScrollButtons
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
        scrollTo={scrollTo}
      />
    </div>
  );
}

function RatingAggregate({ className }) {
  return (
    <div className={`w-fit ${className}`}>
      <div className="flex items-start gap-2">
        <div>
          <h1 className="text-6xl font-light">9.4/10</h1>
          <p className="text-xl">Exceptional</p>
          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
            <span>38 verified reviews</span>
            <Info className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewList({ listRef }) {
  return (
    <div>
      <h2 className="text-lg font-semibold">Recent reviews</h2>
      <div className="relative">
        <div
          ref={listRef}
          className="flex gap-4 overflow-x-auto scroll-snap-x scroll-snap-mandatory"
        >
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="flex-shrink-0 max-w-sm p-4 border border-gray-300 rounded-lg min-w-72 scroll-snap-align-start">
      <div>
        <div className="font-semibold">
          {review.rating} {review.title}
        </div>
        <p className="text-sm text-gray-500">{review.content}</p>
        <button className="text-sm text-blue-500 underline">See more</button>
      </div>
      <div className="pt-2 text-sm text-gray-500">
        <p>{review.author}</p>
        <p>{review.date}</p>
      </div>
    </div>
  );
}

function ScrollButtons({ canScrollLeft, canScrollRight, scrollTo }) {
  return (
    <div
      className={cn(
        "flex gap-2 ml-auto w-fit h-fit",
        !canScrollLeft && !canScrollRight && "hidden"
      )}
    >
      <Button
        variant="outlined"
        className="p-2 border rounded-full"
        onClick={() => scrollTo("left")}
        aria-label="Scroll left"
        disabled={!canScrollLeft}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button
        variant="outlined"
        className="p-2 border rounded-full"
        onClick={() => scrollTo("right")}
        aria-label="Scroll right"
        disabled={!canScrollRight}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>
    </div>
  );
}
