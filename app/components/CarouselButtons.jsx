import { cn } from "@/lib/utils";
const { Button } = require("@/components/ui/button");
const { ChevronLeft, ChevronRight } = require("lucide-react");

export function CarouselButtons({
  canScrollLeft = false,
  canScrollRight = true,
  scrollTo = () => {},
  isWideScreenOnly = true,
}) {
  return (
    <div
      className={cn(
        "flex flex-row gap-2 ml-auto w-fit h-fit",
        isWideScreenOnly && !canScrollLeft && !canScrollRight ? "hidden" : ""
      )}
    >
      <Button
        variant="outlined"
        className="p-2 rounded-full border"
        onClick={() => scrollTo("left")}
        aria-label="Scroll left"
        disabled={!canScrollLeft}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button
        variant="outlined"
        className="p-2 rounded-full border"
        onClick={() => scrollTo("right")}
        aria-label="Scroll right"
        disabled={!canScrollRight}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>
    </div>
  );
}
