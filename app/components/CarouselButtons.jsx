import { cn } from "@/lib/utils";
const { Button } = require("@/components/ui/button");
const { ChevronLeft, ChevronRight } = require("lucide-react");

export function CarouselButtons({
  canScrollLeft = false,
  canScrollRight = true,
  scrollTo = () => {},
  isWideScreenOnly = true,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-row gap-2 w-fit h-fit",
        isWideScreenOnly && !canScrollLeft && !canScrollRight ? "hidden" : "",
        className
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
