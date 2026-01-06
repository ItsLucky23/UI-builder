import { file } from "src/sandbox/types/blueprints";
import { ScreenRenderer } from "../grid/ScreenRenderer";
import { useCode } from "src/sandbox/_providers/CodeContextProvider";
import { useBlueprints } from "src/sandbox/_providers/BlueprintsContextProvider";
import { useBuilderPanel } from "src/sandbox/_providers/BuilderPanelContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faCaretDown, faFile, faFileFragment, faLaptop } from "@fortawesome/free-solid-svg-icons";

export default function Render({
  file,
}: {
  file: file;
}) {

  const {
    setCodeWindows,
    activeCodeWindow,
    setActiveCodeWindow
  } = useCode();

  const {
    setBlueprints,
    highlightInstances
  } = useBlueprints();

  const { 
    prevBuilderMenuMode, 
    setBuilderMenuMode, 
    setWindowDividerPosition 
  } = useBuilderPanel();

  return (
    <div
      key={file.id}
      style={{
        position: 'absolute',
        left: file.position.x,
        top: file.position.y,
      }}
    >
      <ScreenRenderer
        id={file.id}
        name={file.name}
        code={file.code}
        style={{
          width: file.viewport?.width || 800,
          height: file.viewport?.height || 600,
        }}
        className={`
          VIEW overflow-hidden text-text
          ${highlightInstances ? "outline-4 rounded-3xl" : "pointer-events-auto"}
          ${highlightInstances && file.id != activeCodeWindow ? "outline-border hover:outline-border2 cursor-pointer" : ""}
          ${highlightInstances && file.id == activeCodeWindow ? "outline-border2" : ""}
        `}
        onClick={() => {
          setBuilderMenuMode(prevBuilderMenuMode);
          setWindowDividerPosition(prev => prev || 50);
          setCodeWindows(prev => {
            const exists = prev.find(cw => cw.id === file.id);
            if (exists) {
              return prev;
            }
            return [
              ...prev,
              {
                id: file.id,
                name: file.name,
                code: file.code
              }
            ]
          })
          setActiveCodeWindow(file.id);
        }}
      />

      <div 
        className="bg-background2 border h-10 border-border2/50 text-text text-sm absolute top-0 left-0 -translate-y-[200%] p-2 rounded-xl flex gap-2"
      >
        {/* <div className="">Laptop</div>
        <div className="">Tablet</div>
        <div className="">Phone</div>
        <div className="">No viewport</div> */}
        <div className="flex gap-2 items-center">
          <FontAwesomeIcon icon={faLaptop} />
          <h3>Change viewport</h3>
          <FontAwesomeIcon icon={faCaretDown} />
        </div>
        <div className="w-[1px] h-full bg-border2"></div>
        <div className="flex gap-2 items-center">
          <FontAwesomeIcon icon={faFile} />
          <h3>Unrender file</h3>
        </div>
      </div>

      
      {/* <button
        onClick={(e) => {
          e.stopPropagation();
          setBlueprints(prev => ({
            ...prev,
            files: prev.files.map(f =>
              f.id === file.id
                ? { 
                    ...f, 
                    viewMode: 'card' as const,
                    viewport: f.viewport ? { ...f.viewport, enabled: false } : undefined
                  }
                : f
            )
          }));
        }}
        className="absolute -top-14 left-0 px-5 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 border-2 border-slate-500 hover:border-slate-400 text-white rounded-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-medium flex items-center gap-2 pointer-events-auto"
        title="Switch to card view"
      >
        <span>⬅️</span>
        Back to Card
      </button> */}
    </div>
  )
}