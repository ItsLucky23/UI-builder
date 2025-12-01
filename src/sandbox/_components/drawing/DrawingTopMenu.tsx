import { useDrawing } from "src/sandbox/_providers/DrawingContextProvider";
import { HexColorPicker } from "react-colorful";
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faEraser, faPencilAlt, faPalette } from "@fortawesome/free-solid-svg-icons";

export default function DrawingTopMenu() {

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

  if (!drawingEnabled) { return null }

  const colors = [
    "#ef4444", // Red
    "#ff8904", // Orange
    "#ffdf20", // Yellow
    "#05df72", // Green
    "#22d3ee", // Cyan
    "#3b82f6", // Blue
    "#a855f7", // Purple
    "#ec4899", // Pink
  ];

  return (
    <div
      className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex gap-3 p-3 bg-container2 border border-container2-border rounded-lg shadow-xl"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <button
        className={`flex p-2 rounded transition-colors ${!erasing ? 'bg-primary text-white' : 'hover:bg-primary-hover text-text-secondary'}`}
        onClick={() => {
          setErasing(false)
        }}
      >
        <FontAwesomeIcon icon={faPencilAlt} />
      </button>
      <button
        className={`flex p-2 rounded transition-colors ${erasing ? 'bg-primary text-white' : 'hover:bg-primary-hover text-text-secondary'}`}
        onClick={() => setErasing(true)}
      >
        <FontAwesomeIcon icon={faEraser} />
      </button>

      {/* <div className="h-px bg-container3-border my-1" /> */}

    </div>
  )
}