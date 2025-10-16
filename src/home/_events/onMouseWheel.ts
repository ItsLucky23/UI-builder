import { useEffect } from "react";
import { useGrid } from "../_providers/GridContextProvider";

export default function useOnMouseWheel() {

  const { containerRef, zoom, setZoom, offset, setOffset } = useGrid();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // now works
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(5, zoom * zoomFactor));

      const mx = e.clientX;
      const my = e.clientY;

      setOffset(prev => ({
        x: mx - ((mx - prev.x) / zoom) * newZoom,
        y: my - ((my - prev.y) / zoom) * newZoom,
      }));

      setZoom(newZoom);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => container.removeEventListener("wheel", handleWheel);
  }, [zoom]);
}