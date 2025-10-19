import { useEffect } from "react";
import { useGrid } from "../_providers/GridContextProvider";

// const zoomLevels = [0.1, 0.2, 0.3, 0.4, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4, 5];
const zoomLevels = [
  0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45,
  0.5, 0.625, 0.75, 0.875, 1, 1.125, 1.25, 1.375,
  1.5, 1.75, 2, 2.5, 3, 3.5, 4, 4.5, 5
];


export default function useOnMouseWheel() {

  const { containerRef, zoom, setZoom, offset, setOffset } = useGrid();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // now works
      // const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      // const newZoom = Math.max(0.1, Math.min(5, zoom * zoomFactor));

            const currentIndex = zoomLevels.findIndex(level => level >= zoom);
      let newIndex = currentIndex;

      // Decide whether to zoom in or out
      if (e.deltaY < 0) {
        // Zoom in → go to the next higher zoom level
        newIndex = Math.min(zoomLevels.length - 1, currentIndex + 1);
      } else {
        // Zoom out → go to the previous zoom level
        newIndex = Math.max(0, currentIndex - 1);
      }

      const newZoom = zoomLevels[newIndex];
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