import { useEffect } from "react";
import { useGrid } from "../_providers/GridContextProvider";

export default function useOnMouseDown() {

  const { containerRef, zoom, dragging, lastPos } = useGrid();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      dragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
    };

    container.addEventListener("mousedown", handleMouseDown, { passive: false });
    return () => container.removeEventListener("mousedown", handleMouseDown);
  }, [zoom]);
}