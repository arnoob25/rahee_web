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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToggleModal } from "@/hooks/use-modal";

const responsiveHeight = "h-[14rem] sm:h-[19rem] md:h-[28rem]";

export function ImageGallery({ images }) {
  const [isModalOpen, toggleModal] = useToggleModal();
  const allImages = [
    images.coverImage,
    ...images.hotelImages,
    ...images.featuredImages,
  ];

  return (
    <>
      <div className={`flex flex-row gap-2 ${responsiveHeight}`}>
        <div className="flex-grow w-2/3 h-full col-span-2 bg-gray-100 md:w-2/3">
          <CoverImageWithCarousel images={images} toggleModal={toggleModal} />
        </div>
        <div className="flex-grow hidden w-1/3 h-full gap-2 justify-items-start md:flex md:flex-col">
          <div className="relative flex-1 overflow-hidden md:rounded-tr-xl">
            <ImageViewer
              src={images.featuredImages[0].url}
              onClick={toggleModal}
              className="transition-all duration-300 hover:scale-105"
            />
          </div>
          <div className="relative h-[200px] overflow-hidden md:rounded-br-xl">
            <ImageViewer
              src={images.featuredImages[1].url}
              onClick={toggleModal}
              className="transition-all duration-300 hover:scale-105"
            />
            <Button
              variant="secondary"
              onClick={toggleModal}
              className="absolute right-3 bottom-3"
            >
              Show all images
            </Button>
          </div>
        </div>
      </div>

      <ImageViewerModal
        images={allImages || []}
        open={isModalOpen}
        onOpenChange={toggleModal}
      />
    </>
  );
}

const CoverImageWithCarousel = ({ images, toggleModal }) => (
  <Carousel
    loop={true}
    className="overflow-hidden md:rounded-tl-xl md:rounded-bl-xl md:row-span-2"
  >
    <CarouselContent>
      {[images.coverImage, ...images.hotelImages].map((image) => (
        <CarouselItem
          key={image.id}
          className={`relative ${responsiveHeight}`}
        >
          <ImageViewer
            src={image.url}
            alt={image.alt}
            className="transition-all duration-300 ease-in-out hover:scale-105"
            onClick={toggleModal}
          />
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious className="left-2" />
    <CarouselNext className="right-2" />
  </Carousel>
);

function ImageViewerModal({ images, hoverEffect = true, open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hoveringCloseButton
        className="min-w-[100vw] h-screen bg-transparent border-0  bg"
      >
        <Carousel className="overflow-hidden my-auto h-[300px] md:h-[400px] lg:h-[600px] mx-auto md:row-span-2">
          <CarouselContent>
            {images.map((image) => (
              <CarouselItem key={image.id} className="relative h-[600px]">
                <DialogTitle>{image.alt}</DialogTitle>
                <ImageViewer src={image.url} alt={image.alt} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
