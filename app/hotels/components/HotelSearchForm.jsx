import DateRangePicker from "@/app/components/search-filters/DateRangePicker";
import RoomAndGuestSelector from "./filters/RoomAndGuestSelector";
import { useHotelFilterStore } from "../data/hotelFilterStore";
import LocationPicker from "@/app/components/search-filters/LocationPicker";

const HotelSearchForm = () => {
  const { locationId, dateRange, setLocationId, setDateRange } =
    useHotelFilterStore();

  return (
    <div className="flex flex-row items-stretch gap-2 justify-stretch">
      <LocationPicker
        selectedLocation={locationId}
        setSelectedLocation={setLocationId}
      />
      <DateRangePicker date={dateRange} setDate={setDateRange} />
      <RoomAndGuestSelector />
    </div>
  );
};

export default HotelSearchForm;
