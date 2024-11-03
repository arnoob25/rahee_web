"use client";

import DateRangePicker from "@/app/components/search-filters/DateRangePicker";
import React from "react";

const CheckInDateRangeSelector = () => {
  return <DateRangePicker fromDateKey="checkIn" toDateKey="checkOut" />;
};

export default CheckInDateRangeSelector;
