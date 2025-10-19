import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Grid from "./_components/Grid";
import { useMenuStates } from "./_providers/MenuStatesProvider";
import { faClose, faCode, faGridHorizontal, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import CodeEditor from "./_components/CodeEditor";
import BuilderMenu from "./_components/BuilderMenu";

export const template = 'sandbox'; 
export default function Home() {
  
  const { windowDividerDragging, editMenuState, windowDividerPosition, setEditMenuState, setLastMenuState } = useMenuStates();

  return (
    <div className="h-full w-full">

      <div className="flex h-full w-full relative">

        <div 
          id="leftPanel"
          className={`
            h-full w-full bg-container
            ${windowDividerDragging.current ? "" : "transition-all duration-300"}
          `}
          style={{
            width: editMenuState != "CLOSED" ? `${windowDividerPosition || 50}%` : '100%',
          }}
        >
          
          <div className="bg-background py-2 px-4 flex gap-2 items-center">
            <FontAwesomeIcon
              icon={faGridHorizontal}
            ></FontAwesomeIcon>
            <h1>Grid</h1>
          </div>

          <div className="flex flex-1">
            <Grid />
          </div>

        </div>

        <div 
          className={`bg-container h-full w-2 ${editMenuState == "CLOSED" ? "hidden" : ""} cursor-col-resize`}
          id="windowDivider"
        ></div>

        <div 
          id="rightPanel"
          className={`
            flex flex-col h-full bg-container overflow-hidden ${editMenuState == "CLOSED" ? "" : ""}
            ${windowDividerDragging.current ? "" : "transition-all duration-300"}
          `}
          style={{
            width: editMenuState != "CLOSED" ? `${100 - (windowDividerPosition || 50)}%` : '0%',
          }}
        >
          <div className="flex">
            <div 
              className={`group bg-background py-2 px-4 flex gap-2 items-center border-b-2 transition-border duration-200
                ${editMenuState === "CODE" ? "border-title" : "hover:border-muted border-transparent cursor-pointer"}
              `}
              onClick={() => { setEditMenuState("CODE") }}
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
                className={`text-muted cursor-pointer hover:text-title ${editMenuState == "CODE" ? "" : "opacity-0"} group-hover:opacity-100`}
                onClick={(e) => { 
                  e.stopPropagation();
                  setEditMenuState(prev => {
                    if (prev !== "CLOSED") { setLastMenuState(prev); }
                    return "CLOSED"
                  })
                }}
                icon={faClose}
              ></FontAwesomeIcon>
            </div>
            <div 
              className={`group bg-background py-2 px-4 flex gap-2 items-center border-b-2 transition-border duration-200
                ${editMenuState === "BUILDER" ? "border-title" : "hover:border-muted border-transparent cursor-pointer"}
              `}
              onClick={() => { setEditMenuState("BUILDER") }}
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
                className={`text-muted cursor-pointer hover:text-title ${editMenuState == "BUILDER" ? "" : "opacity-0"} group-hover:opacity-100`}
                onClick={(e) => { 
                  e.stopPropagation();
                  setEditMenuState(prev => {
                    if (prev !== "CLOSED") { setLastMenuState(prev); }
                    return "CLOSED"
                  })
                }}
                icon={faClose}
              ></FontAwesomeIcon>
            </div>
          </div>

          <div className="flex-1 flex bg-background p-2">
            {/* BUILDER MENU CONTENT HERE PLEASE */}
            {editMenuState === "CODE" ? (
              <CodeEditor />
            ) : (
              <BuilderMenu />
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
