"use client";

import {
  addDays,
  addMonths,
  format,
  isBefore,
  isAfter,
  startOfToday,
  differenceInDays,
} from "date-fns";
import { LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DATE_DISPLAY_FORMAT } from "@/config/date-formats";
import { useToggleModal } from "@/hooks/use-modal";
import { useState } from "react";
import { DEFAULT_DATE_RANGE } from "@/app/hotels/config";
import { useHotelFilterStore } from "../../data/hotelFilters";

const today = startOfToday();

const getNextWeekend = () => {
  const friday = addDays(today, ((5 - today.getDay() + 7) % 7) + 7);
  const sunday = addDays(friday, 2);
  return { from: friday, to: sunday };
};

const DATE_PICKING_MODE = {
  fromDate: "from-date",
  toDate: "to-date",
};

const DATE_PRESETS = [
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
];

export default function DateRangePicker({ maxMonths = 3, className = "" }) {
  // fromDate is the starting date of the range
  // toDate is the ending date of the range
  const { dateRange, setDateRange } = useHotelFilterStore();
  const { from: fromDate, to: toDate } = dateRange;
  const [selectionMode, setSelectionMode] = useState(
    DATE_PICKING_MODE.fromDate
  );
  const [isOpen, togglePopover] = useToggleModal();

  const maxDate = addMonths(today, maxMonths);
  const isDateDisabled = (day) => isBefore(day, today) || isAfter(day, maxDate);
  const numberOfNights =
    // we return null to display a message instead of the value zero
    fromDate && toDate ? differenceInDays(toDate, fromDate) : null;

  // #region handlers
  const handleDateSelection = (newDateRange) => {
    if (!newDateRange) return;
    const { from: newFromDate, to: newToDate } = newDateRange;
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
    setDateRange(({ from: prevFromDate, to: prevToDate }) => {
      // due to how react-day-picker functions
      // when we select a new from-date after the current form-date (modifying the range after setting it once)
      // the newFromDate becomes the same as the prevFromDate
      // and the date we picked (want to set as the newFromDate), becomes the newToDate
      const isAfterPrevFromDate =
        newFromDate === prevFromDate && isAfter(newToDate, prevFromDate);

      const isAfterPrevToDate =
        newFromDate === prevFromDate && isAfter(newToDate, prevToDate);

      return {
        from: isAfterPrevFromDate ? newToDate : newFromDate, // enables selecting new from dates after previous from date
        to: isAfterPrevToDate ? null : prevToDate, // enables selecting new from date after previous to date (resets the entire range)
      };
    });
    setSelectionMode(DATE_PICKING_MODE.toDate);
  }

  // toDate is the ending date of the range
  function handleToDateSelection(newToDate) {
    setDateRange(({ from: prevFromDate, to: prevToDate }) => ({
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

  function handleReset() {
    setDateRange(DEFAULT_DATE_RANGE);
    setSelectionMode(DATE_PICKING_MODE.fromDate);
  }

  // #endregion

  return (
    <div className={`flex flex-col justify-items-stretch gap-2 ${className}`}>
      <Popover open={isOpen} onOpenChange={togglePopover}>
        <PopoverTrigger asChild>
          <div className="flex">
            <TriggerButton
              name="Check in Date"
              isOpen={isOpen}
              date={fromDate}
              datePickingMode={DATE_PICKING_MODE.fromDate}
              selectionMode={selectionMode}
              onTrigger={allowDateRangeSelection}
            />
            <span className="h-[40px] w-[1px] bg-muted-foreground/30 mx-2 my-auto" />
            <TriggerButton
              name="Check out Date"
              isOpen={isOpen}
              date={toDate}
              datePickingMode={DATE_PICKING_MODE.toDate}
              selectionMode={selectionMode}
              onTrigger={allowDateRangeSelection}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" sideOffset={12}>
          <PresetButtons
            isDateDisabled={isDateDisabled}
            setDateRange={setDateRange}
          />
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={fromDate}
            selected={dateRange}
            onSelect={handleDateSelection}
            numberOfMonths={2}
            disabled={isDateDisabled}
            className="mx-2 my-3"
          />
          <div className="flex justify-between items-center mt-3 px-4 py-3 border-t">
            {numberOfNights !== null ? (
              <div className="text-sm text-muted-foreground">
                {numberOfNights} night{numberOfNights !== 1 ? "s" : ""}
              </div>
            ) : null}

            <div className="flex gap-2 ml-auto">
              <Button
                onClick={handleReset}
                variant="ghost"
                size="sm"
                disabled={!fromDate && !toDate}
              >
                Reset
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function TriggerButton({
  name = "From Date",
  isOpen,
  date,
  datePickingMode,
  selectionMode,
  onTrigger,
}) {
  return (
    <Button
      variant="outline"
      className={cn(
        "w-[200px] h-full justify-start border-0 shadow-none text-left",
        !date && "text-muted-foreground",
        selectionMode === datePickingMode && isOpen && "ring-2 ring-primary"
      )}
      onClick={() => onTrigger(datePickingMode)}
    >
      {datePickingMode === DATE_PICKING_MODE.fromDate ? (
        <LogIn className="w-4 h-4 mr-2" />
      ) : (
        <LogOut className="w-4 h-4 mr-2" />
      )}

      <div className="flex flex-col items-start">
        <span className="text-xs text-muted-foreground">{` ${name}`}</span>
        <span className="text-base">
          {date ? format(date, DATE_DISPLAY_FORMAT) : <span>Pick a date</span>}
        </span>
      </div>
    </Button>
  );
}

function PresetButtons({ isDateDisabled, setDateRange }) {
  function applyPreset(getDate) {
    const newDate = getDate();
    if (!isDateDisabled(newDate.from) && !isDateDisabled(newDate.to)) {
      setDateRange(newDate);
    }
  }
  return (
    <div className="flex flex-wrap gap-2 p-4 pb-0 border-t">
      {DATE_PRESETS.map(({ label, getDate }) => (
        <Button
          key={label}
          variant="outline"
          size="sm"
          onClick={() => applyPreset(getDate)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
