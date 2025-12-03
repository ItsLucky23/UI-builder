import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useCallback } from 'react';
import { Editor } from 'tldraw';

type DrawingContextType = {
  editor: Editor | null;
  setEditor: Dispatch<SetStateAction<Editor | null>>;

  drawingEnabled: boolean;
  setDrawingEnabled: Dispatch<SetStateAction<boolean>>;

  showDrawings: boolean;
  setShowDrawings: Dispatch<SetStateAction<boolean>>;

  partialEraser: boolean;
  setPartialEraser: Dispatch<SetStateAction<boolean>>;

  // Helper methods to expose to UI
  setTool: (tool: string) => void;
  undo: () => void;
  redo: () => void;
  deleteSelected: () => void;
};

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export const DrawingProvider = ({ children }: { children: ReactNode }) => {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [drawingEnabled, setDrawingEnabled] = useState(false);
  const [showDrawings, setShowDrawings] = useState(true);
  const [partialEraser, setPartialEraser] = useState(false);

  const setTool = useCallback((tool: string) => {
    if (!editor) return;
    editor.setCurrentTool(tool);
    // Disable partial eraser if switching tools (unless tool is 'select' and we want to keep it?)
    // Usually switching tool implies exiting partial erase.
    setPartialEraser(false);
  }, [editor]);

  const undo = useCallback(() => {
    editor?.undo();
  }, [editor]);

  const redo = useCallback(() => {
    editor?.redo();
  }, [editor]);

  const deleteSelected = useCallback(() => {
    if (!editor) return;
    const selectedIds = editor.getSelectedShapeIds();
    editor.deleteShapes(selectedIds);
  }, [editor]);

  return (
    <DrawingContext.Provider value={{
      editor,
      setEditor,
      drawingEnabled,
      setDrawingEnabled,
      showDrawings,
      setShowDrawings,
      partialEraser,
      setPartialEraser,
      setTool,
      undo,
      redo,
      deleteSelected,
    }}>
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawing = () => {
  const context = useContext(DrawingContext);
  if (!context) {
    throw new Error('useDrawing must be used within a DrawingProvider');
  }
  return context;
};