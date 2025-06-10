"use client";
import * as React from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useHorizontalScroll } from "@/hooks/use-scroll";
import { HorizontalScrollButtons } from "@/app/components/HorizontalScrollButtons";

const CarouselContext = React.createContext(null);

export function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef(
  (
    {
      orientation = "horizontal",
      startIndex = 0,
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
        startIndex,
      },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={React.useMemo(
          () => ({
            carouselRef,
            api: api,
            opts,
            orientation:
              orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
            scrollPrev,
            scrollNext,
            canScrollPrev,
            canScrollNext,
          }),
          [
            carouselRef,
            api,
            opts,
            orientation,
            scrollPrev,
            scrollNext,
            canScrollPrev,
            canScrollNext,
          ]
        )}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-left-12 top-1/2 -translate-y-1/2"
            : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
          className
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    );
  }
);
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-right-12 top-1/2 -translate-y-1/2"
            : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
          className
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ArrowRightIcon className="w-4 h-4" />
        <span className="sr-only">Next slide</span>
      </Button>
    );
  }
);
CarouselNext.displayName = "CarouselNext";

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};

export function CarouselThumbnails({ images, thumbnailSize = 64, className }) {
  const { api, canScrollPrev, canScrollNext, scrollPrev, scrollNext } =
    useCarousel();
  const { scrollRef, scrollTo, canScrollLeft, canScrollRight } =
    useHorizontalScroll(images);

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  const onThumbClick = React.useCallback(
    (index) => {
      if (!api) return;
      api.scrollTo(index);
    },
    [api]
  );

  // "flex flex-row gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide"

  return (
    <HorizontalScrollButtons
      floating
      wideScreenOnly
      scrollTo={scrollTo}
      canScrollLeft={canScrollLeft}
      canScrollRight={canScrollRight}
    >
      <div
        ref={scrollRef}
        className={cn(
          "flex w-fit max-w-full mx-auto space-x-2 p-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide",
          className
        )}
      >
        {images.map(({ url }, i) => (
          <button
            key={i}
            onClick={() => onThumbClick(i)}
            className={cn(
              "flex-shrink-0 w-full aspect-square border cursor-pointer rounded-lg overflow-hidden",
              "focus:outline-none focus:ring-1 focus:ring-white"
            )}
            style={{ width: thumbnailSize, height: thumbnailSize }}
            aria-label={`Go to slide ${i + 1}`}
            aria-pressed={selectedIndex === i}
            type="button"
          >
            <Image
              src={url}
              alt={`Thumbnail ${i + 1}`}
              className={`w-full h-full object-cover cursor-pointer rounded-lg ${className}`}
              width={thumbnailSize}
              height={thumbnailSize}
              draggable={false}
            />
          </button>
        ))}
      </div>
    </HorizontalScrollButtons>
  );
}
