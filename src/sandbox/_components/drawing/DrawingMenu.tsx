import { useDrawing } from "src/sandbox/_providers/DrawingContextProvider";
import { HexColorPicker } from "react-colorful";
import { useEffect, useState } from "react";

export default function DrawingMenu({

}: {

}) {

  const { 
    drawingEnabled,

    brushSize,
    setBrushSize,

    brushColor,
    setBrushColor,
  } = useDrawing();

  const [openColorPicker, setOpenColorPicker] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenColorPicker(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [])

  if (!drawingEnabled) { return null }

  return (
    <div 
      className="bg-container2 p-2 left-4 top-1/2 -translate-y-1/2 absolute rounded flex flex-col gap-2 z-50 border border-container3-border"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <div className="space-y-2">

        <div className="flex justify-between">
          <h1 className="">Brush size</h1>
          <p>{brushSize/10}</p>
        </div>
        <input 
          min={1}
          max={20}
          type="range"
          value={brushSize}
          onChange={(e) => {
            console.log(e.target.value)
            setBrushSize(Number(e.target.value))}
          }
          className="w-full"
        ></input>

      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          {/* <div className="bg-cyan-400 p-4 rounded" onClick={() => setBrushColor("#22d3ee")}></div> */}
          <div className="p-4 rounded" style={{ backgroundColor: "#22d3ee" }} onClick={() => setBrushColor("#22d3ee")}></div>
          {/* <div className="bg-emerald-400 p-4 rounded" onClick={() => setBrushColor("#34d399")}></div> */}
          <div className="p-4 rounded" style={{ backgroundColor: "#34d399" }} onClick={() => setBrushColor("#34d399")}></div>
          {/* <div className="bg-amber-400 p-4 rounded" onClick={() => setBrushColor("#fbbf24")}></div> */}
          <div className="p-4 rounded" style={{ backgroundColor: "#fbbf24" }} onClick={() => setBrushColor("#fbbf24")}></div>
          {/* <div className="bg-fuchsia-400 p-4 rounded" onClick={() => setBrushColor("#e879f9")}></div> */}
          <div className="p-4 rounded" style={{ backgroundColor: "#e879f9" }} onClick={() => setBrushColor("#e879f9")}></div>
        </div>
        <div className="flex gap-2">
          <div className="p-4 rounded" style={{ backgroundColor: "#ffffff" }} onClick={() => setBrushColor("#ffffff")}></div>
          <div className="p-4 rounded" style={{ backgroundColor: "#030712" }} onClick={() => setBrushColor("#030712")}></div>
          <div 
            className="py-4 w-full rounded relative"
            style={{ backgroundColor: brushColor }}
            onClick={() => {
              setOpenColorPicker(!openColorPicker);
            }}
          >
            {openColorPicker && (
              <div
                className="absolute top-1/2 left-[calc(100%+20px)] -translate-y-1/2"
                onClick={(e) => e.stopPropagation()}
              >
                <HexColorPicker
                  color={brushColor}
                  onChange={setBrushColor}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <div className="aspect-square w-10 bg-blue-500 rounded-full"></div>
      <div className="aspect-square w-10 bg-blue-500 rounded-full"></div>
      <div className="aspect-square w-10 bg-blue-500 rounded-full"></div>
      <div className="aspect-square w-10 bg-blue-500 rounded-full"></div>
      <div className="aspect-square w-10 bg-blue-500 rounded-full"></div> */}
    </div>
  )
}