"use client";

import * as React from "react";
import {
  addDays,
  addMonths,
  format,
  isBefore,
  isAfter,
  startOfToday,
  differenceInDays,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { observer } from "@legendapp/state/react";
import { observable } from "@legendapp/state";
import { useRouter, useSearchParams } from "next/navigation";
import useRestoreDateRangeFromURL from "@/app/hotels/hooks/useRestoreDateRangeFromURL";
import {
  DATE_DISPLAY_FORMAT,
  INTERNAL_DATE_FORMAT,
} from "@/config/dateFormats";

const datePickingMode = {
  fromDate: "from-date",
  toDate: "to-date",
};

const store$ = observable({
  date: { from: null, to: null },
  isOpen: false,
  selectionMode: datePickingMode.fromDate,
});

// TODO don't allow selecting invalid dates, like check in greater than checkout
const DateRangePicker = observer(function Component({
  maxMonths = 3,
  fromDateKey = "fromDate",
  toDateKey = "toDate",
  className = "",
}) {
  const date = store$.date.get();
  const isOpen = store$.isOpen.get();
  const selectionMode = store$.selectionMode.get();
  const router = useRouter();
  const searchParams = useSearchParams();

  const today = startOfToday();
  const maxDate = addMonths(today, maxMonths);

  const handleSelect = (newDate) => {
    if (!newDate) return;
    const fromDate = newDate.from ?? null;
    const toDate = newDate.to ?? null;

    switch (selectionMode) {
      case datePickingMode.fromDate:
        // if (fromDate && toDate && isAfter(toDate, fromDate)) break;
        // console.log("should not trigger", fromDate, toDate);

        store$.date.set((prevDate) => ({
          from:
            fromDate && fromDate === prevDate.from && isAfter(toDate, fromDate)
              ? // Allow users to update the from-date date to a later date after selecting a range.
                // Set the to-date date to the new fromDate if necessary.
                // React Day Picker treats dates after the from-date date as to-date dates once a range is selected.
                toDate
              : fromDate,
          to: prevDate.to,
        }));
        store$.selectionMode.set(datePickingMode.toDate);
        break;

      case datePickingMode.toDate:
        store$.date.set((prevDate) => ({
          from: prevDate.from,
          to: toDate ?? prevDate.to,
        }));
        break;

      default:
        break;
    }
  };

  const handleButtonClick = (selection) => {
    if (isOpen && selectionMode === selection) return;
    if (!date.from) {
      store$.selectionMode.set(datePickingMode.fromDate);
    } else {
      store$.selectionMode.set(selection);
    }
  };

  const isDateDisabled = (day) => {
    return isBefore(day, today) || isAfter(day, maxDate);
  };

  const getNextWeekend = () => {
    const friday = addDays(today, ((5 - today.getDay() + 7) % 7) + 7);
    const sunday = addDays(friday, 2);
    return { from: friday, to: sunday };
  };

  const handleDone = () => {
    if (date.from && date.to) {
      const params = new URLSearchParams(searchParams);
      const fromDate = format(date.from, INTERNAL_DATE_FORMAT);
      const toDate = format(date.to, INTERNAL_DATE_FORMAT);
      params.set(fromDateKey, fromDate);
      params.set(toDateKey, toDate);
      router.replace(`?${params.toString()}`);
    }
    store$.isOpen.set(false);
  };

  const handleReset = () => {
    store$.date.set({ from: null, to: null });
    store$.selectionMode.set(datePickingMode.fromDate);
    const params = new URLSearchParams(searchParams);
    params.delete(fromDateKey);
    params.delete(toDateKey);
    router.replace(`?${params.toString()}`);
  };

  const getNumberOfNights = () => {
    if (date.from && date.to) {
      return differenceInDays(date.to, date.from);
    }
    return null;
  };

  const numberOfNights = getNumberOfNights();

  const setDates = (newDates) => {
    store$.date.set(newDates);
  };

  useRestoreDateRangeFromURL({
    fromDateKey,
    toDateKey,
    setDates,
    INTERNAL_DATE_FORMAT,
  });

  return (
    <div className={`flex flex-col justify-items-stretch gap-2 ${className}`}>
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          if (
            !isOpen ||
            (selectionMode !== datePickingMode.fromDate &&
              selectionMode !== datePickingMode.toDate)
          ) {
            store$.isOpen.set(open);
          }
        }}
      >
        <PopoverTrigger asChild>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !date?.from && "text-muted-foreground",
                  selectionMode === datePickingMode.fromDate &&
                    isOpen &&
                    "ring-2 ring-primary"
                )}
                onClick={() => handleButtonClick(datePickingMode.fromDate)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-muted-foreground">
                    From Date
                  </span>
                  {date?.from ? (
                    format(date.from, DATE_DISPLAY_FORMAT)
                  ) : (
                    <span>Pick a date</span>
                  )}
                </div>
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !date?.to && "text-muted-foreground",
                  selectionMode === datePickingMode.toDate &&
                    isOpen &&
                    "ring-2 ring-primary"
                )}
                onClick={() => handleButtonClick(datePickingMode.toDate)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-muted-foreground">To Date</span>
                  {date?.to ? (
                    format(date.to, DATE_DISPLAY_FORMAT)
                  ) : (
                    <span>Pick a date</span>
                  )}
                </div>
              </Button>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-wrap gap-2 p-4 pb-0 border-t">
            {[
              {
                label: "Tonight",
                getDate: () => ({ from: today, to: addDays(today, 1) }),
              },
              {
                label: "Tomorrow",
                getDate: () => {
                  const tomorrow = addDays(today, 1);
                  return { from: tomorrow, to: addDays(tomorrow, 1) };
                },
              },
              {
                label: "This weekend",
                getDate: () => {
                  const friday = addDays(today, (5 + 7 - today.getDay()) % 7);
                  const sunday = addDays(friday, 2);
                  return { from: friday, to: sunday };
                },
              },
              { label: "Next weekend", getDate: getNextWeekend },
            ].map(({ label, getDate }) => (
              <Button
                key={label}
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = getDate();
                  if (
                    !isDateDisabled(newDate.from) &&
                    !isDateDisabled(newDate.to)
                  ) {
                    store$.date.set(newDate);
                  }
                }}
              >
                {label}
              </Button>
            ))}
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={isDateDisabled}
          />
          <div className="p-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {numberOfNights !== null
                ? `${numberOfNights} night${numberOfNights !== 1 ? "s" : ""}`
                : ""}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                disabled={!date.from && !date.to}
              >
                Reset
              </Button>
              <Button
                onClick={handleDone}
                disabled={!date.from || !date.to}
                size="sm"
              >
                Done
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
});

export default DateRangePicker;
