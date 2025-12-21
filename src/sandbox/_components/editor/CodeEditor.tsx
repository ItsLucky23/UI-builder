import { useMemo } from "react";
// import { useMonaco } from "@monaco-editor/react";
import { useCode } from "../../_providers/CodeContextProvider";
import { useBlueprints } from "../../_providers/BlueprintsContextProvider";
import { component, screen } from "../../types/blueprints";
import BaseCodeEditor from "./BaseCodeEditor";

export default function CodeEditor() {
  const {
    activeCodeWindow,
    setCurrentEditorInstance,
    setCurrentMonacoInstance
  } = useCode();
  const { blueprints, setBlueprints } = useBlueprints();

  const { code, setCode } = useMemo(() => {
    const bp = (blueprints.screens.find(s => s.id === activeCodeWindow) || blueprints.components.find(c => c.id === activeCodeWindow)) as screen | component;
    if (!bp) {
      return {
        code: "",
        setCode: () => { }
      };
    }

    return {
      code: bp.code,
      setCode: (newBp: string) => {
        setBlueprints(prev => ({
          ...prev,
          screens: prev.screens.map(s => s.id === activeCodeWindow ? { ...s, code: newBp } as screen : s),
          components: prev.components.map(c => c.id === activeCodeWindow ? { ...c, code: newBp } as component : c)
        }));
      }
    };
  }, [blueprints, setBlueprints, activeCodeWindow]);

  return (
    <BaseCodeEditor
      value={code}
      onChange={(val) => val && setCode(val)}
      path="file:///App.tsx"
      onMount={(editor, monaco) => {
        setCurrentEditorInstance(editor);
        if (monaco) {
          setCurrentMonacoInstance(monaco);
        }
      }}
    />
  );
}

