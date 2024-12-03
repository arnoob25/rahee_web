"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ImageGallery({ images }) {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // TODO: build the layout with grid
  return (
    <>
      <div className="relative flex flex-col w-full min-w-[300px] h-[400px] gap-1 sm:flex-row md:rounded-lg overflow-hidden justify-items-stretch">
        <div className="relative h-full sm:w-[65%]">
          <Image
            src={images[0]?.url}
            alt={images[0]?.name ?? "Image unavailable"}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-col hidden gap-1 sm:flex sm:w-[35%]">
          <div className="relative flex-grow">
            <Image
              src={images[1]?.url}
              alt={images[1]?.name ?? "Image unavailable"}
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-[220px]">
            <Image
              src={images[2]?.url}
              alt={images[2]?.name ?? "Image unavailable"}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Fullscreen gallery dialog */}
      <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
        <DialogContent className="max-w-7xl h-[90vh] flex items-center justify-center bg-black">
          <div className="relative w-full h-full">
            {images[currentIndex]?.url ? (
              <Image
                src={images[currentIndex].url}
                alt={`Hotel view ${currentIndex + 1}`}
                fill
                className="object-contain"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                Fullscreen Placeholder
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={previousImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
