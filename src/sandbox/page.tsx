import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Grid from "./_components/grid/Grid";
import { faClose, faCode, faGridHorizontal, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import Editor from "./_components/editor/Editor";
import useOnMouseWheel from "./_functions/grid/onMouseWheel";
import useOnMouseDown from "./_functions/grid/onMouseDown";
import useOnMouseUp from "./_functions/grid/onMouseUp";
import useOnMouseMove from "./_functions/grid/onMouseMove";
import { useCode } from "./_providers/CodeContextProvider";
import { useGrid } from "./_providers/GridContextProvider";
import { useBlueprints } from "./_providers/BlueprintsContextProvider";
import { BuilderMenuMode, useBuilderPanel } from "./_providers/BuilderPanelContextProvider";

export const template = 'sandbox'; 
export default function Home() {
  
  const { 
    windowDividerDragging, 
    builderMenuMode, 
    windowDividerPosition, 
    setBuilderMenuMode, 
  } = useBuilderPanel();

  const {
    setActiveCodeWindow,
  } = useCode();

  // const {
  //   blueprints
  // } = useBlueprints();

  // const {
  //   zoom,
  //   offset
  // } = useGrid();

  // console.log(blueprints)
  // console.log(zoom);
  // console.log(offset);

  useOnMouseWheel();
  useOnMouseDown();
  useOnMouseUp();
  useOnMouseMove();

  return (
    <div className="h-full w-full">

      <div className="flex h-full w-full relative">

        <div 
          id="leftPanel"
          className={`
            h-full w-full bg-background 
            ${windowDividerDragging.current ? "" : "transition-all duration-300"}
          `}
          style={{
            width: builderMenuMode != "CLOSED" ? `${windowDividerPosition || 50}%` : '100%',
          }}
        >
          
          <div className="bg-container2 py-2 px-4 flex gap-2 items-center">
            <FontAwesomeIcon
              icon={faGridHorizontal}
            ></FontAwesomeIcon>
            <h1>Grid</h1>
          </div>

          <div className="flex h-[calc(100%-40px)]">
            <Grid />
          </div>

        </div>

        <div 
          className={`bg-container2 h-full w-2 ${builderMenuMode == BuilderMenuMode.CLOSED ? "hidden" : ""} cursor-col-resize`}
          id="windowDivider"
        ></div>

        <div 
          id="rightPanel"
          className={`
            flex flex-col h-full bg-container2 overflow-hidden ${builderMenuMode == BuilderMenuMode.CLOSED ? "" : ""}
            ${windowDividerDragging.current ? "" : "transition-all duration-300"}
          `}
          style={{
            width: builderMenuMode != BuilderMenuMode.CLOSED ? `${100 - (windowDividerPosition || 50)}%` : '0%',
          }}
        >
          <div className="flex">
            <div 
              className={`group py-2 px-4 flex gap-2 items-center border-b-2 transition-border duration-200
                ${builderMenuMode === BuilderMenuMode.CODE ? "border-title" : "hover:border-muted border-transparent cursor-pointer"}
              `}
              onClick={() => { setBuilderMenuMode(BuilderMenuMode.CODE) }}
            >
              <div 
                className="flex gap-2 items-center"
              >
                <FontAwesomeIcon
                  icon={faCode}
                ></FontAwesomeIcon>
                <h1>Code</h1>
              </div>
              <FontAwesomeIcon
                className={`text-muted cursor-pointer hover:text-title ${builderMenuMode == BuilderMenuMode.CODE ? "" : "opacity-0"} group-hover:opacity-100`}
                onClick={(e) => { 
                  e.stopPropagation();
                  setBuilderMenuMode(BuilderMenuMode.CLOSED);
                  setActiveCodeWindow(null);
                }}
                icon={faClose}
              ></FontAwesomeIcon>
            </div>
            <div 
              className={`group py-2 px-4 flex gap-2 items-center border-b-2 transition-border duration-200
                ${builderMenuMode === BuilderMenuMode.BUILDER ? "border-title" : "hover:border-muted border-transparent cursor-pointer"}
              `}
              onClick={() => { setBuilderMenuMode(BuilderMenuMode.BUILDER) }}
            >
              <div 
                className="flex gap-2 items-center"
              >
                <FontAwesomeIcon
                  icon={faPenToSquare}
                ></FontAwesomeIcon>
                <h1>Builder</h1>
              </div>
              <FontAwesomeIcon
                className={`text-muted cursor-pointer hover:text-title ${builderMenuMode == BuilderMenuMode.BUILDER ? "" : "opacity-0"} group-hover:opacity-100`}
                onClick={(e) => { 
                  e.stopPropagation();
                  setBuilderMenuMode(BuilderMenuMode.CLOSED);
                  setActiveCodeWindow(null);
                }}
                icon={faClose}
              ></FontAwesomeIcon>
            </div>
          </div>

          <Editor />
        </div>
      </div>
    </div>
  );
};
