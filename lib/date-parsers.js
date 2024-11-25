import { parse, isValid, isBefore, isAfter } from "date-fns";

// Function to check if a date string is valid based on an optional format
export function isValidDate(dateStr, format = "yyyy-MM-dd") {
  const parsedDate = parse(dateStr, format, new Date());
  return isValid(parsedDate) && dateStr === formatDate(parsedDate, format);
}

// Helper function to format a date for strict comparison
export function formatDateStrict(date, format) {
  return formatDate(date, format);
}

// Function to validate if a date string is in the correct format
function parseDate(dateStr, format) {
  const parsedDate = parse(dateStr, format, new Date());
  return isValid(parsedDate) ? parsedDate : null;
}

// Function to check if one date is before or after another date with a format
export function compareDates(
  dateStr1,
  dateStr2,
  format = "yyyy-MM-dd",
  mode = "before"
) {
  const date1 = parseDate(dateStr1, format);
  const date2 = parseDate(dateStr2, format);

  // If either date is invalid, return false
  if (!date1 || !date2) return false;

  return mode === "before" ? isBefore(date1, date2) : isAfter(date1, date2);
}
