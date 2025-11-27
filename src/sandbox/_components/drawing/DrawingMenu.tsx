import { useDrawing } from "src/sandbox/_providers/DrawingContextProvider";
import { HexColorPicker } from "react-colorful";
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faEraser, faPencilAlt, faPalette } from "@fortawesome/free-solid-svg-icons";

export default function DrawingMenu() {

  const {
    drawingEnabled,

    brushSize,
    setBrushSize,

    brushColor,
    setBrushColor,

    erasing,
    setErasing,

    setHistoryIndex,
    strokeHistory
  } = useDrawing();

  const [openColorPicker, setOpenColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setOpenColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [])

  useEffect(() => {
    // if (!erasing) { return; }
    // if (brushSize <= 50) { return; }
    setBrushSize(50);
  }, [erasing])

  if (!drawingEnabled) { return null }

  const colors = [
    "#ffffff", // White
    "#030712", // Black
    "#ef4444", // Red
    "#f59e0b", // Amber
    "#22d3ee", // Cyan
    "#3b82f6", // Blue
    "#a855f7", // Purple
    "#ec4899", // Pink
  ];

  return (
    <div
      className="absolute left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 p-3 bg-container2 border border-container3-border rounded-lg shadow-xl w-64"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >

      <div className="flex bg-container3 rounded-md p-1 gap-1">
        <button
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded transition-colors ${!erasing ? 'bg-primary text-white' : 'hover:bg-container2 text-text-secondary'}`}
          onClick={() => {
            setErasing(false)
          }}
        >
          <FontAwesomeIcon icon={faPencilAlt} />
          <span className="text-sm font-medium">Draw</span>
        </button>
        <button
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded transition-colors ${erasing ? 'bg-primary text-white' : 'hover:bg-container2 text-text-secondary'}`}
          onClick={() => setErasing(true)}
        >
          <FontAwesomeIcon icon={faEraser} />
          <span className="text-sm font-medium">Erase</span>
        </button>
      </div>

      <div className="h-px bg-container3-border my-1" />

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-text-secondary">
          <span>Size</span>
          <span>{brushSize}px</span>
        </div>
        <input
          min={1}
          max={erasing ? 250 : 50}
          type="range"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-full h-2 bg-container3 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      <div className="h-px bg-container3-border my-1" />

      {/* Colors */}
      <div className="space-y-2">
        <span className="text-sm text-text-secondary">Color</span>
        <div className="grid grid-cols-4 gap-2">
          {colors.map(color => (
            <button
              key={color}
              className={`w-full aspect-square rounded-md border transition-transform hover:scale-105 ${brushColor === color ? '' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
              onClick={() => {
                setBrushColor(color);
                if (erasing) { setErasing(false) };
              }}
            />
          ))}
        </div>

        {/* Custom Color Picker */}
        <div className="relative" ref={colorPickerRef}>
          <button
            className="w-full flex items-center justify-center gap-2 p-2 bg-container3 hover:bg-container3-hover rounded-md text-sm text-text-secondary transition-colors"
            onClick={() => setOpenColorPicker(!openColorPicker)}
          >
            <FontAwesomeIcon icon={faPalette} />
            <span>Custom Color</span>
            <div
              className="w-4 h-4 rounded-full border border-container3-border ml-auto"
              style={{ backgroundColor: brushColor }}
            />
          </button>

          {openColorPicker && (
            <div className="absolute top-full left-0 mt-2 z-50 shadow-xl rounded-lg overflow-hidden">
              <HexColorPicker color={brushColor} onChange={(c) => {
                setBrushColor(c);
                if (erasing) setErasing(false);
              }} />
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-container3-border my-1" />

      {/* Undo / Redo */}
      <div className="flex gap-2">
        <button
          className="flex-1 flex items-center justify-center gap-2 py-2 bg-container3 hover:bg-container3-hover rounded-md text-text-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setHistoryIndex(prev => Math.max(0, prev - 1))}
          disabled={strokeHistory.length === 0} // Simple check, logic might need refinement based on index
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 py-2 bg-container3 hover:bg-container3-hover rounded-md text-text-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setHistoryIndex(prev => Math.min(prev + 1, strokeHistory.length))}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

    </div>
  )
}