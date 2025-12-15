import { useEffect } from "react";
import { useDrawing } from "src/sandbox/_providers/DrawingContextProvider";

export function useKeyboardShortcuts() {
  const {
    setHistoryIndex,
    historyIndex,
    strokeHistory,
    setStrokes,
    selectedStrokeIds,
    setSelectedStrokeIds,
    setStrokeHistory,
    strokes,
    drawingEnabled
  } = useDrawing();

  useEffect(() => {
    if (!drawingEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with text input
      const activeEl = document.activeElement;
      const isTyping = activeEl instanceof HTMLTextAreaElement || activeEl instanceof HTMLInputElement;

      // Undo: Ctrl + Z (only if not typing - let browser handle native undo in text fields)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !isTyping) {
        e.preventDefault();
        setHistoryIndex(prev => {
          const newIndex = Math.max(0, prev - 1);
          return newIndex;
        });
      }

      // Delete: Delete or Backspace (only if not typing)
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isTyping) {
        if (selectedStrokeIds.length > 0) {
          e.preventDefault();
          // Delete selected strokes
          const newStrokes = strokes.filter(s => !selectedStrokeIds.includes(s.id));
          setStrokes(newStrokes);
          setSelectedStrokeIds([]);

          // Add to history
          setStrokeHistory(prev => [...prev.slice(0, historyIndex + 1), newStrokes]);
          setHistoryIndex(prev => prev + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawingEnabled, historyIndex, selectedStrokeIds, strokes, setHistoryIndex, setStrokes, setSelectedStrokeIds, setStrokeHistory]);
}
