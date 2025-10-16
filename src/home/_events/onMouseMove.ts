import { useEffect } from "react";
import { useGrid } from "../_providers/GridContextProvider";

export default function useOnMouseMove() {

  const { containerRef, dragging, lastPos, zoom, setOffset } = useGrid();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: false });

    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [zoom]);
}