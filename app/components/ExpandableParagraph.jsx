"use client";

import { useState, useRef, useEffect } from "react";

const ExpandableParagraph = ({ text, className = "", maxLines = 2 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const paragraphRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (paragraphRef.current) {
        const { scrollHeight, clientHeight } = paragraphRef.current;
        setShowButton(scrollHeight > clientHeight);
      }
    };

    checkOverflow(); // Initial check
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, [text]);

  // TODO: make the read more button inline with the paragraph
  return (
    <div
      className={`relative flex flex-col overflow-clip items-start P-4 ${className}`}
    >
      <p
        ref={paragraphRef}
        className={`flex-grow text-muted-foreground text-left ${
          isExpanded ? "" : `line-clamp-${maxLines}`
        }`}
      >
        {text}
      </p>
      {showButton && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-shrink ml-1 text-sm font-normal text-muted-foreground hover:underline focus:outline-none"
        >
          {isExpanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default ExpandableParagraph;
