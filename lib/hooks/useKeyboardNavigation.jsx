"use client";

import { useRef, useEffect } from "react";

export function useListKeyboardNavigation({
  isOpen,
  setIsOpen,
  items,
  onSelect,
  activeIndex,
  setActiveIndex,
}) {
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeElement = listRef.current.querySelector(
        `[data-index="${activeIndex}"]`
      );
      if (activeElement) {
        activeElement.focus();
      }
    }
  }, [activeIndex, isOpen]);

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown") {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        // Moves down in the list or wraps to the top
        setActiveIndex((prevIndex) =>
          prevIndex < items.length - 1 ? prevIndex + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        // Moves up in the list or wraps to the bottom
        setActiveIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : items.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        // Selects the active item
        if (activeIndex >= 0) {
          onSelect(items[activeIndex]);
        }
        break;
      case "Escape":
        // Closes dropdown and focuses input
        setIsOpen(false);
        inputRef.current?.focus();
        break;
      default:
        break;
    }
  };

  return { inputRef, listRef, handleKeyDown };
}
