import { useEffect, useMemo, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import * as monacoEditor from "monaco-editor";
import setCompilerOptions from "../../_functions/codeEditor/compilerOptions";
import loadAutoCompletions from "../../_functions/codeEditor/autoCompletions";
import generateThemes from "../../_functions/codeEditor/themes";
import traverseClickedComponent from "../../_functions/codeEditor/traverseClickedComponent";
import { useCode } from "../../_providers/CodeContextProvider";
import { useBlueprints } from "../../_providers/BlueprintsContextProvider";
import { component, screen } from "../../types/blueprints";

export default function CodeEditor() {
  const monacoInstance = useMonaco();
  const {
    activeCodeWindow,
  } = useCode();
  const [editor, setEditor] = useState<monacoEditor.editor.IStandaloneCodeEditor | null>(null);
  const { blueprints, setBlueprints } = useBlueprints();


  const { code, setCode } = useMemo(() => {
    const bp = (blueprints.screens.find(s => s.id === activeCodeWindow) || blueprints.components.find(c => c.id === activeCodeWindow)) as screen | component;
    if (!bp) {
      return {
        code: "",
        setCode: () => {}
      };
    }

    return { 
      code: bp.code,
      setCode: (newBp: string) => {
        setBlueprints(prev => ({
          ...prev,
          screens: prev.screens.map(s => s.id === activeCodeWindow ? { ...s, code: newBp} as screen : s),
          components: prev.components.map(c => c.id === activeCodeWindow ? { ...c, code: newBp} as component : c)
        }));
      }
    };
  }, [blueprints, setBlueprints, activeCodeWindow]);

  const userComponents = [
    { name: "Dropdown", code: "export function Dropdown() { return <div>...</div> }" },
    { name: "MyButton", code: "export function MyButton() { return <button>Click</button> }" }
  ];

  useEffect(() => {
    if (!monacoInstance) return;

    setCompilerOptions({ monaco: monacoInstance });
    generateThemes({ monaco: monacoInstance });

    const disposeAutoCompletions = loadAutoCompletions({ monaco: monacoInstance });
    
    monacoInstance.editor.setTheme("trae-dark");

    return () => disposeAutoCompletions();
  }, [monacoInstance]);

  useEffect(() => {
    if (!editor) { return; }

    traverseClickedComponent({
      editor,
      userComponents
    });

  }, [editor]);

  return (
    <div className="flex flex-col w-full h-full">
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="typescript"
        path="file:///App.tsx"
        value={code}
        theme="vs-dark"
        onMount={(editor) => { 
          setEditor(editor);
          if (!monacoInstance) { return; }
          
          monacoInstance.editor.setTheme("trae-dark");
        }}
        onChange={(val) => val && setCode(val)}
        options={{
          fontSize: 16,
          minimap: { enabled: true },
          automaticLayout: true,
          autoClosingBrackets: "always",
          tabCompletion: "on",
          "semanticHighlighting.enabled": true,
        }}
      />
    </div>
  );
}
