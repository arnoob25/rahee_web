import { cn } from "@/lib/utils";
const { Button } = require("@/components/ui/button");
const { ChevronLeft, ChevronRight } = require("lucide-react");

export function HorizontalScrollButtons({
  canScrollLeft = false,
  canScrollRight = true,
  scrollTo = () => {},
  wideScreenOnly = false,
  floating = false,
  children,
  className,
}) {
  if (floating) {
    const visibilityBasedOnDisplaySize = wideScreenOnly ? "hidden md:flex" : "";

    return (
      <div className="relative w-full">
        {canScrollLeft && (
          <CarouselButton
            floating
            left
            scrollTo={scrollTo}
            className={visibilityBasedOnDisplaySize}
          />
        )}
        <div>{children}</div>
        {canScrollRight && (
          <CarouselButton
            floating
            right
            scrollTo={scrollTo}
            className={visibilityBasedOnDisplaySize}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "hidden space-x-1 w-fit h-fit",
        canScrollLeft || canScrollRight
          ? wideScreenOnly
            ? "md:block"
            : "block"
          : "",
        className
      )}
    >
      <CarouselButton left scrollTo={scrollTo} disabled={!canScrollLeft} />
      <CarouselButton right scrollTo={scrollTo} disabled={!canScrollRight} />
    </div>
  );
}

const CarouselButton = ({
  floating = false,
  left = false,
  right = false,
  scrollTo,
  disabled = false,
  className,
}) => {
  const Icon = left ? ChevronLeft : ChevronRight;
  const scrollDirection = left ? "left" : "right";

  if (floating) {
    return (
      <Button
        variant="outline"
        size="icon"
        className={cn(
          left ? "left-[0.5rem]" : "right-[0.5rem]", // offset from the edge of the container
          `absolute top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background shadow-md`,
          className
        )}
        onClick={() => scrollTo(scrollDirection)}
      >
        <Icon className="w-4 h-4" />
        <span className="sr-only">Scroll {scrollDirection}</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outlined"
      className={cn("p-2 border rounded-full", className)}
      onClick={() => scrollTo(scrollDirection)}
      aria-label={`Scroll ${scrollDirection}`}
      disabled={disabled}
    >
      <Icon className="w-6 h-6" />
    </Button>
  );
};
