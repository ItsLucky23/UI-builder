import * as monaco from "monaco-editor";

export default function loadAutoCompletions({
  monaco
}: {
  monaco: typeof import("e:/code/UI-builder/node_modules/monaco-editor/esm/vs/editor/editor.api")
}) {

  const autoCompletions: monaco.IDisposable[] = []

  ///////////
  //? Auto completions for closing JSX tags
  ///////////

  for (const language of ["typescript", "typescriptreact"]) {
    autoCompletions.push(monaco.languages.registerCompletionItemProvider(language, {
      triggerCharacters: [">"],
      provideCompletionItems: (model, position) => {
        const lineContent = model.getLineContent(position.lineNumber);
        const tagEndIndex = lineContent.indexOf(">");
        const trimmedLineContext = lineContent.trim();

        if (trimmedLineContext.startsWith("<") && !trimmedLineContext.startsWith("</") && trimmedLineContext.endsWith(">")) {
          const tagName = trimmedLineContext
            .slice(
              1,
              trimmedLineContext.indexOf(" ") > -1
                ? trimmedLineContext.indexOf(" ")
                : trimmedLineContext.indexOf(">")
            )
            .replace(/\/?>$/, "");

          const insertTextClassname = ` className={`+"`$0`"+`}>\n  \n</${tagName}>`;

          return {
            suggestions: [
              {
                label: `Close with className <${tagName}>`,
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: insertTextClassname,
                range: new monaco.Range(
                  position.lineNumber,
                  tagEndIndex + 1,
                  position.lineNumber,
                  tagEndIndex + 2
                ),
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              },
              {
                label: `Close <${tagName}>`,
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: `$0</${tagName}>`,
                range: new monaco.Range(
                  position.lineNumber,
                  position.column,
                  position.lineNumber,
                  position.column
                ),
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              },
            ],
          };
        }

        return { suggestions: [] };
      },
    }));
  }

  // Clean up on dispose
  return () => {
    // console.log("Disposing auto completions...");
    // console.log(autoCompletions);
    autoCompletions.forEach((disposable) => disposable.dispose());
  };
}