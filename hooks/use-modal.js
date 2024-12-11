"use client";

import { useObservable } from "@legendapp/state/react";

export function useToggleModal() {
  const isOpen$ = useObservable(false);

  function toggleModal() {
    isOpen$.set((isOpen) => !isOpen);
  }

  return [isOpen$.get(), toggleModal];
}
