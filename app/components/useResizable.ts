"use client";

import { useState, useEffect, useRef } from "react";

export function useResizable(defaultWidth: number, minWidth = 160, maxWidth = 640) {
  const [width, setWidth] = useState(defaultWidth);
  const isResizing = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      setWidth((prevWidth) => {
        const nextWidth = prevWidth + e.movementX;
        return Math.max(minWidth, Math.min(maxWidth, nextWidth));
      });
    };

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = "default";
        document.body.style.userSelect = "auto";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [minWidth, maxWidth]);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  return { width, startResizing };
}
