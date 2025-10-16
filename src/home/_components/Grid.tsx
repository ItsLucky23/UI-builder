import { useState } from "react";
import useOnMouseWheel from "../_events/onMouseWheel";
import useOnMouseDown from "../_events/onMouseDown";
import { useGrid } from "../_providers/GridContextProvider";
import useOnMouseUp from "../_events/onMouseUp";
import useOnMouseMove from "../_events/onMouseMove";
import { GridElement } from "../props/gridProps";

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
  
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(90deg, #eee 1px, transparent 1px), linear-gradient(#eee 1px, transparent 1px)",
        backgroundSize: `${50 * zoom}px ${50 * zoom}px`,
        backgroundPosition: `${offset.x}px ${offset.y}px`, // <--- here
        cursor: dragging.current ? "grabbing" : "grab",
      }}
      ref={containerRef}
    >
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
          />
        ))}
      </div>
    </div>
  );
};
