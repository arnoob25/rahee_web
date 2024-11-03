import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

function useRestoreGuestsFromURL(setRooms) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const roomsParam = searchParams.get("rooms");
    const adultsParam = searchParams.get("adults");
    const childrenParam = searchParams.get("children");

    if (roomsParam && adultsParam) {
      const roomsCount = parseInt(roomsParam, 10);
      const adultsArray = adultsParam.split(",").map(Number);
      const childrenArray = childrenParam
        ? childrenParam.split(",").map(Number)
        : [];

      const rooms = Array.from({ length: roomsCount }, (_, index) => ({
        id: index + 1,
        adults: adultsArray[index] || 0,
        children: childrenArray[index] || 0,
      }));

      setRooms(rooms);
    }
  }, [searchParams, setRooms]);
}

export default useRestoreGuestsFromURL;
