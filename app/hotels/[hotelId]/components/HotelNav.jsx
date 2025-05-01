"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export function HotelNav({ className }) {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = useMemo(
    () => [
      { id: "overview", label: "OVERVIEW" },
      { id: "rooms", label: "ROOMS" },
      { id: "facilities", label: "FACILITIES" },
      { id: "reviews", label: "REVIEWS" },
      { id: "policy", label: "POLICY" },
    ],
    []
  );

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((section) => ({
        id: section.id,
        element: document.getElementById(section.id),
      }));

      const currentSection = sectionElements.find((section) => {
        if (!section.element) return false;
        const rect = section.element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  return (
    <nav className={cn("sticky top-0 z-50 bg-background mb-5", className)}>
      <div className="flex overflow-x-auto">
        {sections.map((section) => (
          <Link
            key={section.id}
            href={`#${section.id}`}
            className={cn(
              "px-4 py-2 text-sm font-medium whitespace-nowrap",
              activeSection === section.id
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(section.id)?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            {section.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
