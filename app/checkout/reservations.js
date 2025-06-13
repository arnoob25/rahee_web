import { create } from "zustand";
import { useGetHotelData } from "../hotels/data/getHotelDetails";
import { selectedHotelStore } from "../hotels/data/selectedHotel";
import { useDateRangeStore } from "../hotels/data/hotelFilters";

export const reservationsStore = create((set, get) => ({
  reservations: [],

  setReservations: (reservations) => set({ reservations }),
  addNewReservation: (newReservation) =>
    set((state) => ({ reservations: [...state.reservations, newReservation] })),
}));

export function useGetReservationData(reservationId) {
  const { reservations } = reservationsStore();

  const { hotelId, checkInDate, checkOutDate, adults, children } =
    reservations.find((r) => r.id === reservationId) ?? {};

  const { data } = useGetHotelData(hotelId);

  return {
    hotel: data,
    roomType: data?.roomType,
    checkInDate,
    checkOutDate,
    adults,
    children,
  };
}

export function useSetReservations(roomTypeId) {
  const { reservations, setReservations, addNewReservation } =
    reservationsStore();
  const { selectedHotelId } = selectedHotelStore();
  const { dateRange } = useDateRangeStore();

  function getNewReservation({ id, adults, children }) {
    return {
      id,
      hotelId: selectedHotelId,
      roomTypeId,
      checkInDate: dateRange.from,
      checkOutDate: dateRange.to,
      adults,
      children,
    };
  }

  return {
    reservations,

    reservationExists: (id) => reservations?.some((r) => r.id === id),

    addNewReservation: (roomConfig) => {
      const newReservation = getNewReservation(roomConfig);
      addNewReservation(newReservation);
    },

    overrideExistingReservation: (roomConfig) => {
      const reservationsWithoutDuplicate = reservations.filter(
        (r) => r.id !== roomConfig.id
      );
      const updatedReservation = getNewReservation(roomConfig);
      setReservations([...reservationsWithoutDuplicate, updatedReservation]);
    },
  };
}
