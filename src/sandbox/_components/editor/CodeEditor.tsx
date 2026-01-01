import { useMemo } from "react";
// import { useMonaco } from "@monaco-editor/react";
import { useCode } from "../../_providers/CodeContextProvider";
import { useBlueprints } from "../../_providers/BlueprintsContextProvider";
import { component, screen, file } from "../../types/blueprints";
import BaseCodeEditor from "./BaseCodeEditor";

export default function CodeEditor() {
  const {
    activeCodeWindow,
    codeWindows,
    setCurrentEditorInstance,
    setCurrentMonacoInstance
  } = useCode();
  const { blueprints, setBlueprints } = useBlueprints();

  const { code, setCode, language } = useMemo(() => {
    // First, get the language from the code window (where we stored it)
    const activeWindow = codeWindows.find(cw => cw.id === activeCodeWindow);
    const windowLanguage = activeWindow?.language;

    // Check screens, components, and files
    const screen = blueprints.screens.find(s => s.id === activeCodeWindow);
    const component = blueprints.components.find(c => c.id === activeCodeWindow);
    const fileItem = blueprints.files?.find(f => f.id === activeCodeWindow);

    const bp = screen || component || fileItem;

    if (!bp) {
      return {
        code: "",
        setCode: () => { },
        language: "typescript"
      };
    }

    // Determine language - prioritize code window language, then default to typescript
    const lang = windowLanguage || "typescript";

    // Get code content
    const codeContent = 'code' in bp ? bp.code : (bp as file).fileContent;

    return {
      code: codeContent,
      setCode: (newCode: string) => {
        setBlueprints(prev => ({
          ...prev,
          screens: prev.screens.map(s => s.id === activeCodeWindow ? { ...s, code: newCode } as screen : s),
          components: prev.components.map(c => c.id === activeCodeWindow ? { ...c, code: newCode } as component : c),
          files: prev.files?.map(f => f.id === activeCodeWindow ? { ...f, fileContent: newCode } : f) || prev.files
        }));
      },
      language: lang
    };
  }, [blueprints, setBlueprints, activeCodeWindow, codeWindows]);

  return (
    <BaseCodeEditor
      value={code}
      onChange={(val) => val && setCode(val)}
      path={`file:///App.${language === 'typescript' ? 'tsx' : language}`}
      language={language}
      onMount={(editor, monaco) => {
        setCurrentEditorInstance(editor);
        if (monaco) {
          setCurrentMonacoInstance(monaco);
        }
      }}
    />
  );
}

