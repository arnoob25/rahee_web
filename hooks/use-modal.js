"use client";

import { useState } from "react";

export function useToggleModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  function toggleModal() {
    setIsModalOpen((isOpen) => !isOpen);
  }

  return [isModalOpen, setIsModalOpen, toggleModal];
}
