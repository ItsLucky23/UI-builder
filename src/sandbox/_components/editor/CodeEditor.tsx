import { useEffect, useMemo, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import setCompilerOptions from "../../_functions/codeEditor/compilerOptions";
import loadAutoCompletions from "../../_functions/codeEditor/autoCompletions";
import generateThemes from "../../_functions/codeEditor/themes";
import traverseClickedComponent from "../../_functions/codeEditor/traverseClickedComponent";
import { useCode } from "../../_providers/CodeContextProvider";
import { useBlueprints } from "../../_providers/BlueprintsContextProvider";
import { component, screen } from "../../types/blueprints";
import { configureMonacoTailwindcss, tailwindcssData } from 'monaco-tailwindcss'

(window as any).MonacoEnvironment = {
  getWorker(_: any, label: any) {
    console.log(label)
    switch (label) {
      case 'tailwindcss':
        const resp = new Worker(
          new URL('monaco-tailwindcss/tailwindcss.worker', import.meta.url),
          { type: 'module' }
        )
        console.log(resp)
        return resp;
      case 'javascript':
      case 'typescript':
        return new Worker(
          new URL('monaco-editor/esm/vs/language/typescript/ts.worker', import.meta.url),
          { type: 'module' }
        );
      default:
        return new Worker(
          new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url),
          { type: 'module' }
        );
    }
  }
};

export default function CodeEditor() {
  const monacoInstance = useMonaco();
  const {
    activeCodeWindow,
  } = useCode();
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
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

  monaco.languages.css.cssDefaults.setOptions({
    data: {
      dataProviders: {
        tailwindcssData
      }
    }
  })

  useEffect(() => {
    if (!monacoInstance) { return; }

    generateThemes({ monaco: monacoInstance });
    setCompilerOptions({ monaco: monacoInstance });
    const disposeAutoCompletions = loadAutoCompletions({ monaco: monacoInstance })

    monacoInstance.editor.setTheme("trae-dark");

    configureMonacoTailwindcss(monacoInstance, {
      tailwindConfig: {},
      languageSelector: [
        "html",
        "css",
        "javascript",
        "typescript",
        "javascriptreact",
        "typescriptreact"
      ]
    });

    return () => {
      disposeAutoCompletions();
    };

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
        defaultLanguage="typescriptreact"
        path="file:///App.tsx"
        value={code}
        theme="vs-dark"
        onMount={(editor) => { 
          setEditor(editor);
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
