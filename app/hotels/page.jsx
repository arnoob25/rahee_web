import NameFilter from "./components/filters/MainFilters";
import HotelList from "./components/HotelList";

export default function Page() {
  return (
    <div>
      <NameFilter />
      <HotelList />
    </div>
  );
}
