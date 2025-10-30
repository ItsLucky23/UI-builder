import { useEffect } from "react";
import { useGrid } from "../_providers/GridContextProvider";
import { useMenuStates } from "../_providers/MenuStatesProvider";
import { useCode } from "../_providers/CodeContextProvider";

export default function useOnMouseUp() {

  const { containerRef, zoom, setDragging, draggingRef, posMouseDown } = useGrid();
  const { lastPositionWindowDivider, windowDividerDragging, setWindowDivider, setEditMenuState, setWindowDividerPosition, setLastMenuState, setCreateComponentMenuOpen, setMousePositionCreateComponentMenu } = useMenuStates();
  const { setActiveCodeWindow } = useCode();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseUp = (e: MouseEvent, leaveEvent: boolean) => {
      e.preventDefault();
      draggingRef.current = false;
      setDragging(false);
      
      const lastX = posMouseDown.current.x;
      const lastY = posMouseDown.current.y;
      if (!lastX || !lastY) { return };

      const elem = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      if (elem && elem.closest('#createComponentMenu')) { return; }

      if (elem && elem.closest('.VIEW')) { return; }
      if (elem && elem.closest('.MENU')) { return; }

      const horizontalDifference = Math.abs(lastX - e.clientX);
      const verticalDifference = Math.abs(lastY - e.clientY);
      if (horizontalDifference < 2 && verticalDifference < 2) {

        if (!leaveEvent) { 
          setActiveCodeWindow(null);
          setEditMenuState(prev => {
            if (prev !== "CLOSED") {
              setLastMenuState(prev);
            }
            return "CLOSED";
          }); 
        }

        //? we add a timeout so the animation also works when clicking really fast, might remove it later
        setTimeout(() => {
          console.log('Mouse up detected');
          setCreateComponentMenuOpen(true);
          setMousePositionCreateComponentMenu({ x: e.clientX, y: e.clientY });
        }, 100);
      }
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault(); // ← blocks right-click menu

    container.addEventListener("mouseleave", (e) => { onMouseUp(e, true) }, { passive: false });
    container.addEventListener("mouseup", (e) => { onMouseUp(e, false) }, { passive: false });
    container.addEventListener("contextmenu", handleContextMenu); // ← key part

    return () => {
      container.removeEventListener("mouseleave", (e) => { onMouseUp(e, true) });
      container.removeEventListener("mouseup", (e) => { onMouseUp(e, false) });
      container.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [zoom]);

  useEffect(() => {

    const onMouseUp = (e: MouseEvent, leaveEvent: boolean) => {
      e.preventDefault();

      setWindowDivider(false);
      windowDividerDragging.current = false;

      setWindowDividerPosition(lastPositionWindowDivider.current = 50);
    }


    window.addEventListener("mouseup", (e) => { onMouseUp(e, false) }, { passive: false });
    window.addEventListener("mouseleave", (e) => { onMouseUp(e, true) }, { passive: false });
    return () => {
      window.removeEventListener("mouseup", (e) => { onMouseUp(e, false) });
      window.removeEventListener("mouseleave", (e) => { onMouseUp(e, true) });
    };
  }, [])
}