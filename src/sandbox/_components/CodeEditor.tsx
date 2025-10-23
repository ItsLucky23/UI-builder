import React, { useEffect, useRef, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

// pull in raw type strings

import setCompilerOptions from "../_functions/codeEditor/compilerOptions";
import loadAutoCompletions from "../_functions/codeEditor/autoCompletions";
import generateThemes from "../_functions/codeEditor/themes";
import traverseClickedComponent from "../_functions/codeEditor/traverseClickedComponent";

export default function CodeEditor() {
  // const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monaco = useMonaco();
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [value, setValue] = useState(
`import React, { useState } from "react";
import * as components from "components";

export default function App() {
  const [count, setCount] = useState(0);
  const stirn = "asd"
  return (
    <div className={"bg-blue-500 text-lg"}>
      <Dropdown/>
    </div>
  )
}`
  );

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
    <Editor
      height="100%"
      defaultLanguage="typescript"
      path="file:///App.tsx"
      value={value}
      theme="vs-dark"
      onMount={(editor) => { 
        setEditor(editor);
        console.log('ksksks ', editor)
        if (!monaco) { return; }

        monaco.editor.setTheme("trae-dark");
      }}
      onChange={(val) => val && setValue(val)}
      options={{
        fontSize: 16,
        minimap: { enabled: true },
        automaticLayout: true,
        autoClosingBrackets: "always",
        tabCompletion: "on",
        "semanticHighlighting.enabled": true,
      }}
    />
  );
}
