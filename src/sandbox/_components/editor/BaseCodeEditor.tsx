import { useEffect, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import * as monacoEditor from "monaco-editor";
import setCompilerOptions from "../../_functions/codeEditor/compilerOptions";
import loadAutoCompletions from "../../_functions/codeEditor/autocompletions/autocompletionHandler";
import traverseClickedComponent from "../../_functions/codeEditor/traverseClickedComponent";
import HoverTooltip from "src/sandbox/_functions/codeEditor/hoverTooltip";
import InitTailwindcss from "src/sandbox/_functions/codeEditor/tailwindcss/tailwindcss";
import generateThemes from "src/sandbox/_functions/codeEditor/themes/themes";

type BaseCodeEditorProps = {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  theme?: string;
  options?: monacoEditor.editor.IStandaloneEditorConstructionOptions;
  path?: string;
  onMount?: (editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: typeof monacoEditor) => void;
}

export default function BaseCodeEditor({
  value,
  onChange,
  language = "typescript",
  theme = "vs-dark",
  options,
  path = "file:///App.tsx",
  onMount
}: BaseCodeEditorProps) {
  const monacoInstance = useMonaco();
  const [editor, setEditor] = useState<monacoEditor.editor.IStandaloneCodeEditor | null>(null);

  const userComponents = [
    { name: "Dropdown", code: "export function Dropdown() { return <div>...</div> }" },
    { name: "MyButton", code: "export function MyButton() { return <button>Click</button> }" }
  ];

  useEffect(() => {
    if (!monacoInstance) return;

    setCompilerOptions(monacoInstance);
    generateThemes(monacoInstance);

    monacoInstance.editor.setTheme("trae-dark");

    const disposeAutoCompletions = loadAutoCompletions(monacoInstance);
    return () => {
      disposeAutoCompletions();
    };
  }, [monacoInstance]);

  useEffect(() => {
    if (!editor) { return; }

    HoverTooltip(editor);

    traverseClickedComponent({
      editor,
      userComponents
    });
  }, [editor]);

  useEffect(() => {
    if (!monacoInstance || !editor) { return; }

    const disposTailwind = InitTailwindcss(monacoInstance, editor);
    return () => {
      disposTailwind();
    }
  }, [monacoInstance, editor]);

  const [height, setHeight] = useState<string | number>("100%");

  return (
    <div className="flex flex-col w-full" style={{ height }}>
      <Editor
        height="100%"
        width="100%"
        language={language}
        path={path}
        value={value}
        theme={theme}
        onMount={(editor, monaco) => {
          setEditor(editor);
          if (monaco) {
            monaco.editor.setTheme("trae-dark");
          }
          if (onMount) onMount(editor, monaco);

          if (options?.scrollBeyondLastLine === false) {
            const updateHeight = () => {
              const contentHeight = Math.min(1000, editor.getContentHeight());
              setHeight(contentHeight);
              // editor.layout({ width: 0, height: contentHeight }); // Trigger layout ? no automaticLayout handles it if container resizes?
            };
            editor.onDidContentSizeChange(updateHeight);
            updateHeight(); // Initial size
          }
        }}
        onChange={onChange}
        options={{
          fontSize: 16,
          minimap: { enabled: true },
          automaticLayout: true,
          autoClosingBrackets: "always",
          tabCompletion: "on",
          "semanticHighlighting.enabled": true,
          ...options
        }}
      />
    </div>
  );
}
