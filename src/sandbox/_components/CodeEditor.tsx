import React, { useEffect, useMemo, useRef, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

// pull in raw type strings

import setCompilerOptions from "../_functions/codeEditor/compilerOptions";
import loadAutoCompletions from "../_functions/codeEditor/autoCompletions";
import generateThemes from "../_functions/codeEditor/themes";
import traverseClickedComponent from "../_functions/codeEditor/traverseClickedComponent";
import { useCode } from "../_providers/CodeContextProvider";
import { useBlueprints } from "../_providers/BlueprintsContextProvider";
import { component, screen } from "../types/blueprints";

export default function CodeEditor() {
  // const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monaco = useMonaco();
  const {
    codeWindows,
    setCodeWindows,
    activeCodeWindow,
    setActiveCodeWindow
  } = useCode();
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { blueprints, setBlueprints } = useBlueprints();
  const { code, setCode } = useMemo(() => {
    const bp = (blueprints.screens.find(s => s.id === activeCodeWindow) ||
               blueprints.components.find(c => c.id === activeCodeWindow)) as screen | component;
    return { 
      code: bp.code,
      setCode: (newBp: string) => {
        setBlueprints(prev => ({
          // ...prev,
          // screens: prev.screens.map(s => s.id === newBp.id ? newBp : s),
          // components: prev.components.map(c => c.id === newBp.id ? newBp : c)
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
    console.log(monaco);
    if (!monaco) { return; }

    generateThemes({ monaco });
    setCompilerOptions({ monaco });
    const disposeAutoCompletions = loadAutoCompletions({ monaco });
    monaco.editor.setTheme("trae-dark");

    return () => {
      disposeAutoCompletions();
    };

  }, [monaco]);

  useEffect(() => {
    if (!editor) { return; }

    traverseClickedComponent({
      editor,
      userComponents
    });

  }, [editor]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full py-2 flex">
        {codeWindows.map((cw, index) => (
          <div 
            key={index} 
            className={`
              px-6 py-1 border border-gray-600 bg-container
              ${cw.id == activeCodeWindow ? "border-b-0 bg-background font-medium" : "cursor-pointer hover:bg-muted"}
            `}
          >
            {cw.name}
          </div>
        ))}
        {/* <div className="px-6 py-1 border border-gray-600 bg-container">item1.tsx</div>
        <div className="px-6 py-1 border border-gray-600">item2item2.tsx</div>
        <div className="px-6 py-1 border border-gray-600">item312.tsx</div> */}
      </div>
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="typescript"
        path="file:///App.tsx"
        value={code}
        theme="vs-dark"
        onMount={(editor) => { 
          setEditor(editor);
          console.log('ksksks ', editor)
          if (!monaco) { return; }
  
          monaco.editor.setTheme("trae-dark");
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
