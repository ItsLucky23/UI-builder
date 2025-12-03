import { useDrawing } from "src/sandbox/_providers/DrawingContextProvider";
import { useState } from "react";
import {
  Undo2,
  Redo2,
  Trash2,
} from "lucide-react";
import { DefaultColorStyle, DefaultSizeStyle } from "tldraw";

export default function DrawingSideMenu() {
  const {
    drawingEnabled,
    editor,
    undo,
    redo,
    deleteSelected,
  } = useDrawing();

  const [activeColor, setActiveColor] = useState('black');
  const [activeSize, setActiveSize] = useState('m');

  if (!drawingEnabled) { return null }

  const colors = [
    { name: 'black', hex: '#000000' },
    { name: 'grey', hex: '#656565' },
    { name: 'red', hex: '#ef4444' },
    { name: 'orange', hex: '#ffba00' },
    { name: 'green', hex: '#05df72' },
    { name: 'blue', hex: '#22d3ee' },
    { name: 'violet', hex: '#a855f7' },
  ];

  const sizes = [
    { id: 's', label: 'S' },
    { id: 'm', label: 'M' },
    { id: 'l', label: 'L' },
    { id: 'xl', label: 'XL' },
  ];

  const handleColorClick = (colorName: string) => {
    if (!editor) return;
    editor.setStyleForSelectedShapes(DefaultColorStyle, colorName as any);
    editor.setStyleForNextShapes(DefaultColorStyle, colorName as any);
    setActiveColor(colorName);
  };

  const handleSizeClick = (size: string) => {
    if (!editor) return;
    // Only update selected shapes if there are any selected
    if (editor.getSelectedShapeIds().length > 0) {
      editor.setStyleForSelectedShapes(DefaultSizeStyle, size as any);
    }
    // Always update for next shapes
    editor.setStyleForNextShapes(DefaultSizeStyle, size as any);
    setActiveSize(size);
  };

  return (
    <div
      className="absolute left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 p-3 bg-container2 border border-container2-border rounded-lg shadow-xl w-40 max-h-[80vh] overflow-y-auto"
      onPointerDown={(e) => e.stopPropagation()} // Prevent grid interaction
    >
      {/* Sizes */}
      <div className="flex justify-between bg-container3 rounded p-1">
        {sizes.map(size => (
          <button
            key={size.id}
            className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium transition-colors ${activeSize === size.id ? 'bg-primary text-white' : 'text-text-secondary hover:bg-container2'}`}
            onClick={() => handleSizeClick(size.id)}
          >
            {size.label}
          </button>
        ))}
      </div>

      <div className="h-px bg-container3-border my-1" />

      {/* Colors */}
      <div className="grid grid-cols-4 gap-1">
        {colors.map(color => (
          <button
            key={color.name}
            className={`w-full aspect-square rounded-full border transition-transform hover:scale-110 ${activeColor === color.name ? 'ring-2 ring-primary ring-offset-1 ring-offset-container2' : 'border-transparent'}`}
            style={{ backgroundColor: color.hex }}
            onClick={() => handleColorClick(color.name)}
            title={color.name}
          />
        ))}
      </div>

      <div className="h-px bg-container3-border my-1" />

      {/* Actions */}
      <div className="grid grid-cols-3 gap-1">
        <button
          className="flex items-center justify-center p-2 bg-container3 hover:bg-container3-hover rounded text-text-secondary"
          onClick={undo}
          title="Undo"
        >
          <Undo2 size={18} />
        </button>
        <button
          className="flex items-center justify-center p-2 bg-container3 hover:bg-container3-hover rounded text-text-secondary"
          onClick={redo}
          title="Redo"
        >
          <Redo2 size={18} />
        </button>
        <button
          className="flex items-center justify-center p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded"
          onClick={deleteSelected}
          title="Delete Selected"
        >
          <Trash2 size={18} />
        </button>
      </div>

    </div>
  )
}