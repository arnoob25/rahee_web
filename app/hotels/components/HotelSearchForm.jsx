import DateRangePicker from "@/app/components/search-filters/DateRangePicker";
import HotelLocationPicker from "./filters/LocationPicker";
import RoomAndGuestSelector from "./filters/RoomAndGuestSelector";
import { useHotelFilterStore } from "../data/hotelFilterStore";

const HotelSearchForm = () => {
  const { dateRange, setDateRange } = useHotelFilterStore();

  return (
    <div className="flex flex-row items-stretch gap-2 justify-stretch">
      <HotelLocationPicker />
      <DateRangePicker date={dateRange} setDate={setDateRange} />
      <RoomAndGuestSelector />
    </div>
  );
};

export default HotelSearchForm;
