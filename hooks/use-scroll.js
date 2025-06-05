import { useState, useEffect, useRef, useCallback } from "react";

export function useHorizontalScroll(listOfItemsToScroll) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const {
        scrollLeft: scrollPosition,
        scrollWidth,
        clientWidth: visibleAreaWidth,
      } = scrollRef.current;

      setCanScrollLeft(scrollPosition > 0);
      setCanScrollRight(scrollPosition < scrollWidth - visibleAreaWidth);
    }
  }, []);

  //TODO optimize the effect to prevent unnecessary re renders
  // Recheck scroll state whenever listOfItemsToScroll change
  useEffect(() => {
    checkScroll(); // Initial check

    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, listOfItemsToScroll]);

  const scrollTo = useCallback((direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }, []);

  return {
    scrollRef,
    scrollTo,
    canScrollLeft,
    canScrollRight,
  };
}

/**
 * Scrolls the specified element smoothly, either inside its scrollable container
 * or the window, depending on context.
 *
 * @param {React.RefObject} rootRef - Optional. A ref to scope the search within a container.
 */
export function useScrollToElement(rootRef = null) {
  const scrollToElement = useCallback(
    (selector, offset = 10, shouldScrollWithinContainer = true) => {
      if (!selector) return;

      const root = rootRef?.current || document;
      const targetElement = root.querySelector(`#${selector}`);
      if (!targetElement) return;

      if (!shouldScrollWithinContainer) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return;
      }

      const container = targetElement.closest(
        ".overflow-y-auto, .overflow-y-scroll"
      );
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();

        const scrollOffset =
          targetRect.top - containerRect.top + container.scrollTop - offset;

        container.scrollTo({
          top: scrollOffset,
          behavior: "smooth",
        });
      }
    },
    [rootRef]
  );

  return scrollToElement;
}
