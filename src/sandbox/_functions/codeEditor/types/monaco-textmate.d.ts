// declare module "monaco-textmate" {
//   import type { Registry } from "vscode-textmate";
//   import type * as monaco from "monaco-editor";

//   // ? This is the helper exported by NeekSandhu’s version
//   export function wireTmGrammars(
//     monacoInstance: typeof monaco,
//     registry: Registry,
//     grammars: Map<string, string>,
//     editor: monaco.editor.IStandaloneCodeEditor
//   ): Promise<void>;
// }
// This file acts as a bridge so Vite can resolve the GitHub-installed monaco-textmate package.
// It directly re-exports the compiled JavaScript bundle inside node_modules.

// export * from "monaco-textmate/dist/monaco-textmate.js";
declare module "monaco-textmate/dist/monaco-textmate.js" {
  import type * as monaco from "monaco-editor";
  import type { Registry } from "vscode-textmate";

  export function wireTmGrammars(
    monacoInstance: typeof monaco,
    registry: Registry,
    grammars: Map<string, string>,
    editor: monaco.editor.IStandaloneCodeEditor
  ): Promise<void>;
}
