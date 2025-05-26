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
import {
  DATE_DISPLAY_FORMAT,
  INTERNAL_DATE_FORMAT,
} from "@/config/date-formats";
import { useToggleModal } from "@/hooks/use-modal";
import { useURLParams } from "@/hooks/use-url-param";
import { useState, useEffect, useRef } from "react";
import {
  DEFAULT_DATE_RANGE,
  INITIAL_CHECK_IN_DATE,
  INITIAL_CHECK_OUT_DATE,
} from "@/app/hotels/config";

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

export default function DateRangePicker({
  date,
  setDate,
  maxMonths = 3,
  fromDateKey = "fromDate",
  toDateKey = "toDate",
  className = "",
}) {
  // fromDate is the starting date of the range
  // toDate is the ending date of the range
  const { from: fromDate, to: toDate } = date;
  const [selectionMode, setSelectionMode] = useState(
    DATE_PICKING_MODE.fromDate
  );
  const [isOpen, togglePopover] = useToggleModal();

  const { updateURLParam, deleteURLParam, updateURL } = useURLParams();

  const maxDate = addMonths(today, maxMonths);
  const isDateDisabled = (day) => isBefore(day, today) || isAfter(day, maxDate);
  const numberOfNights =
    // we return null to display a message instead of the value zero
    fromDate && toDate ? differenceInDays(toDate, fromDate) : null;

  // #region handlers
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

      return {
        from: isAfterPrevFromDate
          ? // Allow users to update the from-date date to a later date after selecting a range.
            newToDate // the date we picked as the newFromDate became newToDate
          : newFromDate,
        to: null,
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
    setDate(DEFAULT_DATE_RANGE);
    setSelectionMode(DATE_PICKING_MODE.fromDate);
    deleteURLParam(fromDateKey, false);
    deleteURLParam(toDateKey, false);
    updateURL(); // applying both updates together
  }

  useRestoreDateRangeFromURL({
    fromDateKey,
    toDateKey,
    setDateRange: (newDateRange) => setDate(newDateRange),
  });
  // #endregion

  return (
    <div className={`flex flex-col justify-items-stretch gap-2 ${className}`}>
      <Popover open={isOpen} onOpenChange={togglePopover}>
        <PopoverTrigger asChild className="flex gap-2">
          <div>
            <TriggerButton
              isOpen={isOpen}
              date={fromDate}
              datePickingMode={DATE_PICKING_MODE.fromDate}
              selectionMode={selectionMode}
              onTrigger={allowDateRangeSelection}
            />
            <TriggerButton
              isOpen={isOpen}
              date={toDate}
              datePickingMode={DATE_PICKING_MODE.toDate}
              selectionMode={selectionMode}
              onTrigger={allowDateRangeSelection}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <PresetButtons isDateDisabled={isDateDisabled} setDate={setDate} />
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
            {numberOfNights !== null ? (
              <div className="text-sm text-muted-foreground">
                {numberOfNights} night{numberOfNights !== 1 ? "s" : ""}
              </div>
            ) : null}

            <div className="flex gap-2 ml-auto">
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                disabled={!fromDate && !toDate}
              >
                Reset
              </Button>
              {/* <Button
                onClick={handleDone}
                disabled={!fromDate || !toDate}
                size="sm"
              >
                Done
              </Button> */}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function TriggerButton({
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
        "w-[200px] justify-start text-left font-normal",
        !date && "text-muted-foreground",
        selectionMode === datePickingMode && isOpen && "ring-2 ring-primary"
      )}
      onClick={() => onTrigger(datePickingMode)}
    >
      <CalendarIcon className="w-4 h-4 mr-2" />
      <div className="flex flex-col items-start">
        <span className="text-xs text-muted-foreground">From Date</span>
        {date ? format(date, DATE_DISPLAY_FORMAT) : <span>Pick a date</span>}
      </div>
    </Button>
  );
}

function PresetButtons({ isDateDisabled, setDate }) {
  function applyPreset(getDate) {
    const newDate = getDate();
    if (!isDateDisabled(newDate.from) && !isDateDisabled(newDate.to)) {
      setDate(newDate);
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

function useRestoreDateRangeFromURL({ fromDateKey, toDateKey, setDateRange }) {
  const { getParamByKey, deleteURLParam, updateURL } = useURLParams();
  const isDateRestored = useRef(false);

  useEffect(() => {
    // Only run on the first render
    if (isDateRestored.current) return;
    const [fromDate, toDate] = getDateRange();
    const [isFromDateValid, isToDateValid] = areDateParamsValid();

    function getDateRange() {
      // fromDate is the starting date of the range
      // toDate is the ending date of the range
      const fromDateString = getParamByKey(fromDateKey, "");
      const toDateString = getParamByKey(toDateKey, "");

      const fromDate = parse(fromDateString, INTERNAL_DATE_FORMAT, new Date());
      const toDate = parse(toDateString, INTERNAL_DATE_FORMAT, new Date());

      return [fromDate, toDate];
    }

    function areDateParamsValid() {
      const isFromDateValid = fromDate && isValid(fromDate);
      const isToDateValid = toDate && isValid(toDate);

      return [isFromDateValid, isToDateValid];
    }

    function cleanInvalidURL() {
      // Delete invalid parameters, don't update URL immediately
      if (!isFromDateValid) deleteURLParam(fromDateKey, false);
      if (!isToDateValid) deleteURLParam(toDateKey, false);

      updateURL(); // update with all changes
    }

    if (!isFromDateValid || !isToDateValid) {
      return cleanInvalidURL();
    }

    setDateRange({
      from: isFromDateValid ? fromDate : INITIAL_CHECK_IN_DATE,
      to: isToDateValid ? toDate : INITIAL_CHECK_OUT_DATE,
    });

    isDateRestored.current = true;
  }, [
    deleteURLParam,
    fromDateKey,
    getParamByKey,
    setDateRange,
    toDateKey,
    updateURL,
  ]);
}
