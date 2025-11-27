import { useEffect } from "react";
import { useGrid } from "../_providers/GridContextProvider";
import { useCode } from "../_providers/CodeContextProvider";
import { CreateComponentMenuVisibleState } from "../types/createComponentMenuTypes";
import { BuilderMenuMode, useBuilderPanel } from "../_providers/BuilderPanelContextProvider";
import { useMenus } from "../_providers/MenusContextProvider";

export default function useOnMouseUp() {

  const { 
    containerRef, 
    zoom, 
    setDragging, 
    draggingRef, 
    posMouseDown 
  } = useGrid();

  const { 
    lastPositionWindowDivider, 
    windowDividerDragging, 
    setWindowDivider, 
    setWindowDividerPosition, 
    setBuilderMenuMode,
    setPrevBuilderMenuMode
  } = useBuilderPanel();

  const {
    setCreateComponentMenuPosition,
    setCreateComponentMenuOpen
  } = useMenus();

  const { 
    activeCodeWindow, 
    setActiveCodeWindow 
  } = useCode();

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
          setBuilderMenuMode(prev => {
            if (prev !== BuilderMenuMode.CLOSED) {
              setPrevBuilderMenuMode(prev);
            }
            return BuilderMenuMode.CLOSED;
          });
        }

        if (activeCodeWindow) { return; }
        //? we add a timeout so the animation also works when clicking really fast, might remove it later
        setTimeout(() => {
          setCreateComponentMenuOpen(prev => {
            console.log(prev)
            if (prev === CreateComponentMenuVisibleState.FORCECLOSE) {
              return CreateComponentMenuVisibleState.CLOSED;
            }
            return CreateComponentMenuVisibleState.OPEN;
            // if (prev === CreateComponentMenuVisibleState.CLOSED) {
            //   return CreateComponentMenuVisibleState.OPEN;
            // }
            // return CreateComponentMenuVisibleState.CLOSED;
          });
          setCreateComponentMenuPosition({ x: e.clientX, y: e.clientY });
        }, 100);
      }
    };

    const handleMouseUp = (e: MouseEvent) => onMouseUp(e, false);
    const handleMouseLeave = (e: MouseEvent) => onMouseUp(e, true);
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    container.addEventListener("mouseleave", handleMouseLeave, { passive: false });
    container.addEventListener("mouseup", handleMouseUp, { passive: false });
    container.addEventListener("contextmenu", handleContextMenu);

    return () => {
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [zoom, activeCodeWindow]);

  useEffect(() => {

    const onMouseUp = (e: MouseEvent) => {
      e.preventDefault();

      setWindowDivider(false);
      windowDividerDragging.current = false;

      setWindowDividerPosition(lastPositionWindowDivider.current = 50);
    }

    const handleMouseUp = (e: MouseEvent) => onMouseUp(e);
    const handleMouseLeave = (e: MouseEvent) => onMouseUp(e);

    window.addEventListener("mouseup", handleMouseUp, { passive: false });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: false });
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [])
}