import { INTERNAL_DATE_FORMAT } from "@/config/date-formats";
import {
  parse,
  isValid,
  isBefore,
  isAfter,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

// Function to create a date object from a string
export function parseDate(dateStr, format) {
  const parsedDate = parse(dateStr, format, new Date());
  return isValid(parsedDate) ? parsedDate : null;
}

// Function to check if a date string is valid
export function isValidDateString(dateStr, format = INTERNAL_DATE_FORMAT) {
  const parsedDate = parseDate(dateStr, format);
  return isValid(parsedDate) && dateStr === formatDate(parsedDate, format);
}

// Function to check if one date is before or after another date
export function compareDates(
  dateStr1,
  dateStr2,
  format = INTERNAL_DATE_FORMAT,
  mode = "before"
) {
  const date1 = parseDate(dateStr1, format);
  const date2 = parseDate(dateStr2, format);

  // If either date is invalid, return false
  if (!date1 || !date2) return false;

  return mode === "before" ? isBefore(date1, date2) : isAfter(date1, date2);
}

// Function to calculate the duration between two dates
export function getDurationBetweenDateStrings(
  dateStrFrom,
  dateStrTo,
  format = INTERNAL_DATE_FORMAT,
  unit = "days" // Possible values: "days", "months", "years"
) {
  const fromDate = parseDate(dateStrFrom, format);
  const toDate = parseDate(dateStrTo, format);

  if (!isValid(fromDate) || !isValid(toDate)) {
    throw new Error("Invalid date range provided");
  }

  // Calculate duration based on the specified unit
  switch (unit) {
    case "days":
      return differenceInDays(toDate, fromDate);
    case "months":
      return differenceInMonths(toDate, fromDate);
    case "years":
      return differenceInYears(toDate, fromDate);
    default:
      throw new Error(
        "Invalid unit provided. Use 'days', 'months', or 'years'."
      );
  }
}
