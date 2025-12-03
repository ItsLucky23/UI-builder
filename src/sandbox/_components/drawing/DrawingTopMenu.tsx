import { useDrawing } from "src/sandbox/_providers/DrawingContextProvider";
import { useEffect, useState } from "react";
import {
  MousePointer2,
  Pencil,
  Eraser,
  Square,
  Circle,
  ArrowRight,
  Type,
  Scissors
} from "lucide-react";
import { GeoShapeGeoStyle } from "tldraw";
import Tooltip from "src/_components/Tooltip";

export default function DrawingTopMenu() {
  const {
    drawingEnabled,
    editor,
    setTool,
    partialEraser,
    setPartialEraser
  } = useDrawing();

  const [activeTool, setActiveTool] = useState('draw');

  useEffect(() => {
    if (!editor) return;

    const handleChange = () => {
      const tool = editor.getCurrentToolId();
      // If partial eraser is active, show it as active tool
      if (partialEraser) {
        setActiveTool('partial-eraser');
      } else {
        setActiveTool(tool);
      }
    };

    const cleanup = editor.store.listen(handleChange);
    return () => cleanup();
  }, [editor, partialEraser]);

  if (!drawingEnabled) { return null }

  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'draw', icon: Pencil, label: 'Draw' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'partial-eraser', icon: Scissors, label: 'Partial' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
    { id: 'text', icon: Type, label: 'Text' },
  ];

  const shapes = [
    { id: 'rectangle', icon: Square, label: 'Rectangle', tool: 'geo' },
    { id: 'ellipse', icon: Circle, label: 'Circle', tool: 'geo' },
  ];

  const handleToolClick = (id: string, geoId?: string) => {
    if (!editor) return;

    if (id === 'partial-eraser') {
      setPartialEraser(true);
      setActiveTool('partial-eraser');
      editor.setCurrentTool('select');
      return;
    }

    setPartialEraser(false);

    if (id === 'rectangle' || id === 'ellipse') {
      editor.setCurrentTool('geo');
      editor.setStyleForNextShapes(GeoShapeGeoStyle, geoId as any);
    } else {
      setTool(id);
    }
  };

  return (
    <div
      className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex gap-1 p-2 bg-container2 border border-container2-border rounded-lg shadow-xl"
      onPointerDown={(e) => e.stopPropagation()}
    >
      {tools.map(tool => (
        <Tooltip key={tool.id} content={tool.label} vertical="bottom">
          <button
            className={`flex items-center justify-center p-2 rounded transition-colors ${activeTool === tool.id ? 'bg-primary text-white' : 'hover:bg-container3 text-text-secondary'}`}
            onClick={() => handleToolClick(tool.id)}
          >
            <tool.icon size={20} />
          </button>
        </Tooltip>
      ))}

      <div className="w-px bg-container3-border mx-1" />

      {shapes.map(shape => (
        <Tooltip key={shape.id} content={shape.label} vertical="bottom">
          <button
            className={`flex items-center justify-center p-2 rounded transition-colors ${activeTool === 'geo' && editor?.getStyleForNextShape(GeoShapeGeoStyle) === shape.id ? 'bg-primary text-white' : 'hover:bg-container3 text-text-secondary'}`}
            onClick={() => handleToolClick(shape.id, shape.id)}
          >
            <shape.icon size={20} />
          </button>
        </Tooltip>
      ))}
    </div>
  )
}