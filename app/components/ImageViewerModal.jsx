"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbnails,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { create } from "zustand";
import Image from "next/image";

const imageViewerStore = create((set) => ({
  isOpen: false,
  images: null,
  startIndex: 0,

  setIsOpen: (isOpen) => set({ isOpen }),
  setImages: (images) => set({ images }),
  setStartIndex: (startIndex) => set({ startIndex }),
}));

export function useImageViewerModal() {
  const { setIsOpen, setImages, setStartIndex } = imageViewerStore();

  return function displayModal(images, startIndex = 0) {
    setImages(images);
    setStartIndex(startIndex);
    setIsOpen(true);
  };
}

export function ImageViewerModal() {
  const { isOpen, images, startIndex, setIsOpen } = imageViewerStore();

  if (!images || !images.length) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-default h-[90vh] p-4 border-0 rounded-lg bg-transparent overflow-hidden">
        <div className="flex flex-col w-full h-full items-center justify-center overflow-y-auto">
          <Carousel className="w-full space-y-10" startIndex={startIndex}>
            <div className="relative">
              <CarouselContent>
                {images.map(({ _id, caption, url }, index) => (
                  <CarouselItem
                    key={_id}
                    className="w-full flex flex-col items-center"
                  >
                    <div className="relative w-full aspect-[3/2] max-h-[60vh] rounded-lg overflow-hidden">
                      <Image
                        src={url}
                        alt={caption}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                        priority
                      />
                    </div>
                    <span className="my-4 font-normal text-center text-secondary">
                      {`${index + 1}/${images.length} ${
                        caption ? `: ${" "} ${caption}` : ""
                      }`}
                    </span>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-5 top-[50%]" />
              <CarouselNext className="right-5 top-[50%]" />
            </div>
            <CarouselThumbnails images={images} />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
}
