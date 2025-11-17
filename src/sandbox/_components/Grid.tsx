import { useEffect, useMemo, useState } from "react";
import useOnMouseWheel from "../_events/onMouseWheel";
import useOnMouseDown from "../_events/onMouseDown";
import { useGrid } from "../_providers/GridContextProvider";
import useOnMouseUp from "../_events/onMouseUp";
import useOnMouseMove from "../_events/onMouseMove";
import { GridElement } from "../types/gridProps";
import CreateComponentMenu from "./menus/CreateComponentMenu";
import { useMenuStates } from "../_providers/MenuStatesProvider";
import { useCode } from "../_providers/CodeContextProvider";
import { blueprints, screen } from "../types/blueprints";
import { useBlueprints } from "../_providers/BlueprintsContextProvider";
import DrawingLayer from "./drawing/DrawingLayer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDrawPolygon, faPen } from "@fortawesome/free-solid-svg-icons";
import BottomLeftMenu from "./menus/BottemLeftMenu";
import DrawingMenu from "./drawing/DrawingMenu";
import { getGridStyle } from "../_functions/gridStyle";

const dummyData = {
  screens: [
    { 
      id: "view1", 
      name: "View 1" ,
      position: { x: 100, y: 100 },
      code: 
`import React, { useState, useEffect } from "react";
export default function View1() {

  const [name, setName] = useState("Mike")

  useEffect(() => {
    console.log(name)
  }, [name])

  return (
    <div className={"bg-blue-500"}>
      <div>hey {name}!!</div>
      <button 
        className="px-6 py-2"
        onClick={() => {setName(prev => prev == 'Mike' ? 'Jimbo' : 'Mike')}}
      >
        Click me
      </button>
    </div>
  );
}`
    },
    { 
      id: "view2", 
      name: "View 2" ,
      position: { x: 1300, y: 1300 },
      code: `
import React from "react";
export default function View2() {
  return <div>View 2</div>;
  return <div>View 2</div>;
  return <div>View 2</div>;
  return <div>View 2</div>;
}
      `
    },
  ],
  components: [
    {
      id: "comp1",
      name: "Component 1",
      code: `
import React from "react";
export default function Component1() {
  return <div>Component 1</div>;
  return <div>Component 1</div>;
  return <div>Component 1</div>;
  return <div>Component 1</div>;
  return <div>Component 1</div>;
  return <div>Component 1</div>;
  return <div>Component 1</div>;
  return <div>Component 1</div>;
}
      `
    },
    {
      id: "comp2",
      name: "Component 2",
      code: `
import React from "react";
export default function Component2() {
  return <div>Component 2</div>;
  return <div>Component 2</div>;
  return <div>Component 2</div>;
  return <div>Component 2</div>;
  return <div>Component 2</div>;
  return <div>Component 2</div>;
  return <div>Component 2</div>;
  return <div>Component 2</div>;
  return <div>Component 2</div>;
  return <div>Component 2</div>;
  return <div>Component 2</div>;
  return <div>Component 2</div>;
  return <div>Component 2</div>;
}
      `
    },
  ],
  notes: [],
  drawings: [],
}

export default function Grid() {
  const { containerRef, dragging, zoom, offset } = useGrid();
  const { setCodeWindows, activeCodeWindow, setActiveCodeWindow } = useCode();
  const { blueprints, setBlueprints } = useBlueprints();

  useEffect(() => {
    setBlueprints(dummyData as blueprints);
  }, [])

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

  const gridStyle = useMemo(() => {
    return getGridStyle(zoom, offset);
  }, [zoom, offset]);

  return (
    //* THIS DIVE IS THE GRID BACKGROUND
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        position: "relative",
              ...gridStyle,

        // backgroundSize: `${50 * zoom}px ${50 * zoom}px`,
        // backgroundPosition: `${offset.x}px ${offset.y}px`,
        cursor: dragging ? "grabbing" : "",
      }}
      className="bg-grid h-full"
      ref={containerRef}
    >

      {/* percentage */}
      <div className={`absolute top-2 border border-container-border ${showZoom ? 'opacity-100' : 'opacity-0'} z-50 transition-all duration-200 left-2 bg-background text-title text-sm px-4 py-1 rounded`}>
        {(zoom*100).toString().endsWith(".5") ? (zoom*100).toFixed(1) : (zoom*100).toFixed(0)}%
      </div>

      <BottomLeftMenu />

      <CreateComponentMenu />

      <DrawingMenu />

      {/* //* THIS DIV MAKES IT SO THE PANNING AND ZOOMING AFFECTS THE CONTENT */}
      <div
        className="h-full w-full"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {blueprints.components.map(component => {
          // instance is type component
          return null; // render nothing
        })}

        {blueprints.notes.map(note => {
          // instance is type note
          return null; // render nothing
        })}

        {blueprints.drawings.map(drawing => {
          // instance is type drawing
          return null; // render nothing
        })}

        {blueprints.screens.map(screenInstance => (
          <div
            style={{
              position: 'absolute',
              left: screenInstance.position.x,
              top: screenInstance.position.y,
            }}
            className={`
              VIEW w-[1024px] bg-gray-700 p-2 h-full
              ${screenInstance.id == activeCodeWindow ? "border-4 border-title" : "border-2 border-gray-600 hover:border-gray-300 cursor-pointer"}
            `}
            key={screenInstance.id}
            onClick={() => {
              setEditMenuState(lastMenuState || "CODE");
              setWindowDividerPosition(prev => prev || 50);
              setCodeWindows(prev => {
                const exists = prev.find(cw => cw.id === screenInstance.id);
                if (exists) {
                  return prev;
                }
                return [
                  ...prev,
                  {
                    id: screenInstance.id,
                    name: `Component ${screenInstance.id}`,
                    code: screenInstance.code
                  }
                ]
              })
              setActiveCodeWindow(screenInstance.id);
            }}
          >
            {screenInstance.id}
          </div>
        ))}
      </div>

      <DrawingLayer />

    </div>
  );
};
