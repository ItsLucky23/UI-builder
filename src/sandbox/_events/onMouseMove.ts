import { useEffect } from "react";
import { useGrid } from "../_providers/GridContextProvider";
import { useMenuStates } from "../_providers/MenuStatesProvider";

export default function useOnMouseMove() {

  const { containerRef, draggingRef, lastPos, zoom, setOffset } = useGrid();
  const { lastPositionWindowDivider, windowDividerDragging, setWindowDivider } = useMenuStates();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
    if (!draggingRef.current) return;

    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: false });

    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [zoom]);

  useEffect(() => {
    const rightPanel = document.getElementById("rightPanel");
    if (!rightPanel) { return; }

    const leftPanel = document.getElementById("leftPanel");
    if (!leftPanel) { return; }

    const handleMouseMove = (e: MouseEvent) => {
      if (!windowDividerDragging.current) return;

      const dx = e.clientX - lastPositionWindowDivider.current;
      const containerWidth = window.innerWidth;
      const newPosition = ((lastPositionWindowDivider.current + dx) / containerWidth) * 100;

      lastPositionWindowDivider.current = e.clientX;

      console.log(newPosition)
      rightPanel.style.width = `${100 - newPosition}%`;
      leftPanel.style.width = `${newPosition}%`;
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [])
}