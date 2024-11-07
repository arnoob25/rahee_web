import HotelList from "./components/HotelList";
import HotelQueryFilters from "./components/filters/HotelQueryFilters";

export default function Page() {
  return (
    <div>
      <HotelQueryFilters />
      <HotelList />
    </div>
  );
}
