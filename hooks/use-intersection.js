import { useEffect, useState } from "react";

/**
 * useIntersectionObserver
 *
 * @param {Object} config - Configuration object
 * @param {React.RefObject} [config.containerRef] - Optional container for scroll context
 * @param {string[]} [config.targets] - List of element IDs to observe
 * @param {string} [config.target] - A single element ID to observe
 * @param {Object} [config.options] - IntersectionObserver options (rootMargin, threshold, etc.)
 * @param {boolean} [config.returnFirstVisible=true] - For multiple targets, return the first visible one
 *
 * @returns {string|boolean|null} - Visible ID (if multiple), boolean (if single), or null
 */
export function useObserveElementIntersection({
  containerRef,
  targets = [],
  target,
  options = {},
  returnFirstVisible = true,
}) {
  const [state, setState] = useState(
    targets.length ? null : false // null = no visible section, false = not visible
  );

  useEffect(() => {
    let elements = [];

    if (target) {
      const el = containerRef.current.querySelector(`#${target}`);
      if (el) elements = [el];
    } else if (Array.isArray(targets)) {
      elements = targets
        .map((id) => containerRef.current.querySelector(`#${id}`))
        .filter(Boolean);
    }

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (target) {
          const entry = entries[0];
          setState(entry.isIntersecting);
        } else {
          const visibleEntries = entries
            .filter((entry) => entry.isIntersecting)
            .sort(
              (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
            );

          if (returnFirstVisible && visibleEntries.length > 0) {
            setState(visibleEntries[0].target.id);
          } else {
            // Optionally return a list or map of visible elements
            const visibleIds = visibleEntries.map((entry) => entry.target.id);
            setState(visibleIds);
          }
        }
      },
      {
        root: containerRef?.current ?? document,
        rootMargin: "0px 0px -60% 0px", // default: trigger when upper 40% is in view
        threshold: 0,
        ...options,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [target, targets, containerRef, options, returnFirstVisible]);

  console.log({ state });

  return state;
}
