import { useEffect, useRef } from "react";
import { useGrid } from "../../_providers/GridContextProvider";
import { toast } from "sonner";

// const zoomLevels = [0.1, 0.2, 0.3, 0.4, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4, 5];
const zoomLevels = [
  0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45,
  0.5, 0.625, 0.75, 0.875, 1, 1.125, 1.25, 1.375,
  1.5, 1.75, 2, 2.5, 3, 3.5, 4, 4.5, 5
];
const minZoom = zoomLevels[0];
const maxZoom = zoomLevels[zoomLevels.length-1];

export default function useOnMouseWheel() {

  const { containerRef, zoom, setZoom, offset, setOffset } = useGrid();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const usingMouseWheel = Math.abs(e.deltaY) > 50;

      let newZoom;
      if (usingMouseWheel) {
        //? here we handle zooming logic with the mouse wheel

        // const currentIndex = zoomLevels.findIndex(level => level >= zoom);
        const closestIndex = zoomLevels.reduce((closestIdx, level, idx) => {
          const currentDiff = Math.abs(level - zoom);
          const closestDiff = Math.abs(zoomLevels[closestIdx] - zoom);
          return currentDiff < closestDiff ? idx : closestIdx;
        }, 0);
        let newIndex = closestIndex;

        if (e.deltaY < 0) {
          newIndex = Math.min(zoomLevels.length - 1, closestIndex + 1);
        } else {
          newIndex = Math.max(0, closestIndex - 1);
        }
        newZoom = zoomLevels[newIndex];

      } else {
        //? here we handle both the zooming and padding (offset) logic with the trackpad

        const zooming = e.ctrlKey
        if (zooming) {
          const divider = 
            zoom < 1
            ? 70
            : zoom < 3
            ? 30
            : 10
          const additional = Math.abs(e.deltaY) / divider
          if (e.deltaY < 0) { //? negative value so user is zooming in
            newZoom = Math.min(maxZoom, zoom + additional);
          } else { //? positive value so user is zooming out
            newZoom = Math.max(minZoom, zoom - additional)
          }
        } else {

          const speed = 1;

          return setOffset(prev => ({
            x: prev.x - e.deltaX / zoom * speed,
            y: prev.y - e.deltaY / zoom * speed,
          }));
        }
      }

      if (!newZoom) { return; }

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