import { useEffect, useState, useRef } from "react";

/**
 * Throttle function
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Time in ms
 */
function throttle(fn, limit) {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * useIntersectionObserver
 *
 * @param {Object} config - Configuration object
 * @param {React.RefObject} [config.containerRef] - Optional container for scroll context
 * @param {string[]} [config.targets] - List of element IDs to observe
 * @param {string} [config.target] - A single element ID to observe
 * @param {Object} [config.options] - IntersectionObserver options
 * @param {boolean} [config.returnFirstVisible=true] - For multiple targets, return the first visible one
 * @param {number} [config.throttleMs=0] - Optional throttle delay in milliseconds
 *
 * @returns {string|boolean|string[]|null} - Visible ID (if multiple), boolean (if single), array (if multiple without returnFirstVisible), or null
 */
export function useObserveElementIntersection({
  containerRef,
  targets = [],
  target,
  options = {},
  returnFirstVisible = true,
  throttleMs = 0,
}) {
  const [state, setState] = useState(
    targets.length ? null : false // null = no visible section, false = not visible
  );

  // Store state setter in ref to use inside throttled callback
  const setStateRef = useRef(setState);
  setStateRef.current = setState;

  useEffect(() => {
    let elements = [];

    if (!containerRef?.current) return;

    if (target) {
      const el = containerRef.current.querySelector(`#${target}`);
      if (el) elements = [el];
    } else if (Array.isArray(targets)) {
      elements = targets
        .map((id) => containerRef.current.querySelector(`#${id}`))
        .filter(Boolean);
    }

    if (!elements.length) return;

    const handleEntries = (entries) => {
      if (target) {
        const entry = entries[0];
        setStateRef.current(entry.isIntersecting);
      } else {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (returnFirstVisible && visibleEntries.length > 0) {
          setStateRef.current(visibleEntries[0].target.id);
        } else {
          const visibleIds = visibleEntries.map((entry) => entry.target.id);
          setStateRef.current(visibleIds);
        }
      }
    };

    const callback =
      throttleMs > 0 ? throttle(handleEntries, throttleMs) : handleEntries;

    const observer = new IntersectionObserver(callback, {
      root: containerRef.current,
      rootMargin: "0px 0px -60% 0px",
      threshold: 0,
      ...options,
    });

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [target, targets, containerRef, options, returnFirstVisible, throttleMs]);

  return state;
}
