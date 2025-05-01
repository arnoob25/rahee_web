"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
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
import { observer } from "@legendapp/state/react";
import { INITIAL_PRICE_RANGE, PRICE_CALCULATION_METHODS } from "../../config";
import { appliedFilters$ } from "../../store";

const PriceRangeSelector = observer(function Component() {
  const [isOpen, setIsOpen] = useState(false);
  // TODO refactor this with a better abstraction, a hook
  // that'll take appliedFilters$.hotelPricing.range and we'll be able to
  // return priceRange, and setPriceRange
  const priceRange = appliedFilters$.hotelPricing.range.get();
  const setPriceRange = appliedFilters$.hotelPricing.range.set;
  const calculationMethod = appliedFilters$.hotelPricing.method.get();
  const setCalculationMethod = appliedFilters$.hotelPricing.method.set;

  // Intermediate state for price range and calculation method
  const [intermediatePriceState, setIntermediatePriceState] = useState({
    range: [...priceRange],
    method: calculationMethod,
  });

  const isChanged =
    intermediatePriceState.range[0] !== priceRange[0] ||
    intermediatePriceState.range[1] !== priceRange[1] ||
    intermediatePriceState.method !== calculationMethod;

  const handleReset = () => {
    setPriceRange(INITIAL_PRICE_RANGE);
    // Change name
    setCalculationMethod(PRICE_CALCULATION_METHODS.night);
    setIntermediatePriceState({
      range: INITIAL_PRICE_RANGE,
      method: PRICE_CALCULATION_METHODS.night,
    });
    setIsOpen(false);
  };

  const handleApply = () => {
    setPriceRange(intermediatePriceState.range);
    setCalculationMethod(intermediatePriceState.method);
    setIsOpen(false);
  };

  const handleSliderChange = (value) => {
    setIntermediatePriceState((prev) => ({ ...prev, range: value }));
  };

  const handleInputChange = (index, value) => {
    const newValue = parseInt(value) || 0;
    const newRange = [...intermediatePriceState.range];
    newRange[index] = newValue;

    // Ensure min value is not greater than max or max value is not smaller than min
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[1] = Math.min(newRange[0] + 100, 1000);
    } else if (index === 1 && newRange[1] < newRange[0]) {
      newRange[0] = Math.max(newRange[1] - 100, 0);
    }

    setIntermediatePriceState((prev) => ({ ...prev, range: newRange }));
  };

  const handleCalculationMethodChange = (method) => {
    setIntermediatePriceState((prev) => ({ ...prev, method }));
  };

  const handleClose = () => {
    setIntermediatePriceState({
      range: [...priceRange],
      method: calculationMethod,
    });
    setIsOpen(false);
  };

  // TODO display warning icon on filters that haven't been applied 
  return (
    <div className="w-fit">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="justify-between w-full font-normal"
          >
            Price: ${priceRange[0]} - ${priceRange[1]}
            {calculationMethod === PRICE_CALCULATION_METHODS.night
              ? " per night"
              : " total stay"}
            {isOpen ? (
              <ChevronUp className="w-4 h-4 ml-2 opacity-50 shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-4 w-fit" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Set price range</h3>
            </div>

            <Tabs
              value={intermediatePriceState.method}
              onValueChange={handleCalculationMethodChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value={PRICE_CALCULATION_METHODS.night}>
                  Per night
                </TabsTrigger>
                <TabsTrigger value={PRICE_CALCULATION_METHODS.totalStay}>
                  Total stay
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="pt-4">
              <div className="relative mb-8">
                <SliderPrimitive.Root
                  className="relative flex items-center w-full select-none touch-none"
                  value={intermediatePriceState.range}
                  max={1000}
                  min={0}
                  step={1}
                  onValueChange={handleSliderChange}
                >
                  <SliderPrimitive.Track className="relative h-1.5 w-full grow rounded-full bg-primary/20">
                    <SliderPrimitive.Range className="absolute h-full rounded-full bg-primary" />
                  </SliderPrimitive.Track>
                  {intermediatePriceState.range.map((_, index) => (
                    <SliderPrimitive.Thumb
                      key={index}
                      className="block w-5 h-5 transition-colors border-2 rounded-full border-primary bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    />
                  ))}
                </SliderPrimitive.Root>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min-price">Min price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1.5 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="min-price"
                    type="number"
                    value={intermediatePriceState.range[0]}
                    onChange={(e) => handleInputChange(0, e.target.value)}
                    className="pl-6"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-price">Max price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1.5 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="max-price"
                    type="number"
                    value={intermediatePriceState.range[1]}
                    onChange={(e) => handleInputChange(1, e.target.value)}
                    className="pl-6"
                  />
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Prices exclude taxes and fees.
            </p>

            <div className="flex items-center justify-between pt-4">
              <Button variant="ghost" onClick={handleReset}>
                Reset
              </Button>
              <Button onClick={handleApply} disabled={!isChanged}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
});

export default PriceRangeSelector;
