import { useEffect, useState } from "react";
import { useGrid } from "../../_providers/GridContextProvider";
import CreateComponentMenu from "../menus/CreateComponentMenu";
import { useCode } from "../../_providers/CodeContextProvider";
import { blueprints } from "../../types/blueprints";
import { useBlueprints } from "../../_providers/BlueprintsContextProvider";
import DrawingLayer from "../drawing/DrawingLayer";
import BottomLeftMenu from "../menus/BottomLeftMenu";
import DrawingSideMenu from "../drawing/DrawingSideMenu";
import { getGridStyle } from "../../_functions/grid/gridStyle";
import { ScreenRenderer } from "./ScreenRenderer";
import { useBuilderPanel } from "src/sandbox/_providers/BuilderPanelContextProvider";
import DrawingTopMenu from "../drawing/DrawingTopMenu";
import { useDrawing } from "src/sandbox/_providers/DrawingContextProvider";
import Note from "../notes/Note";
import useOnMouseDown from "src/sandbox/_functions/grid/onMouseDown";
import useOnMouseUp from "src/sandbox/_functions/grid/onMouseUp";
import useOnMouseMove from "src/sandbox/_functions/grid/onMouseMove";
import useOnMouseWheel from "src/sandbox/_functions/grid/onMouseWheel";

const dummyData = {
  screens: [
    {
      id: "view1",
      name: "View 1",
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
      name: "View 2",
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
  notes: [
    {
      id: "note1",
      position: { x: 1500, y: 100 },
      width: 400,
      height: 300,
      content: JSON.stringify({
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Project Notes' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Here is a sample note with a code block:' }] },
          { type: 'codeBlock', attrs: { language: 'typescript', code: "console.log('Hello World');" } }
        ]
      })
    }
  ],
  drawings: [],
}

export default function Grid() {
  const {
    containerRef,
    dragging,
    zoom,
    offset
  } = useGrid();

  const {
    setCodeWindows,
    activeCodeWindow,
    setActiveCodeWindow
  } = useCode();

  const {
    blueprints,
    setBlueprints,
    highlightInstances
  } = useBlueprints();

  useEffect(() => {
    setBlueprints(dummyData as blueprints);
  }, [])

  const [showZoom, setShowZoom] = useState(false);
  const { prevBuilderMenuMode, setBuilderMenuMode, setWindowDividerPosition } = useBuilderPanel();

  useEffect(() => {
    setShowZoom(true);
  }, [zoom]);

  useEffect(() => {
    if (!showZoom) { return; }
    const timeout = setTimeout(() => setShowZoom(false), 1000);
    return () => clearTimeout(timeout);
  }, [showZoom, zoom]);

  // Using the new hook approach
  const { handleWheel } = useOnMouseWheel();
  const { handleMouseMove } = useOnMouseMove();
  const { handleOnMouseUp } = useOnMouseUp();
  const { handleMouseDown } = useOnMouseDown();

  return (
    //* THIS DIV IS THE GRID BACKGROUND
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        position: "relative",
        ...getGridStyle(zoom, offset),

        cursor: dragging ? "grabbing" : "",
      }}
      className="bg-grid h-full"
      ref={containerRef}
      onContextMenu={(e) => e.preventDefault()} //? makes it so we cant open the menu on right click
      onMouseDown={(e) => handleMouseDown(e.nativeEvent)}
      onMouseUp={(e) => handleOnMouseUp(e.nativeEvent, false)}
      onMouseLeave={(e) => handleOnMouseUp(e.nativeEvent, true)}
      onMouseMove={(e) => handleMouseMove(e.nativeEvent)}
      onWheel={(e) => handleWheel(e.nativeEvent)}
    >

      {/* percentage */}
      <div className={`absolute top-2 border border-border ${showZoom ? 'opacity-100' : 'opacity-0'} z-50 transition-all duration-200 left-2 bg-background text-text text-sm px-4 py-1 rounded`}>
        {(zoom * 100).toString().endsWith(".5") ? (zoom * 100).toFixed(1) : (zoom * 100).toFixed(0)}%
      </div>

      <div className="pointer-events-auto">
        <BottomLeftMenu />

        <CreateComponentMenu />

        <DrawingSideMenu />

        <DrawingTopMenu />
      </div>

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
        {blueprints.components.map(() => {
          // instance is type component
          return null; // render nothing
        })}

        {/* Notes Layer */}
        {blueprints.notes.map((note) => (
          <Note key={note.id} note={note} />
        ))}

        {blueprints.drawings.map(() => {
          // instance is type drawing
          return null; // render nothing
        })}

        {blueprints.screens.map(screenInstance => {
          return (
            <ScreenRenderer
              key={screenInstance.id}
              id={screenInstance.id}
              name={screenInstance.name}
              code={screenInstance.code}
              style={{
                position: 'absolute',
                left: screenInstance.position.x,
                top: screenInstance.position.y,
              }}
              className={`
                VIEW w-[1024px] h-full overflow-hidden text-text
                ${highlightInstances ? "outline-4 rounded-3xl" : "pointer-events-auto"}
                ${highlightInstances && screenInstance.id != activeCodeWindow ? "outline-border hover:outline-border2 cursor-pointer" : ""}
                ${highlightInstances && screenInstance.id == activeCodeWindow ? "outline-border2" : ""}
              `}
              onClick={() => {
                setBuilderMenuMode(prevBuilderMenuMode);
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
            />
          )
        })}
      </div>

      <DrawingLayer />

    </div>
  )
}