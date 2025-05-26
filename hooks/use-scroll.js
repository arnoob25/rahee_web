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

export function useScrollToElement() {
  /**
   * Scrolls the specified element smoothly, positioning it near the top of the container
   * or the viewport, with a small offset for better visibility.
   * @param {string} selector - The ID of the target element to scroll to.
   * @param {boolean} scrollWithinContainer - Whether to scroll inside the closest scrollable container (default: true).
   * @param {number} offset - Additional offset (in pixels) from the top (default: 10).
   */
  const scrollToElement = useCallback(
    (selector, offset = 10, shouldScrollWithinContainer = true) => {
      if (!selector) {
        console.error("No selector provided.");
        return;
      }

      const targetElement = document.getElementById(selector);
      if (!targetElement) {
        console.error("Target element not found:", selector);
        return;
      }

      if (!shouldScrollWithinContainer) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        return;
      }

      const container = targetElement.closest(".overflow-y-auto");
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();

        // Calculate offset to scroll the target to the top of the container with additional spacing.
        const scrollOffset =
          targetRect.top - containerRect.top + container.scrollTop - offset;

        container.scrollTo({
          top: scrollOffset,
          behavior: "smooth",
        });
      }
    },
    []
  );

  return scrollToElement;
}
