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

const datePickingMode = {
  checkIn: "check-in",
  checkOut: "check-out",
};

const store$ = observable({
  date: { from: null, to: null },
  isOpen: false,
  selectionMode: datePickingMode.checkIn,
});

const DateRangePicker = observer(function Component({ maxMonths = 3 }) {
  const date = store$.date.get();
  const isOpen = store$.isOpen.get();
  const selectionMode = store$.selectionMode.get();
  // const [hoverDate, setHoverDate] = React.useState(null);

  const today = startOfToday();
  const maxDate = addMonths(today, maxMonths);

  const handleSelect = (newDate) => {
    if (!newDate) return;
    const checkInDate = newDate.from ?? null;
    const checkOutDate = newDate.to ?? null;

    switch (selectionMode) {
      case datePickingMode.checkIn:
        store$.date.set((prevDate) => ({
          // Allow users to update the check-in date to a later date after selecting a range.
          // Set the check-out date to the new check-in date if necessary.
          // React Day Picker treats dates after the check-in date as check-out dates once a range is selected.
          from:
            checkInDate &&
            checkInDate === prevDate.from &&
            isAfter(checkOutDate, checkInDate)
              ? checkOutDate
              : checkInDate,
          to: prevDate.to,
        }));

        store$.selectionMode.set(datePickingMode.checkOut);
        break;

      case datePickingMode.checkOut:
        // Set the check-out date if it's after the current check-in date
        store$.date.set((prevDate) => ({
          from: prevDate.from,
          to: checkOutDate ?? prevDate.to,
        }));
        break;

      default:
        break;
    }
  };

  const handleButtonClick = (selection) => {
    if (isOpen && selectionMode === selection) {

      // If the popover is open and the same button is clicked, close it
      store$.isOpen.set(false);
    } else {
      // Otherwise, set the mode to the new selection and keep the popover open
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

  // const getDayCount = (from, to) => {
  //   if (!from || !to) return null;
  //   return differenceInDays(to, from);
  // };

  // const selectedDayCount = getDayCount(date.from, date.to);
  // const previewDayCount = getDayCount(
  //   date.from || hoverDate,
  //   hoverDate || (selectionMode === "check-out" ? null : date.to)
  // );

  // const renderDayCount = () => {
  //   if (previewDayCount && hoverDate) {
  //     return `${previewDayCount} night${previewDayCount === 1 ? "" : "s"}`;
  //   }
  //   if (selectedDayCount) {
  //     return `${selectedDayCount} night${selectedDayCount === 1 ? "" : "s"}`;
  //   }
  //   return null;
  // };

  return (
    <div className="flex flex-col items-start gap-2 p-4">
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          // Only close when clicking outside the buttons or popover content
          if (
            !isOpen ||
            (selectionMode !== datePickingMode.checkIn &&
              selectionMode !== datePickingMode.checkOut)
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
                  selectionMode === datePickingMode.checkIn &&
                    isOpen &&
                    "ring-2 ring-primary"
                )}
                onClick={() => handleButtonClick(datePickingMode.checkIn)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-muted-foreground">
                    Check in
                  </span>
                  {date?.from ? (
                    format(date.from, "EEE, MM/dd/yy")
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
                  selectionMode === datePickingMode.checkOut &&
                    isOpen &&
                    "ring-2 ring-primary"
                )}
                onClick={() => handleButtonClick(datePickingMode.checkOut)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-muted-foreground">
                    Check out
                  </span>
                  {date?.to ? (
                    format(date.to, "EEE, MM/dd/yy")
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
            // onDayMouseEnter={(day) => setHoverDate(day)}
            // onDayMouseLeave={() => setHoverDate(null)}
          />
          {/* {renderDayCount() && (
              <div className="text-sm text-muted-foreground pl-2">
                {renderDayCount()}
              </div>
            )} */}
          {/* Done button */}
        </PopoverContent>
      </Popover>
    </div>
  );
});

export default DateRangePicker;
