import { create } from "zustand";
import { useGetHotelData } from "../hotels/data/getHotelDetails";
import { selectedHotelStore } from "../hotels/data/selectedHotel";
import { useDateRangeStore } from "../hotels/data/hotelFilters";
import { getDurationBetweenDateStrings } from "@/lib/date-parsers";

// TODO maybe move the setters here, this way, I won't have to re render setters since the hook has to register to changing state
export const reservationsStore = create((set, get) => ({
  reservations: [
    {
      id: "1",
      hotelId: "684bbfe5650685912fabd856",
      roomTypeId: "684b76e6995e7e82f74d4d4f",
      checkInDate: "2025-07-09",
      checkOutDate: "2025-07-16",
      duration: 7,
      adults: [
        {
          id: "1",
          firstName: "Arnob",
          lastName: "Muhammad",
          phone: "01521704706",
        },
        {
          id: "2",
          firstName: "Raheema",
          lastName: "Nazneen",
          phone: "01309091962",
        },
      ],
      children: [
        { id: "1", firstName: "Aisha", lastName: "Shikder", guardianId: "2" },
      ],
      pricePerNight: 230,
      isConfirmed: false,
    },
    {
      id: "2",
      hotelId: "684bbfe5650685912fabd85d",
      roomTypeId: "684b76e6995e7e82f74d4d64",
      checkInDate: "2025-07-09",
      checkOutDate: "2025-07-16",
      duration: 7,
      adults: [
        {
          id: "1",
          firstName: "",
          lastName: "",
          phone: "",
        },
      ],
      children: [],
      pricePerNight: 240,
      isConfirmed: false,
    },

    {
      id: "3",
      hotelId: "684bbfe5650685912fabd85a",
      roomTypeId: "684b76e6995e7e82f74d4d33",
      checkInDate: "2025-07-09",
      checkOutDate: "2025-07-16",
      duration: 7,
      adults: [
        {
          id: "1",
          firstName: "",
          lastName: "",
          phone: "",
        },
        {
          id: "2",
          firstName: "",
          lastName: "",
          phone: "",
        },
      ],
      children: [],
      pricePerNight: 310,
      isConfirmed: false,
    },
  ],

  setReservations: (reservations) => set({ reservations }),
  addNewReservation: (newReservation) =>
    set((state) => ({ reservations: [...state.reservations, newReservation] })),
  updateReservationData: (reservationId, data) => {
    const updatedReservations = get().reservations.map((reservation) => {
      if (reservation.id !== reservationId) return reservation;

      return { ...reservation, ...data };
    });
    set({ reservations: updatedReservations });
  },
  deleteReservation: (reservationId) =>
    set((state) => ({
      reservations: state.reservations.filter(
        (reservation) => reservation.id !== reservationId
      ),
    })),
}));

export function useGetReservationData(reservationId) {
  const { reservations } = reservationsStore();

  const reservation = reservations.find((r) => r.id === reservationId) ?? {};

  const { data } = useGetHotelData(reservation.hotelId);

  const roomType = data?.roomTypes?.find(
    (roomType) => roomType._id === reservation.roomTypeId
  );

  return {
    ...reservation,
    hotel: data,
    totalCost: reservation.pricePerNight * reservation.duration,
    roomType,
  };
}

export function useSetReservations(roomTypeId) {
  const { reservations, setReservations, addNewReservation } =
    reservationsStore();
  const { selectedHotelId } = selectedHotelStore();
  const { dateRange } = useDateRangeStore();

  function getAdultDetails(adultCount) {
    return Array.from({ length: adultCount }).map((_, index) => ({
      id: (index + 1).toString(),
      firstName: "",
      lastName: "",
      phone: "",
    }));
  }

  function getChildDetails(childCount) {
    return Array.from({ length: childCount }).map((_, index) => ({
      id: (index + 1).toString(),
      firstName: "",
      lastName: "",
      guardianId: "",
    }));
  }

  function getNewReservation({ id, adults, children }, pricePerNight) {
    return {
      id,
      hotelId: selectedHotelId,
      roomTypeId,
      checkInDate: dateRange.from,
      checkOutDate: dateRange.to,
      duration: getDurationBetweenDateStrings(dateRange.from, dateRange.to),
      pricePerNight,
      adults: getAdultDetails(adults),
      children: getChildDetails(children),
      isConfirmed: false,
    };
  }

  return {
    reservations,

    reservationExists: (id) => reservations?.some((r) => r.id === id),

    addNewReservation: (roomConfig, pricePerNight) => {
      const newReservation = getNewReservation(roomConfig, pricePerNight);
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
