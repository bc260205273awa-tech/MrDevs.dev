"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";

interface InViewSectionProps {
  children: ReactNode;
  rootMargin?: string;
  minHeight?: string;
  className?: string;
}

export default function InViewSection({
  children,
  rootMargin = "600px",
  minHeight = "300px",
  className = "",
}: InViewSectionProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ minHeight: shouldRender ? undefined : minHeight }}
    >
      {shouldRender ? children : null}
    </div>
  );
}
