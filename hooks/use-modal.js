"use client";

import { useState } from "react";

export function useToggleModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  function toggleModal() {
    setIsOpen((isOpen) => !isOpen);
  }

  return [isOpen, toggleModal];
}
