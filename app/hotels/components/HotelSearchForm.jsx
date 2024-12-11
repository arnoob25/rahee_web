import DateRangePicker from "@/app/components/search-filters/DateRangePicker";
import HotelLocationPicker from "./filters/LocationPicker";
import RoomAndGuestSelector from "./filters/RoomAndGuestSelector";

const HotelSearchForm = () => {
  return (
    <div className="flex flex-row items-stretch gap-2 justify-stretch">
      <HotelLocationPicker />
      <DateRangePicker />
      <RoomAndGuestSelector />
    </div>
  );
};

export default HotelSearchForm;
