
import { ErasingMode, useDrawing } from "src/sandbox/_providers/DrawingContextProvider";
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser, faPencilAlt, faAlignCenter, faSquare, faCircle, faDiamond, faMousePointer, faSlash, faRulerCombined, faArrowRight, faFillDrip, faDownload, faObjectGroup, faFont } from "@fortawesome/free-solid-svg-icons";
import { clipStrokesToRect } from "src/sandbox/_functions/drawing/clipUtils";
import Tooltip from "src/_components/Tooltip";

export default function DrawingTopMenu() {

  const {
    drawingEnabled,
    erasing,
    setErasing,
    activeShape,
    setActiveShape,
    selectionMode,
    setSelectionMode,
    showMeasurements,
    setShowMeasurements,
    showDrawings,
    selectedStrokeIds,
    setSelectedStrokeIds,
    strokes,
    marqueeMode,
    setMarqueeMode,
    marqueeBox,
    setMarqueeBox,
    fillMode,
    setFillMode,
    textMode,
    setTextMode
  } = useDrawing();

  const [lastErasingMode, setLastErasingMode] = useState<ErasingMode>(ErasingMode.DISABLED);
  const [erasingOptionMenu, setErasingOptionMenu] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [_, setOpenColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setOpenColorPicker(false);
      }

      if (!(event.target as HTMLElement).closest('.drawingOptionMenu')) {
        setErasingOptionMenu(false);
        setExportMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [])

  useEffect(() => {
    setActiveShape(null)
    setErasing(ErasingMode.DISABLED)
  }, [showDrawings])

  useEffect(() => {
    setLastErasingMode(erasing);
  }, [erasing]);

  if (!drawingEnabled) { return null }

  return (
    <div
      className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex gap-3 p-3 bg-container2 border border-container2-border rounded-lg shadow-xl select-none"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* Selection Mode */}
      <Tooltip
        content={"Select Tool"}
        offsetY={"100% - 12px"}
        offsetX={"50%"}
        className={`bg-container2 p-2 text-nowrap border border-container2-border rounded`}
      >
        <button
          className={`flex p-2 rounded transition-colors ${selectionMode ? 'bg-primary text-white' : 'hover:bg-primary-hover text-text-secondary'}`}
          onClick={() => {
            setErasing(ErasingMode.DISABLED)
            setActiveShape(null)
            setSelectionMode(true)
            setFillMode(false)
            setTextMode(false)
            setMarqueeMode(false)
            setMarqueeBox(null)
            setSelectedStrokeIds([])
          }}
        >
          <FontAwesomeIcon icon={faMousePointer} />
        </button>
      </Tooltip>

      {/* Area Select (Marquee) */}
      <Tooltip
        content={"Area Select (Marquee)"}
        offsetY={"100% - 12px"}
        offsetX={"50%"}
        className={`bg-container2 p-2 text-nowrap border border-container2-border rounded`}
      >
        <button
          className={`flex p-2 rounded transition-colors ${marqueeMode ? 'bg-primary text-white' : 'hover:bg-primary-hover text-text-secondary'}`}
          onClick={() => {
            setErasing(ErasingMode.DISABLED)
            setActiveShape(null)
            setSelectionMode(false)
            setFillMode(false)
            setTextMode(false)
            setMarqueeMode(true)
            setSelectedStrokeIds([])
          }}
        >
          <FontAwesomeIcon icon={faObjectGroup} />
        </button>
      </Tooltip>

      <div className="w-1 flex-grow bg-container3 rounded"></div>

      {/* Draw mode */}
      <Tooltip
        content={"Draw mode"}
        offsetY={"100% - 12px"}
        offsetX={"50%"}
        className={`bg-container2 p-2 text-nowrap border border-container2-border rounded`}
      >
        <button
          className={`flex p-2 rounded transition-colors ${!erasing && !activeShape && !selectionMode && !fillMode && !marqueeMode && !textMode ? 'bg-primary text-white' : 'hover:bg-primary-hover text-text-secondary'}`}
          onClick={() => {
            setErasing(ErasingMode.DISABLED)
            setActiveShape(null)
            setSelectionMode(false)
            setFillMode(false)
            setTextMode(false)
            setMarqueeMode(false)
            setSelectedStrokeIds([])
          }}
        >
          <FontAwesomeIcon icon={faPencilAlt} />
        </button>
      </Tooltip>

      {/* Fill Tool */}
      <Tooltip
        content={"Fill Tool"}
        offsetY={"100% - 12px"}
        offsetX={"50%"}
        className={`bg-container2 p-2 text-nowrap border border-container2-border rounded`}
      >
        <button
          className={`flex p-2 rounded transition-colors ${fillMode ? 'bg-primary text-white' : 'hover:bg-primary-hover text-text-secondary'}`}
          onClick={() => {
            setErasing(ErasingMode.DISABLED)
            setActiveShape(null)
            setSelectionMode(false)
            setFillMode(true)
            setTextMode(false)
            setMarqueeMode(false)
            setSelectedStrokeIds([])
          }}
        >
          <FontAwesomeIcon icon={faFillDrip} />
        </button>
      </Tooltip>

      <Tooltip
        content={"Text Tool"}
        offsetY={"100% - 12px"}
        offsetX={"50%"}
        className={`bg-container2 p-2 text-nowrap border border-container2-border rounded`}
      >
        <button
          className={`flex p-2 rounded transition-colors ${textMode ? 'bg-primary text-white' : 'hover:bg-primary-hover text-text-secondary'}`}
          onClick={() => {
            setErasing(ErasingMode.DISABLED)
            setActiveShape(null)
            setSelectionMode(false)
            setFillMode(false)
            setTextMode(true)
            setMarqueeMode(false)
            setSelectedStrokeIds([])
          }}
        >
          <FontAwesomeIcon icon={faFont} />
        </button>
      </Tooltip>



      {/* Eraser with options */}
      <button
        className={`relative drawingOptionMenu`}
        onClick={() => {
          setErasing(lastErasingMode);
          setActiveShape(null);
          setSelectionMode(false);
          setFillMode(false);
          setMarqueeMode(false);
          setSelectedStrokeIds([]);
          setTextMode(false);
          setErasingOptionMenu(prev => !prev)
        }}
      >
        <Tooltip
          content={"Select erase mode"}
          offsetY={"100% - 12px"}
          offsetX={"50%"}
          className={`bg-container2 p-2 text-nowrap border border-container2-border rounded`}
          condition={!erasingOptionMenu}
        >
          <div className={`
            px-2 py-1 rounded transition-colors
            ${erasing ? 'bg-primary text-white' : 'hover:bg-primary-hover text-text-secondary'}
          `}>
            <FontAwesomeIcon icon={lastErasingMode == ErasingMode.FULL ? faEraser : faAlignCenter} />
          </div>
        </Tooltip>
        <div
          onClick={(e) => e.stopPropagation()}
          className={`
            absolute bg-container2 border border-container2-border rounded-lg p-3 top-0 left-0 translate-y-full -translate-x-1/4 flex gap-2 transition-all duration-150
            ${erasingOptionMenu ? 'opacity-100 scale-100' : 'scale-90 opacity-0'}
          `}
        >
          <Tooltip
            content={"Erase complete drawing"}
            offsetY={"100% - 12px"}
            offsetX={"50%"}
            className={`bg-container2 p-2 text-nowrap border border-container2-border rounded`}
          >
            <div
              className={`relative flex p-2 rounded transition-colors ${lastErasingMode == ErasingMode.FULL ? 'bg-primary text-white' : 'hover:bg-primary-hover text-text-secondary'}`}
              onClick={() => {
                setErasing(ErasingMode.FULL)
                setActiveShape(null)
                setSelectionMode(false);
                setFillMode(false);
                setMarqueeMode(false);
                setSelectedStrokeIds([])
                setTextMode(false)
              }}
            ><FontAwesomeIcon icon={faEraser} /></div>
          </Tooltip>
          <Tooltip
            content={"Erase partial drawing"}
            offsetY={"100% - 12px"}
            offsetX={"50%"}
            className={`bg-container2 p-2 text-nowrap border border-container2-border rounded`}
          >
            <div
              className={`relative flex p-2 rounded transition-colors ${lastErasingMode == ErasingMode.PARTIAL ? 'bg-primary text-white' : 'hover:bg-primary-hover text-text-secondary'} rotate-90`}
              onClick={() => {
                setErasing(ErasingMode.PARTIAL)
                setActiveShape(null)
                setSelectionMode(false);
                setFillMode(false);
                setMarqueeMode(false);
                setSelectedStrokeIds([])
                setTextMode(false)
              }}
            ><FontAwesomeIcon icon={faAlignCenter} /></div>
          </Tooltip>
        </div>
      </button>

      <div className="w-1 flex-grow bg-container3 rounded"></div>

      {/* Shapes */}
      <Tooltip
        content={"Draw Arrow"}
        offsetY={"100% - 12px"}
        offsetX={"50%"}
        className={`bg-container2 p-2 text-nowrap border border-container2-border rounded`}
      >
        <button
          className={`flex p-2 rounded transition-colors ${activeShape === 'arrow' ? 'bg-primary text-white' : 'hover:bg-primary-hover text-text-secondary'}`}
          onClick={() => {
            setErasing(ErasingMode.DISABLED)
            setActiveShape('arrow')
            setSelectionMode(false);
            setFillMode(false);
            setTextMode(false);
            setMarqueeMode(false);
            setSelectedStrokeIds([])
          }}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </Tooltip>

      {/* Draw Line */}
      <Tooltip
        content={"Draw Line"}
        offsetY={"100% - 12px"}
        offsetX={"50%"}
        className={`bg-container2 p-2 text-nowrap border border-container2-border rounded`}
      >
        <button
          className={`flex p-2 rounded transition-colors ${activeShape === 'line' ? 'bg-primary text-white' : 'hover:bg-primary-hover text-text-secondary'}`}
          onClick={() => {
            setErasing(ErasingMode.DISABLED)
            setActiveShape('line')
            setSelectionMode(false);
            setFillMode(false);
            setTextMode(false);
            setMarqueeMode(false);
            setSelectedStrokeIds([])
          }}
        >
          <FontAwesomeIcon icon={faSlash} />
        </button>
      </Tooltip>

      {/* Draw Square */}
      <Tooltip
        content={"Draw Square"}
        offsetY={"100% - 12px"}
        offsetX={"50%"}
        className={`bg-container2 p-2 text-nowrap border border-container2-border rounded`}
      >
        <button
          className={`flex p-2 rounded transition-colors ${activeShape === 'square' ? 'bg-primary text-white' : 'hover:bg-primary-hover text-text-secondary'}`}
          onClick={() => {
            setErasing(ErasingMode.DISABLED)
            setActiveShape('square')
            setSelectionMode(false);
            setFillMode(false);
            setTextMode(false);
            setMarqueeMode(false);
            setSelectedStrokeIds([])
          }}
        >
          <FontAwesomeIcon icon={faSquare} />
        </button>
      </Tooltip>

      {/* Draw Circle */}
      <Tooltip
        content={"Draw Circle"}
        offsetY={"100% - 12px"}
        offsetX={"50%"}
        className={`bg-container2 p-2 text-nowrap border border-container2-border rounded`}
      >
        <button
          className={`flex p-2 rounded transition-colors ${activeShape === 'circle' ? 'bg-primary text-white' : 'hover:bg-primary-hover text-text-secondary'}`}
          onClick={() => {
            setErasing(ErasingMode.DISABLED)
            setActiveShape('circle')
            setSelectionMode(false);
            setFillMode(false);
            setTextMode(false);
            setMarqueeMode(false);
            setSelectedStrokeIds([])
          }}
        >
          <FontAwesomeIcon icon={faCircle} />
        </button>
      </Tooltip>

      {/* Draw Diamond */}
      <Tooltip
        content={"Draw Diamond"}
        offsetY={"100% - 12px"}
        offsetX={"50%"}
        className={`bg-container2 p-2 text-nowrap border border-container2-border rounded`}
      >
        <button
          className={`flex p-2 rounded transition-colors ${activeShape === 'diamond' ? 'bg-primary text-white' : 'hover:bg-primary-hover text-text-secondary'}`}
          onClick={() => {
            setErasing(ErasingMode.DISABLED)
            setActiveShape('diamond')
            setSelectionMode(false);
            setFillMode(false);
            setTextMode(false);
            setMarqueeMode(false);
            setSelectedStrokeIds([])
          }}
        >
          <FontAwesomeIcon icon={faDiamond} />
        </button>
      </Tooltip>

      <div className="w-1 flex-grow bg-container3 rounded"></div>

      {/* Toggle Measurements */}
      <Tooltip
        content={"Toggle Measurements"}
        offsetY={"100% - 12px"}
        offsetX={"50%"}
        className={`bg-container2 p-2 text-nowrap border border-container2-border rounded`}
      >
        <button
          className={`flex p-2 rounded transition-colors ${showMeasurements ? 'bg-primary text-white' : 'hover:bg-primary-hover text-text-secondary'}`}
          onClick={() => setShowMeasurements(!showMeasurements)}
        >
          <FontAwesomeIcon icon={faRulerCombined} />
        </button>
      </Tooltip>

      {/* Export Menu */}
      <div className="relative drawingOptionMenu">
        <Tooltip
          content={"Export"}
          offsetY={"100% - 12px"}
          offsetX={"50%"}
          className={`bg-container2 p-2 text-nowrap border border-container2-border rounded`}
          condition={!exportMenuOpen} // Hide tooltip when menu is open
        >
          <button
            className={`flex p-2 rounded transition-colors ${exportMenuOpen ? 'bg-primary text-white' : 'hover:bg-primary-hover text-text-secondary'}`}
            onClick={() => {
              setExportMenuOpen(prev => !prev);
              // Close other menus if needed
              setErasingOptionMenu(false);
            }}
          >
            <FontAwesomeIcon icon={faDownload} />
          </button>
        </Tooltip>

        {exportMenuOpen && (
          <div className="absolute top-full right-0 pt-2 w-32 z-50">
            <div className="bg-container2 border border-container2-border rounded-lg shadow-xl p-1">
              <button
                className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-container3 rounded"
                onClick={() => {
                  import('src/sandbox/_functions/drawing/exportUtils').then(mod => {
                    const box = marqueeBox || undefined;
                    // If marquee box exists, CLIP strokes to the box.
                    // Otherwise respect selection.
                    const strokesToExport = box
                      ? clipStrokesToRect(strokes, box)
                      : (selectedStrokeIds.length > 0 ? strokes.filter(s => selectedStrokeIds.includes(s.id)) : strokes);

                    mod.downloadSvg(strokesToExport, box);
                    setExportMenuOpen(false);
                  })
                }}
              >
                Export SVG
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-container3 rounded"
                onClick={() => {
                  import('src/sandbox/_functions/drawing/exportUtils').then(mod => {
                    const box = marqueeBox || undefined;
                    const strokesToExport = box
                      ? clipStrokesToRect(strokes, box)
                      : (selectedStrokeIds.length > 0 ? strokes.filter(s => selectedStrokeIds.includes(s.id)) : strokes);

                    mod.downloadPng(strokesToExport, box);
                    setExportMenuOpen(false);
                  })
                }}
              >
                Export PNG
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
