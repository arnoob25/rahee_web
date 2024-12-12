"use client";

import {
  parse,
  isValid,
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
import {
  DATE_DISPLAY_FORMAT,
  INTERNAL_DATE_FORMAT,
} from "@/config/date-formats";
import { useToggleModal } from "@/hooks/use-modal";
import { useModifyURLParams } from "@/hooks/use-url-param";
import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "@/hooks/use-legend-state";

const DATE_PICKING_MODE = {
  fromDate: "from-date",
  toDate: "to-date",
};

const DateRangePicker = observer(function Component({
  maxMonths = 3,
  fromDateKey = "fromDate",
  toDateKey = "toDate",
  className = "",
}) {
  // fromDate is the starting date of the range
  // toDate is the ending date of the range
  const [date, setDate] = useState({ from: null, to: null });
  const { from: fromDate, to: toDate } = date;
  const [selectionMode, setSelectionMode] = useState(
    DATE_PICKING_MODE.fromDate
  );

  const today = startOfToday();
  const maxDate = addMonths(today, maxMonths);
  const numberOfNights =
    // we return null to display a message instead of the value zero
    fromDate && toDate ? differenceInDays(toDate, fromDate) : null;
  const isDateDisabled = (day) => isBefore(day, today) || isAfter(day, maxDate);

  const [isOpen, togglePopover] = useToggleModal();
  const { updateURLParam, deleteURLParam, updateURL } = useModifyURLParams();

  // #region methods
  const handleDateSelection = ({ from: newFromDate, to: newToDate }) => {
    if (!newFromDate && !newToDate) return;

    switch (selectionMode) {
      case DATE_PICKING_MODE.fromDate:
        handleFromDateSelection(newFromDate, newToDate);
        break;

      case DATE_PICKING_MODE.toDate:
        handleToDateSelection(newToDate);
        break;

      default:
        break;
    }
  };

  // fromDate is the starting date of the range
  function handleFromDateSelection(newFromDate, newToDate) {
    setDate(({ from: prevFromDate, to: prevToDate }) => {
      // due to how react-day-picker functions
      // when we select a new from-date after the current form-date (modifying the range after setting it once)
      // the newFromDate becomes the same as the prevFromDate
      // and the date we picked (want to set as the newFromDate), becomes the newToDate
      const isAfterPrevToDate =
        newFromDate === prevFromDate && isAfter(newToDate, prevToDate);

      const isAfterPrevFromDate =
        newFromDate === prevFromDate && isAfter(newToDate, newFromDate);

      if (isAfterPrevToDate)
        // selecting newFromDates that comes after prevToDate is not allowed
        // e.g. check-in cannot come after check-out
        return {
          from: prevFromDate,
          to: prevToDate,
        };

      return {
        from: isAfterPrevFromDate
          ? // Allow users to update the from-date date to a later date after selecting a range.
            newToDate // the date we picked as the newFromDate became newToDate
          : newFromDate,
        to: prevToDate,
      };
    });
    setSelectionMode(DATE_PICKING_MODE.toDate);
  }

  // toDate is the ending date of the range
  function handleToDateSelection(newToDate) {
    setDate(({ from: prevFromDate, to: prevToDate }) => ({
      from: prevFromDate,
      to: newToDate ?? prevToDate,
    }));
  }

  const allowDateRangeSelection = (selection) => {
    if (!fromDate) {
      setSelectionMode(DATE_PICKING_MODE.fromDate);
    } else {
      setSelectionMode(selection);
    }
  };

  function handleDone() {
    if (!fromDate || !toDate) return;
    saveFromDateAsURLParam();
    saveToDateAsURLParam();
    updateURL(); // applying both updates together
    togglePopover();
  }

  // fromDate is the starting date of the range
  function saveFromDateAsURLParam() {
    const formattedFromDate = format(fromDate, INTERNAL_DATE_FORMAT);
    // delay updating the URL until done is pressed
    updateURLParam(fromDateKey, formattedFromDate, false);
  }

  // toDate is the ending date of the range
  function saveToDateAsURLParam() {
    const formattedToDate = format(toDate, INTERNAL_DATE_FORMAT);
    // delay updating the URL until done is pressed
    updateURLParam(toDateKey, formattedToDate, false);
  }

  function handleReset() {
    setDate({ from: null, to: null });
    setSelectionMode(DATE_PICKING_MODE.fromDate);
    deleteURLParam(fromDateKey, false);
    deleteURLParam(toDateKey, false);
    updateURL(); // applying both updates together
  }

  const getNextWeekend = () => {
    const friday = addDays(today, ((5 - today.getDay() + 7) % 7) + 7);
    const sunday = addDays(friday, 2);
    return { from: friday, to: sunday };
  };

  useRestoreDateRangeFromURL({
    fromDateKey,
    toDateKey,
    setDateRange: (newDateRange) => setDate(newDateRange),
  });
  // #endregion

  // TODO done button should be disabled when dates haven't changed
  return (
    <div className={`flex flex-col justify-items-stretch gap-2 ${className}`}>
      <Popover open={isOpen} onOpenChange={togglePopover}>
        <PopoverTrigger asChild>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !fromDate && "text-muted-foreground",
                  selectionMode === DATE_PICKING_MODE.fromDate &&
                    isOpen &&
                    "ring-2 ring-primary"
                )}
                onClick={() =>
                  allowDateRangeSelection(DATE_PICKING_MODE.fromDate)
                }
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-muted-foreground">
                    From Date
                  </span>
                  {fromDate ? (
                    format(fromDate, DATE_DISPLAY_FORMAT)
                  ) : (
                    <span>Pick a date</span>
                  )}
                </div>
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !toDate && "text-muted-foreground",
                  selectionMode === DATE_PICKING_MODE.toDate &&
                    isOpen &&
                    "ring-2 ring-primary"
                )}
                onClick={() =>
                  allowDateRangeSelection(DATE_PICKING_MODE.toDate)
                }
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-muted-foreground">To Date</span>
                  {toDate ? (
                    format(toDate, DATE_DISPLAY_FORMAT)
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
                    setDate(newDate);
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
            defaultMonth={fromDate}
            selected={date}
            onSelect={handleDateSelection}
            numberOfMonths={2}
            disabled={isDateDisabled}
          />
          <div className="flex items-center justify-between p-4">
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
                disabled={!fromDate && !toDate}
              >
                Reset
              </Button>
              <Button
                onClick={handleDone}
                disabled={!fromDate || !toDate}
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

const useRestoreDateRangeFromURL = ({
  fromDateKey,
  toDateKey,
  setDateRange,
  dateFormat = INTERNAL_DATE_FORMAT,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isDateRestored = useRef(false);

  useEffect(() => {
    // Only run on the first render
    if (isDateRestored.current) return;

    const [fromDate, toDate] = getDatesFromURL();
    const [isFromDateValid, isToDateValid] = areDateParamsValid();

    function getDatesFromURL() {
      // fromDate is the starting date of the range
      // toDate is the ending date of the range
      const fromDateString = searchParams.get(fromDateKey) ?? "";
      const toDateString = searchParams.get(toDateKey) ?? "";

      const fromDate = parse(fromDateString, dateFormat, new Date()) ?? null;
      const toDate = parse(toDateString, dateFormat, new Date()) ?? null;

      return [fromDate, toDate];
    }

    function areDateParamsValid() {
      const isFromDateValid = fromDate && isValid(fromDate);
      const isToDateValid = toDate && isValid(toDate);

      return [isFromDateValid, isToDateValid];
    }

    function cleanInvalidURL() {
      const newSearchParams = new URLSearchParams(searchParams);

      // Delete invalid parameters
      if (!isFromDateValid) newSearchParams.delete(fromDateKey);
      if (!isToDateValid) newSearchParams.delete(toDateKey);

      // Update the URL with modified parameters
      router.replace(`?${newSearchParams.toString()}`);
    }

    if (!isFromDateValid || !isToDateValid) cleanInvalidURL();

    setDateRange({
      from: isFromDateValid ? fromDate : null,
      to: isToDateValid ? toDate : null,
    });

    isDateRestored.current = true;
  }, [searchParams, fromDateKey, toDateKey, setDateRange, dateFormat, router]);
};

export default DateRangePicker;
