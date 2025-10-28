import { useEffect } from "react";
import { useGrid } from "../_providers/GridContextProvider";
import { useMenuStates } from "../_providers/MenuStatesProvider";

export default function useOnMouseDown() {

  const { containerRef, zoom, setDragging, draggingRef, lastPos, posMouseDown, drawingEnabled } = useGrid();
  const { lastPositionWindowDivider, windowDividerDragging, setWindowDivider, setCreateComponentMenuOpen } = useMenuStates();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();

      if (
        drawingEnabled 
        && e.buttons == 1 //? left button 
      ) { return; }

      const elem = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      if (elem && elem.closest('#createComponentMenu')) { return; }

      draggingRef.current = true;
      
      setTimeout(() => {
        if (!draggingRef.current) { return; }
        setDragging(true);
      }, 100);

      lastPos.current = { x: e.clientX, y: e.clientY };
      posMouseDown.current = { x: e.clientX, y: e.clientY };

      setCreateComponentMenuOpen(false);
    };

    container.addEventListener("mousedown", handleMouseDown, { passive: false });
    return () => container.removeEventListener("mousedown", handleMouseDown);
  }, [zoom, drawingEnabled]);

  useEffect(() => {
    const windowDivider = document.getElementById("windowDivider");
    if (!windowDivider) { return; }

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();

      windowDividerDragging.current = true;

      setTimeout(() => {
        if (!windowDividerDragging.current) { return; }
        setWindowDivider(true);
      }, 100);

      lastPositionWindowDivider.current = e.clientX;
    }

    windowDivider.addEventListener("mousedown", handleMouseDown);
    return () => windowDivider.removeEventListener("mousedown", handleMouseDown);
  }, [])
}