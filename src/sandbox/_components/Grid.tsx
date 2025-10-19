import { useEffect, useState } from "react";
import useOnMouseWheel from "../_events/onMouseWheel";
import useOnMouseDown from "../_events/onMouseDown";
import { useGrid } from "../_providers/GridContextProvider";
import useOnMouseUp from "../_events/onMouseUp";
import useOnMouseMove from "../_events/onMouseMove";
import { GridElement } from "../props/gridProps";
import CreateComponentMenu from "./CreateComponentMenu";
import { useMenuStates } from "../_providers/MenuStatesProvider";

export default function Grid() {
  const [elements, setElements] = useState<GridElement[]>([
    { id: "1", x: 0, y: 0, width: 100, height: 100, color: "blue" },
    { id: "2", x: 200, y: 200, width: 80, height: 50, color: "green" },
  ]);
  const { containerRef, dragging, zoom, offset } = useGrid();
  useOnMouseWheel();
  useOnMouseDown();
  useOnMouseUp();
  useOnMouseMove();
  
  const [showZoom, setShowZoom] = useState(false);
  const { lastMenuState, setEditMenuState, setWindowDividerPosition } = useMenuStates();

  useEffect(() => {
    setShowZoom(true);
  }, [zoom]);

  useEffect(() => {
    if (!showZoom) { return; }
    const timeout = setTimeout(() => setShowZoom(false), 1000);
    return () => clearTimeout(timeout);
  }, [showZoom, zoom]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        // background: "linear-gradient(90deg, #eee 1px, transparent 1px), linear-gradient(#eee 1px, transparent 1px)",
        backgroundSize: `${50 * zoom}px ${50 * zoom}px`,
        backgroundPosition: `${offset.x}px ${offset.y}px`, // <--- here
        cursor: dragging ? "grabbing" : "",
      }}
      className="bg-grid"
      ref={containerRef}
    >

      {/* percentage */}
      <div className={`absolute top-2 ${showZoom ? 'opacity-100' : 'opacity-0'} z-50 transition-all duration-200 left-2 bg-background text-title text-sm px-4 py-1 rounded`}>
        {(zoom*100).toString().endsWith(".5") ? (zoom*100).toFixed(1) : (zoom*100).toFixed(0)}%
      </div>

      <CreateComponentMenu />

      <div
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {elements.map(el => (
          <div
            key={el.id}
            style={{
              position: "absolute",
              left: el.x,
              top: el.y,
              width: el.width,
              height: el.height,
              backgroundColor: el.color || "red",
            }}
            className="COMPONENT"
            onClick={() => {
              setEditMenuState(lastMenuState || "CODE");
              setWindowDividerPosition(prev => prev || 50);
            }}
          >
            <div className="bg-orange-500">
              <h2>{el.id}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
