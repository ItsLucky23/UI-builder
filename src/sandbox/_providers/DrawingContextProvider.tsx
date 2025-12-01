import { createContext, useContext, useState, ReactNode, SetStateAction, Dispatch, useEffect } from 'react';

export type DrawingPoint = {
  x: number;
  y: number;
  color: string;
  size: number;
  // pressure: number 
}

export type StrokeData = {
  id: string
  points: DrawingPoint[] // points are stored in WORLD coordinates
}

type DrawingContextType = {
  strokes: StrokeData[];
  setStrokes: Dispatch<SetStateAction<StrokeData[]>>;

  currentPoints: DrawingPoint[];
  setCurrentPoints: Dispatch<SetStateAction<DrawingPoint[]>>;

  brushSize: number;
  setBrushSize: Dispatch<SetStateAction<number>>;

  brushColor: string;
  setBrushColor: Dispatch<SetStateAction<string>>;

  drawingEnabled: boolean;
  setDrawingEnabled: Dispatch<SetStateAction<boolean>>;

  showDrawings: boolean;
  setShowDrawings: Dispatch<SetStateAction<boolean>>;

  erasing: boolean;
  setErasing: Dispatch<SetStateAction<boolean>>;

  strokeHistory: StrokeData[][]
  setStrokeHistory: Dispatch<SetStateAction<StrokeData[][]>>
  historyIndex: number
  setHistoryIndex: Dispatch<SetStateAction<number>>
};

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export const DrawingProvider = ({ children }: { children: ReactNode }) => {
  const [strokes, setStrokes] = useState<StrokeData[]>([])
  const [currentPoints, setCurrentPoints] = useState<DrawingPoint[]>([])
  const [drawingEnabled, setDrawingEnabled] = useState(false);
  const [showDrawings, setShowDrawings] = useState(true);

  const [strokeHistory, setStrokeHistory] = useState<StrokeData[][]>([[]])
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  //? tools in the drawing menu when drawing is enabled
  const [brushSize, setBrushSize] = useState<number>(10)
  const [brushColor, setBrushColor] = useState<string>('#FFFFFF')
  const [erasing, setErasing] = useState<boolean>(false);

  useEffect(() => {
    if (erasing) {
      setBrushSize(Math.min(250, brushSize*5))
    } else {
      setBrushSize(Math.max(10, brushSize/5))
    }
  }, [erasing])

  return (
    <DrawingContext.Provider value={{
      strokes,
      setStrokes,

      currentPoints,
      setCurrentPoints,

      brushSize,
      setBrushSize,

      brushColor,
      setBrushColor,

      drawingEnabled,
      setDrawingEnabled,

      showDrawings,
      setShowDrawings,

      erasing,
      setErasing,

      strokeHistory,
      setStrokeHistory,
      historyIndex,
      setHistoryIndex
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