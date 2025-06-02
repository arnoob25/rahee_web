import { create } from "zustand";

export const useSelectedHotelStore = create((set) => ({
  selectedHotelId: null,
  setSelectedHotelId: (id) => {
    set((state) => ({
      selectedHotelId: state.selectedHotelId === id ? null : id,
    }));
  },
}));
