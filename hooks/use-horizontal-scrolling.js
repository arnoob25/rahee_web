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
