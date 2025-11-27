import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCode } from "src/sandbox/_providers/CodeContextProvider";
import BuilderMenu from "./BuilderMenu";
import CodeEditor from "./CodeEditor";
import { memo, useEffect } from "react";
import { BuilderMenuMode, useBuilderPanel } from "src/sandbox/_providers/BuilderPanelContextProvider";

const Editor = () => {

  const { builderMenuMode, setBuilderMenuMode } = useBuilderPanel();

  const {
    codeWindows,
    setCodeWindows,
    activeCodeWindow,
    setActiveCodeWindow
  } = useCode();

  useEffect(() => {
    if (codeWindows.length === 0) {
      setBuilderMenuMode(BuilderMenuMode.CLOSED);
    }

  }, [builderMenuMode, codeWindows, activeCodeWindow]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* BUILDER MENU CONTENT HERE PLEASE */}
      <div className="w-full py-2 flex">
        {codeWindows.map((cw, index) => (
          <div 
            key={index} 
            className={`
              px-3 py-1 flex gap-3 items-center border-b-2
              ${cw.id == activeCodeWindow ? "bg-container border-primary" : "cursor-pointer bg-container/60 border-transparent"}
            `}
            onClick={() => setActiveCodeWindow(cw.id)}
          >
            <img src="/languages/react.png" alt={cw.name} className="w-4" />
            <h1>{cw.name}.tsx</h1>
            <div className="w-2 h-full flex items-center justify-center">
              {cw.id == activeCodeWindow && (
                <FontAwesomeIcon
                  className="cursor-pointer text-muted"
                  icon={faClose}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCodeWindow(
                      codeWindows[index - 1] ? codeWindows[index - 1].id :
                      codeWindows[index + 1] ? codeWindows[index + 1].id :
                      ""
                    );
                    setCodeWindows(prev => prev.filter(w => w.id !== cw.id))
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="h-full w-full">
        {builderMenuMode === BuilderMenuMode.CODE ? (
          <CodeEditor />
        ) : builderMenuMode === BuilderMenuMode.BUILDER ? (
          <BuilderMenu />
        ) : null}
      </div>
    </div>
  )
}

export default memo(Editor);