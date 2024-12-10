import { Clock, Heart, Info, Verified } from "lucide-react";
import { reviews } from "../api/mockData";
import { useHorizontalScroll } from "@/hooks/use-scroll";
import ExpandableParagraph from "@/app/components/ExpandableParagraph";
import { HorizontalScrollButtons } from "@/app/components/HorizontalScrollButtons";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Progress } from "@/components/ui/progress";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectContent, SelectItem } from "@radix-ui/react-select";

export function Reviews() {
  const { scrollRef, scrollTo, canScrollLeft, canScrollRight } =
    useHorizontalScroll(reviews);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-start">
        <GuestRating className="mr-14" />
        <ReviewList listRef={scrollRef} />
      </div>
      <div className="flex flex-row justify-end gap-2 mt-2">
        <ReviewsModal />
        <HorizontalScrollButtons
          wideScreenOnly
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          scrollTo={scrollTo}
        />
      </div>
    </div>
  );
}

function GuestRating({ className }) {
  return (
    <div className={`w-fit ${className}`}>
      <div className="flex items-center justify-start">
        <Heart className="w-5 h-5 mb-2 mr-2" />
        <h2 className="mb-2 text-lg font-semibold text-muted-foreground">
          Guest Rating:
        </h2>
      </div>
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
    <div className="flex-shrink max-w-full overflow-hidden">
      <div className="flex items-center justify-start">
        <Clock className="w-5 h-5 mb-2 mr-2" />
        <h2 className="mb-2 text-lg font-semibold text-muted-foreground">
          Recent reviews:
        </h2>
      </div>

      <div className="relative">
        <div
          ref={listRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
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
    <div className="flex-shrink-0 p-4 border rounded-lg max-w-96 min-w-72 snap-start">
      <div>
        <div className="font-semibold">
          {review.rating} {review.title}
        </div>
        {
          <ExpandableParagraph
            text={review.content}
            maxLines={2}
            className="text-sm text-gray-500"
          />
        }
      </div>
      <div className="pt-2 text-sm text-gray-500">
        <p>
          {review.author} • {review.date}
        </p>
      </div>
    </div>
  );
}

function ReviewsModal() {
  const categories = [
    { name: "Cleanliness", score: 9.6 },
    { name: "Staff & service", score: 9.4 },
    { name: "Amenities", score: 9.4 },
    { name: "Property conditions & facilities", score: 9.4 },
    { name: "Eco-friendliness", score: 9.0 },
  ];

  return (
    <ResponsiveModal title="Guest Reviews" triggerName="Show all reviews">
      <AverageRating />

      <div className="flex flex-col gap-6 overflow-y-auto">
        <ReviewCategories categories={categories} />
        {/* <ReviewFilters /> */}
        <AllReviews reviews={reviews} />
      </div>
    </ResponsiveModal>
  );
}

// #region modal components

function AverageRating() {
  return (
    <div>
      <div>
        <h2 className="text-3xl font-semibold">9.4/10 Exceptional</h2>
        <p className="text-sm text-muted-foreground">38 reviews</p>
      </div>
    </div>
  );
}

function ReviewCategories({ categories }) {
  return (
    <div className="mt-5 space-y-4">
      {categories.map((category) => (
        <div key={category.name} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{category.name}</span>
            <span>{category.score}/10</span>
          </div>
          <Progress value={(category.score / 10) * 100} className="h-2" />
        </div>
      ))}
    </div>
  );
}

function ReviewFilters() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select defaultValue="most-relevant">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="most-relevant">Most relevant</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="highest">Highest rating</SelectItem>
            <SelectItem value="lowest">Lowest rating</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Traveler type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="leisure">Leisure</SelectItem>
            <SelectItem value="family">Family</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function AllReviews({ reviews }) {
  return (
    <div className="space-y-6">
      {reviews.map((review, index) => (
        <div key={index} className="pb-4 border-b last:border-0">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold">{review.rating}</span>
              <span className="font-medium">{review.title}</span>
            </div>
            <p className="text-sm text-muted-foreground">{review.content}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                {review.author}
                <Verified className="w-3 h-3" />
              </span>
              <span>•</span>
              <span>{review.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// #endregion
