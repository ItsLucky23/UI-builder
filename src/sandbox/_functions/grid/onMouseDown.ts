import { useEffect } from "react";
import { useGrid } from "../../_providers/GridContextProvider";
import { useDrawing } from "../../_providers/DrawingContextProvider";
import { CreateComponentMenuVisibleState } from "../../types/createComponentMenuTypes";
import { useBuilderPanel } from "../../_providers/BuilderPanelContextProvider";
import { useMenus } from "../../_providers/MenusContextProvider";

export default function useOnMouseDown() {

  const { 
    containerRef, 
    zoom, 
    setDragging, 
    draggingRef, 
    lastPos, 
    posMouseDown 
  } = useGrid();

  const { 
    lastPositionWindowDivider, 
    windowDividerDragging, 
    setWindowDivider 
  } = useBuilderPanel();
  
  const { 
    drawingEnabled 
  } = useDrawing();

  const {
    setCreateComponentMenuOpen
  } = useMenus();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      // e.preventDefault();

      // if (e.buttons == 1) { return; } //? left button
      // if (e.buttons == 2) { return; } //? right button
      if (
        drawingEnabled 
        && (
          e.buttons == 1 //? left button 
          || e.buttons == 2 //? right button
        )
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

      setCreateComponentMenuOpen(prev => {
        console.log(prev)

        if (e.buttons == 4) {
          return CreateComponentMenuVisibleState.FORCECLOSE;
        }

        if (prev === CreateComponentMenuVisibleState.OPEN) {
          return CreateComponentMenuVisibleState.FORCECLOSE;
        }
        return CreateComponentMenuVisibleState.CLOSED;
      });
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