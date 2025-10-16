import { useEffect } from "react";
import { useGrid } from "../_providers/GridContextProvider";

export default function useOnMouseUp() {

  const { containerRef, zoom, dragging } = useGrid();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseUp = (e: MouseEvent) => {
      dragging.current = false;
    };

    container.addEventListener("mouseleave", onMouseUp, { passive: false });
    container.addEventListener("mouseup", onMouseUp, { passive: false });

    return () => {
      container.removeEventListener("mouseleave", onMouseUp);
      container.removeEventListener("mouseup", onMouseUp);
    };
  }, [zoom]);
}