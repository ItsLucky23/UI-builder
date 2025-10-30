import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGrid } from "../../_providers/GridContextProvider";
import { fa0, fa5, faArchway, faAward, faDownLong, faEyeSlash, faGrinTongue, faLeaf, faMobileVibrate, faPen } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "src/_components/Tooltip";

export default function BottomLeftMenu() {
  
  const { drawingEnabled, setDrawingEnabled, showDrawings, setShowDrawings } = useGrid();

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

    </div>
  )
}