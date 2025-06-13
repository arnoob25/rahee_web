import { create } from "zustand";

export const useAppStore = create((set) => ({
  isStartingServer: false, 
  setIsStartingServer: (isStartingServer) => set({ isStartingServer }),
}));
