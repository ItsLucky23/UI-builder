import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from "src/_components/Tooltip";
import { faEyeSlash, faPen, faBorderAll, faEye, faBorderNone } from "@fortawesome/free-solid-svg-icons";
import { useDrawing } from "src/sandbox/_providers/DrawingContextProvider";
import { useBlueprints } from "src/sandbox/_providers/BlueprintsContextProvider";

export default function BottomLeftMenu() {

  const {
    drawingEnabled,
    setDrawingEnabled,
    showDrawings,
    setShowDrawings,
  } = useDrawing();

  const { 
    highlightInstances, 
    setHighlightInstances 
  } = useBlueprints();

  return (
    <div className={`
      MENU
      absolute bottom-4 left-4 z-50 text-title text-sm flex items-center gap-2
    `}>

      {/* draw icon */}
      <Tooltip
        content={drawingEnabled ? "Disable drawing mode" : "Enable drawing mode"}
        offsetY={"-200% - 12px"}
        offsetX={"50%"}
        className="bg-container2 p-2 text-nowrap border border-container2-border rounded"
      >
        <div
          className={`
            MENU
            p-2 rounded-full bg-container2 outline
            ${drawingEnabled ? "outline-primary" : "outline-none"}
          `}
          onClick={() => setDrawingEnabled(!drawingEnabled)}
        >
          <FontAwesomeIcon
            className="pointer-events-none"
            icon={faPen}
          />
        </div>
      </Tooltip>

      {/* Hide drawings */}
      <Tooltip
        content={showDrawings ? "Hide drawings" : "Show drawings"}
        offsetY={"-200% - 12px"}
        offsetX={"50%"}
        className={`bg-container2 p-2 text-nowrap border border-container2-border rounded`}
      >
        <div
          className={`
            MENU
            p-2 rounded-full bg-container2 outline
            ${showDrawings ? "outline-primary" : "outline-none"}
          `}
          onClick={() => setShowDrawings(!showDrawings)}
        >
          <FontAwesomeIcon
            className="pointer-events-none"
            icon={showDrawings ? faEye : faEyeSlash}
          />
        </div>
      </Tooltip>

      {/* Toggle Outlines */}
      <Tooltip
        content={highlightInstances ? "Hide outlines" : "Show outlines"}
        offsetY={"-200% - 12px"}
        offsetX={"50%"}
        className={`bg-container2 p-2 text-nowrap border border-container2-border rounded`}
      >
        <div
          className={`
            MENU
            p-2 rounded-full bg-container2 outline
            ${highlightInstances ? "outline-primary" : "outline-none"}
          `}
          onClick={() => setHighlightInstances(prev => !prev)}
        >
          <FontAwesomeIcon
            className="pointer-events-none"
            icon={highlightInstances ? faBorderAll : faBorderNone}
          />
        </div>
      </Tooltip>

      {/* Toggle Selector mode */}
      {/* <Tooltip
        content={highlightInstances ? "Hide outlines" : "Show outlines"}
        offsetY={"-200% - 12px"}
        offsetX={"50%"}
        className={`bg-container2 p-2 text-nowrap border border-container2-border rounded`}
      >
        <div
          className={`
            MENU
            p-2 rounded-full bg-container2 outline
            ${highlightInstances ? "outline-primary" : "outline-none"}
          `}
          onClick={() => setHighlightInstances(prev => !prev)}
        >
          <FontAwesomeIcon
            className="pointer-events-none"
            icon={faBorderAll}
          />
        </div>
      </Tooltip> */}

      {/* //? disabled for now cause editor rerenders every time we time so the zoomsize gets reset, also it dont work with the scroll option */}
      {/* <Tooltip
        content={"Change zoom level"}
        offsetY={"-200% - 12px"}
        offsetX={"20px"}
        className={`bg-container2 p-2 text-nowrap border border-container2-border rounded`}
      >
        <div className={`
          MENU
          p-2 rounded-full bg-container2 flex gap-1 items-center
        `}>
          <div 
            className="hover:bg-background h-6 w-6 rounded-full flex items-center justify-center"
            onClick={() => { setCodeWindowSize(prev => prev - 2) }}
          >
            <FontAwesomeIcon
              icon={faMinus}
            />
          </div>
          <div>{Math.round(codeWindowSize/16 * 100)}%</div>
          <div 
            className="hover:bg-background h-6 w-6 rounded-full flex items-center justify-center"
            onClick={() => { setCodeWindowSize(prev => prev + 2) }}
          >
            <FontAwesomeIcon
              icon={faPlus}
            />
          </div>
        </div>  
      </Tooltip> */}

    </div>
  )
}