"use client";

import { useRef } from "react";
import { DollarSign } from "lucide-react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  DEFAULT_PRICE_CALCULATION_METHOD,
  DEFAULT_PRICE_RANGE,
  MAX_ALLOWED_PRICE,
  MIN_ALLOWED_PRICE,
  PRICE_CALCULATION_METHODS,
} from "../../config";
import { usePriceRangeStore } from "../../data/hotelFilters";

const PriceRangeSelector = ({ onApply: refetchHotels }) => {
  const areChangesMade = useRef(false);

  const {
    minPrice,
    maxPrice,
    priceCalcMethod,
    setPriceRange,
    setPriceCalcMethod,
  } = usePriceRangeStore();

  const handleSliderChange = ([newMin, newMax]) => {
    setPriceRange(newMin, newMax);
    areChangesMade.current = true;
  };

  const handleInputChange = (type, value) => {
    const newValue = Number.isNaN(parseInt(value))
      ? MIN_ALLOWED_PRICE
      : parseInt(value);

    if (type === "min") {
      const adjustedMax = newValue > maxPrice ? newValue + 100 : maxPrice;
      if (newValue < MIN_ALLOWED_PRICE || adjustedMax > MAX_ALLOWED_PRICE)
        return;

      setPriceRange(newValue, adjustedMax);
      areChangesMade.current = true;
    }

    if (type === "max") {
      const adjustedMin = newValue < minPrice ? newValue - 100 : minPrice;
      if (adjustedMin < MIN_ALLOWED_PRICE || newValue > MAX_ALLOWED_PRICE)
        return;

      setPriceRange(adjustedMin, newValue);
      areChangesMade.current = true;
    }
  };

  const handlePriceCalcMethodChange = (newCalcMethod) => {
    setPriceCalcMethod(newCalcMethod);
    areChangesMade.current = true;
  };

  const handlePopoverClick = (isOpen) => {
    if (!isOpen && areChangesMade.current) {
      refetchHotels();
      areChangesMade.current = false;
    }
  };

  const handleReset = () => {
    setPriceRange(DEFAULT_PRICE_RANGE.MIN_PRICE, DEFAULT_PRICE_RANGE.MAX_PRICE);
    setPriceCalcMethod(DEFAULT_PRICE_CALCULATION_METHOD);
    areChangesMade.current = true;
  };

  return (
    <div className="w-fit">
      <Popover onOpenChange={handlePopoverClick}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="justify-between w-full font-normal"
          >
            <DollarSign className="w-4 h-4" />
            Price: ${minPrice} - ${maxPrice}
            {priceCalcMethod === PRICE_CALCULATION_METHODS.NIGHT
              ? " per night"
              : " total stay"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 " align="start">
          <div className="space-y-4 m-4">
            <h3 className="text-sm font-medium">Set price range</h3>

            <Tabs
              value={priceCalcMethod}
              onValueChange={(newCalcMethod) =>
                handlePriceCalcMethodChange(newCalcMethod)
              }
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value={PRICE_CALCULATION_METHODS.NIGHT}>
                  Per night
                </TabsTrigger>
                <TabsTrigger value={PRICE_CALCULATION_METHODS.TOTAL_STAY}>
                  Total stay
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="pt-4">
              <div className="relative mb-8">
                <SliderPrimitive.Root
                  className="relative flex items-center w-full select-none touch-none"
                  value={[minPrice, maxPrice]}
                  max={1000}
                  min={0}
                  step={1}
                  onValueChange={handleSliderChange}
                >
                  <SliderPrimitive.Track className="relative h-1.5 w-full grow rounded-full bg-primary/20">
                    <SliderPrimitive.Range className="absolute h-full rounded-full bg-primary" />
                  </SliderPrimitive.Track>
                  <SliderPrimitive.Thumb className="block w-5 h-5 transition-colors border-2 rounded-full border-primary bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                  <SliderPrimitive.Thumb className="block w-5 h-5 transition-colors border-2 rounded-full border-primary bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                </SliderPrimitive.Root>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min-price">Enter min price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1.5 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="min-price"
                    type="number"
                    placeholder={minPrice}
                    onChange={(e) => handleInputChange("min", e.target.value)}
                    className="pl-6"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-price">Enter max price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1.5 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="max-price"
                    type="number"
                    placeholder={maxPrice}
                    onChange={(e) => handleInputChange("max", e.target.value)}
                    className="pl-6"
                  />
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Prices exclude taxes and fees.
            </p>
          </div>
          <div className="flex justify-end items-center mt-3 px-4 py-3 border-t">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PriceRangeSelector;
