"use client";

import { useObserveElementIntersection } from "@/hooks/use-intersection";
import { useScrollToElement } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";

const sections = [
  { id: "overview", label: "OVERVIEW" },
  { id: "rooms", label: "ROOMS" },
  { id: "facilities", label: "FACILITIES" },
  { id: "reviews", label: "REVIEWS" },
  { id: "policies", label: "POLICIES" },
];

export function HotelNav({ containerRef, className }) {
  const scrollToElement = useScrollToElement(containerRef);

  // track which section is visible inside container
  const selectedSection = useObserveElementIntersection({
    containerRef,
    targets: sections.map((s) => s.id),
    options: {
      rootMargin: "0px 0px -60% 0px",
      threshold: 0,
    },
  });

  const handleClick = (id) => {
    scrollToElement(id, 80, true);
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 flex justify-between bg-background pt-3",
        className
      )}
    >
      <div className="flex pt-2 items-baseline overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => handleClick(section.id)}
            className={cn(
              "px-4 pb-4 text-sm font-medium whitespace-nowrap",
              selectedSection === section.id
                ? "border-b-4 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
