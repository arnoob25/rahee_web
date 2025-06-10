"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImageViewer } from "@/app/components/ImageViewer";
import { Button } from "@/components/ui/button";
import { useGetCategorizedImages } from "../../data/format-data/categorizeImages";
import { useImageViewerModal } from "@/app/components/ImageViewerModal";

const responsiveHeight = "h-[14rem] sm:h-[19rem] md:h-[28rem]";

export function ImageGallery({ images }) {
  const displayModal = useImageViewerModal();

  const { coverImages, featuredImages, hotelImages } =
    useGetCategorizedImages(images);

  return (
    <div className={`flex flex-row gap-2 ${responsiveHeight}`}>
      <div className="flex-grow w-2/3 h-full col-span-2 overflow-hidden md:rounded-tl-xl md:rounded-bl-xl md:row-span-2 bg-gray-100 md:w-2/3">
        <CoverImageWithCarousel
          images={[...coverImages, ...hotelImages]}
          displayModal={displayModal}
        />
      </div>
      <div className="flex-grow hidden w-1/3 h-full gap-2 justify-items-start md:flex md:flex-col">
        <div className="flex-1 overflow-hidden md:rounded-tr-xl">
          <ImageViewer
            src={featuredImages[0]?.url ?? hotelImages[1]?.url}
            onClick={() =>
              displayModal(
                featuredImages[0]?.url ? featuredImages : hotelImages,
                featuredImages[0]?.url ? 0 : 1
              )
            }
            className="transition-all duration-300 hover:scale-105"
          />
        </div>
        <div className="relative h-[200px] overflow-hidden md:rounded-br-xl">
          <ImageViewer
            src={featuredImages[1]?.url ?? hotelImages[2]?.url}
            onClick={() =>
              displayModal(
                featuredImages[1]?.url ? featuredImages : hotelImages,
                featuredImages[0]?.url ? 1 : 2
              )
            }
            className="transition-all duration-300 hover:scale-105"
          />
          <Button
            variant="ghost"
            onClick={() => displayModal(images)}
            size="sm"
            className="absolute bg-transparent/30 text-background right-3 bottom-3"
          >
            Show all images
          </Button>
        </div>
      </div>
    </div>
  );
}

const CoverImageWithCarousel = ({ images, displayModal }) => (
  <Carousel loop={true}>
    <CarouselContent>
      {images.map(({ _id, url, caption }, index) => (
        <CarouselItem key={_id} className={responsiveHeight}>
          <ImageViewer
            src={url}
            alt={caption}
            className="transition-all duration-300 ease-in-out hover:scale-105"
            onClick={() => displayModal(images, index)}
            priority
          />
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious className="left-2" />
    <CarouselNext className="right-2" />
  </Carousel>
);
