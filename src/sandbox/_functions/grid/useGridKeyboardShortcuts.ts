import { useEffect } from "react";
import { useBlueprints } from "src/sandbox/_providers/BlueprintsContextProvider";
import { useDrawing } from "src/sandbox/_providers/DrawingContextProvider";

/**
 * Grid-level keyboard shortcuts for undo/redo of grid items (files, notes).
 * This is SEPARATE from drawing shortcuts (handled in useKeyboardShortcuts.ts).
 * 
 * Only handles Ctrl+Z/Y when:
 * - Monaco editor is NOT focused
 * - TipTap notes are NOT focused  
 * - CodeMirror blocks are NOT focused
 * - Drawing mode is NOT enabled (drawing has its own shortcuts)
 */
export function useGridKeyboardShortcuts() {
  const {
    undoGridHistory,
    redoGridHistory
  } = useBlueprints();

  const { drawingEnabled } = useDrawing();

  useEffect(() => {
    const isEditorFocused = () => {
      const activeEl = document.activeElement;
      if (!activeEl) return false;

      // Standard text inputs
      const isTyping = activeEl instanceof HTMLTextAreaElement || activeEl instanceof HTMLInputElement;
      // Monaco: inside element with class 'monaco-editor'
      const monacoFocused = !!activeEl.closest('.monaco-editor');
      // TipTap/ProseMirror: has contenteditable="true" inside .tiptap or .ProseMirror
      const tiptapFocused = !!activeEl.closest('.tiptap, .ProseMirror');
      // CodeMirror in notes: inside .cm-editor
      const codemirrorFocused = !!activeEl.closest('.cm-editor');

      return isTyping || monacoFocused || tiptapFocused || codemirrorFocused;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if drawing mode is enabled (drawing has its own shortcuts)
      if (drawingEnabled) return;

      // Skip if any editor is focused
      if (isEditorFocused()) return;

      // Undo: Ctrl+Z (not Shift)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undoGridHistory();
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redoGridHistory();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawingEnabled, undoGridHistory, redoGridHistory]);
}

