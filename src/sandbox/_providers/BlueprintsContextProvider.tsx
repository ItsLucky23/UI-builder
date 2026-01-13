import { createContext, useContext, useState, ReactNode, SetStateAction, Dispatch, useEffect, useCallback, useRef } from 'react';
import { blueprints, file, note } from '../types/blueprints';

// History entry only stores which item IDs exist (not content)
type GridHistoryEntry = {
  fileIds: string[];
  noteIds: string[];
};

type BlueprintsContextType = {
  blueprints: blueprints;
  setBlueprints: Dispatch<SetStateAction<blueprints>>;

  instances: blueprints[];
  setInstances: Dispatch<SetStateAction<blueprints[]>>;

  highlightInstances: boolean;
  setHighlightInstances: Dispatch<SetStateAction<boolean>>;

  // Grid history for undo/redo (only tracks which items exist, not content)
  gridHistory: GridHistoryEntry[];
  gridHistoryIndex: number;
  pushGridHistory: (newBlueprints: blueprints) => void;
  undoGridHistory: () => void;
  redoGridHistory: () => void;

  // For backward compatibility
  setGridHistory: Dispatch<SetStateAction<GridHistoryEntry[]>>;
  setGridHistoryIndex: Dispatch<SetStateAction<number>>;
};

const BlueprintsContext = createContext<BlueprintsContextType | undefined>(undefined);

export const BlueprintsProvider = ({ children }: { children: ReactNode }) => {
  // Master store: always contains latest content for all items (even "deleted" ones for redo)
  const allFilesRef = useRef<Map<string, file>>(new Map());
  const allNotesRef = useRef<Map<string, note>>(new Map());

  const [blueprints, setBlueprints] = useState<blueprints>({
    files: [],
    notes: [],
    drawings: [],
  });

  const [instances, setInstances] = useState<blueprints[]>([]);
  const [highlightInstances, setHighlightInstances] = useState(true);

  // History only tracks which IDs are visible (not content)
  const [gridHistory, setGridHistory] = useState<GridHistoryEntry[]>([{ fileIds: [], noteIds: [] }]);
  const [gridHistoryIndex, setGridHistoryIndex] = useState<number>(0);

  // Refs for synchronous access
  const gridHistoryRef = useRef(gridHistory);
  const gridHistoryIndexRef = useRef(gridHistoryIndex);

  useEffect(() => {
    gridHistoryRef.current = gridHistory;
  }, [gridHistory]);

  useEffect(() => {
    gridHistoryIndexRef.current = gridHistoryIndex;
  }, [gridHistoryIndex]);

  // Sync master store whenever blueprints change (captures content edits)
  useEffect(() => {
    blueprints.files.forEach(f => allFilesRef.current.set(f.id, f));
    blueprints.notes.forEach(n => allNotesRef.current.set(n.id, n));
  }, [blueprints]);

  // Push new state to history (only stores IDs)
  const pushGridHistory = useCallback((newBlueprints: blueprints) => {
    const currentIndex = gridHistoryIndexRef.current;
    const newEntry: GridHistoryEntry = {
      fileIds: newBlueprints.files.map(f => f.id),
      noteIds: newBlueprints.notes.map(n => n.id),
    };

    // Update master store with new items
    newBlueprints.files.forEach(f => allFilesRef.current.set(f.id, f));
    newBlueprints.notes.forEach(n => allNotesRef.current.set(n.id, n));

    setGridHistory(prev => [...prev.slice(0, currentIndex + 1), newEntry]);
    setGridHistoryIndex(currentIndex + 1);
    setBlueprints(newBlueprints);
  }, []);

  // Undo: Go back in history
  const undoGridHistory = useCallback(() => {
    const currentIndex = gridHistoryIndexRef.current;
    if (currentIndex <= 0) return;
    setGridHistoryIndex(currentIndex - 1);
  }, []);

  // Redo: Go forward in history
  const redoGridHistory = useCallback(() => {
    const currentIndex = gridHistoryIndexRef.current;
    const history = gridHistoryRef.current;
    if (currentIndex < history.length - 1) {
      setGridHistoryIndex(currentIndex + 1);
    }
  }, []);

  // Rebuild blueprints from history entry using master store (always latest content)
  useEffect(() => {
    if (gridHistory.length > 0 && gridHistoryIndex >= 0 && gridHistoryIndex < gridHistory.length) {
      const entry = gridHistory[gridHistoryIndex];

      // Rebuild blueprints using IDs from history, content from master store
      const files = entry.fileIds
        .map(id => allFilesRef.current.get(id))
        .filter((f): f is file => f !== undefined);

      const notes = entry.noteIds
        .map(id => allNotesRef.current.get(id))
        .filter((n): n is note => n !== undefined);

      setBlueprints({
        files,
        notes,
        drawings: [], // Drawings handled separately
      });
    }
  }, [gridHistoryIndex, gridHistory]);

  // Clamp historyIndex if it exceeds history length
  useEffect(() => {
    if (gridHistoryIndex >= gridHistory.length && gridHistory.length > 0) {
      setGridHistoryIndex(gridHistory.length - 1);
    }
  }, [gridHistoryIndex, gridHistory.length]);

  return (
    <BlueprintsContext.Provider value={{
      blueprints,
      setBlueprints,

      instances,
      setInstances,

      highlightInstances,
      setHighlightInstances,

      gridHistory,
      setGridHistory,
      gridHistoryIndex,
      setGridHistoryIndex,
      pushGridHistory,
      undoGridHistory,
      redoGridHistory,
    }}>
      {children}
    </BlueprintsContext.Provider>
  );
};

export const useBlueprints = () => {
  const context = useContext(BlueprintsContext);
  if (!context) {
    throw new Error('useBlueprints must be used within a BlueprintsProvider');
  }
  return context;
};
