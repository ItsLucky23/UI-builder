import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGrid } from "../../_providers/GridContextProvider";
import Tooltip from "src/_components/Tooltip";
import { faEyeSlash, faPen } from "@fortawesome/free-solid-svg-icons";
import { useDrawing } from "src/sandbox/_providers/DrawingContextProvider";
// import { useCode } from "src/sandbox/_providers/CodeContextProvider";

export default function BottomLeftMenu() {
  
  const { 
    drawingEnabled, 
    setDrawingEnabled, 

    showDrawings, 
    setShowDrawings,

  } = useDrawing();

  // const {
  //   codeWindowSize,
  //   setCodeWindowSize
  // } = useCode();

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
        className="bg-container2 p-2 text-nowrap border border-container-border rounded"
      >
        <div 
          className={`
            MENU
            p-2 rounded-full bg-container2 outline
            ${drawingEnabled ? "outline-white" : "outline-none"}
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
        className={`bg-bg-1 p-2 text-nowrap border border-container-border rounded`}
      >
        <div 
          className={`
            MENU
            p-2 rounded-full bg-bg-3 outline
            ${showDrawings ? "outline-white" : "outline-none"}
          `}
          onClick={() => setShowDrawings(!showDrawings)}
        >
          <FontAwesomeIcon
            className="pointer-events-none"
            icon={faEyeSlash}
          />
        </div>
      </Tooltip>

      {/* //? disabled for now cause editor rerenders every time we time so the zoomsize gets reset, also it dont work with the scroll option */}
      {/* <Tooltip
        content={"Change zoom level"}
        offsetY={"-200% - 12px"}
        offsetX={"20px"}
        className={`bg-container2 p-2 text-nowrap border border-container-border rounded`}
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