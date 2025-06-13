import { create } from "zustand";

export const appState = create((set) => ({
  isStartingServer: false,
  setIsStartingServer: (isStartingServer) => set({ isStartingServer }),
}));
