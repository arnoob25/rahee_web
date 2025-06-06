import { Clock, Heart, Info, Verified } from "lucide-react";
import { useHorizontalScroll } from "@/hooks/use-scroll";
import ExpandableParagraph from "@/app/components/ExpandableParagraph";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Progress } from "@/components/ui/progress";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectContent, SelectItem } from "@radix-ui/react-select";
import { getReviewSummary } from "../../data/format-data/hotelReviewData";
import { toReadableDate } from "@/lib/date-parsers";
import { REVIEW_CATEGORIES } from "../../config";
import { HorizontalScrollButtons } from "@/app/components/HorizontalScrollButtons";
import { cn } from "@/lib/utils";

export function Reviews({
  reviews = [],
  reviewCount,
  reviewScore,
  className,
  id,
}) {
  /*  */
  const { scrollRef, scrollTo, canScrollLeft, canScrollRight } =
    useHorizontalScroll(reviews);

  // TODO loading skeleton
  if (reviews.length === 0) return null;

  return (
    <section id={id} className={cn("flex flex-col", className)}>
      <div className="flex flex-row items-start">
        <GuestRating
          totalReviews={reviewCount}
          averageScore={reviewScore}
          className="mr-14"
        />
        <ReviewList listRef={scrollRef} reviews={reviews} />
      </div>
      <div className="flex flex-row justify-end gap-2 mt-2">
        {canScrollLeft ||
          (canScrollRight && (
            <ReviewsModal
              reviews={reviews}
              totalReviews={reviewCount}
              averageScore={reviewScore}
            />
          ))}
        <HorizontalScrollButtons
          wideScreenOnly
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          scrollTo={scrollTo}
        />
      </div>
    </section>
  );
}

function GuestRating({ totalReviews, averageScore, className }) {
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
          <h1 className="text-6xl font-light">{averageScore}/10</h1>
          <p className="text-xl">{getReviewSummary(averageScore)}</p>
          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
            <span>
              {totalReviews} verified review{totalReviews > 1 ? "s" : ""}
            </span>
            <Info className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewList({ listRef, reviews }) {
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
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ review }) {
  const { rating, content, author, createdAt } = review;
  return (
    <div className="flex-shrink-0 p-4 border rounded-lg max-w-96 min-w-72 snap-start">
      <div>
        <div className="font-semibold">
          {rating}/10 {getReviewSummary(rating)}
        </div>
        {
          <ExpandableParagraph
            text={content}
            maxLines={2}
            className="text-sm text-gray-500"
          />
        }
      </div>
      <div className="pt-2 text-sm text-gray-500">
        <p>
          by {author.username} • {toReadableDate(createdAt)}
        </p>
        <span className="flex items-center gap-1"></span>
      </div>
    </div>
  );
}

function ReviewsModal({ reviews, totalReviews, averageScore }) {
  return (
    <ResponsiveModal title="Guest Reviews" triggerName="Show all reviews">
      <div>
        <div>
          <h2 className="text-3xl font-semibold">
            {averageScore}/10 {getReviewSummary(averageScore)}
          </h2>
          <p className="text-sm text-muted-foreground">
            {totalReviews} reviews
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-6 overflow-y-auto">
        <ReviewCategories />
        {/* <ReviewFilters /> */}
        <AllReviews reviews={reviews} />
      </div>
    </ResponsiveModal>
  );
}

// #region modal components

function ReviewCategories() {
  return (
    <div className="mt-5 space-y-4">
      {REVIEW_CATEGORIES.map((category) => (
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
      {reviews.map(({ _id, rating, content, author, createdAt }) => (
        <div key={_id} className="pb-4 border-b last:border-0">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold">{rating}</span>
              <span className="font-medium">
                {getReviewSummary(rating)}
              </span>{" "}
            </div>
            <p className="text-sm text-muted-foreground">{content}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                {author.username}
                <Verified className="w-3 h-3" />
              </span>
              <span>•</span>
              <span>{toReadableDate(createdAt)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// #endregion
