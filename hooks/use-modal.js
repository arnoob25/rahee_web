"use client";

import { useObservable } from "@legendapp/state/react";

export function useToggleModal(initialState = false) {
  const isOpen$ = useObservable(initialState);

  function toggleModal() {
    isOpen$.set((isOpen) => !isOpen);
  }

  return [isOpen$.get(), toggleModal];
}
