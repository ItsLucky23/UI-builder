import { createContext, useContext, useState, ReactNode, RefObject, SetStateAction, Dispatch, useRef } from 'react';

type GridContextType = {
  containerRef: RefObject<HTMLDivElement | null>;
  draggingRef: RefObject<boolean>;
  lastPos: RefObject<{ x: number; y: number }>;
  posMouseDown: RefObject<{ x: number; y: number }>;

  dragging: boolean;
  setDragging: Dispatch<SetStateAction<boolean>>;

  drawingEnabled: boolean;
  setDrawingEnabled: Dispatch<SetStateAction<boolean>>;

  showDrawings: boolean;
  setShowDrawings: Dispatch<SetStateAction<boolean>>;

  zoom: number;
  setZoom: Dispatch<SetStateAction<number>>;

  offset: { x: number; y: number };
  setOffset: Dispatch<SetStateAction<{ x: number; y: number }>>;
};

const GridContext = createContext<GridContextType | undefined>(undefined);

export const GridProvider = ({ children }: { children: ReactNode }) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [drawingEnabled, setDrawingEnabled] = useState(false);
  const [showDrawings, setShowDrawings] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const posMouseDown = useRef({ x: 0, y: 0 });
  
  return (
    <GridContext.Provider value={{ 
      containerRef, 
      draggingRef,
      lastPos,
      posMouseDown,

      dragging,
      setDragging,

      drawingEnabled,
      setDrawingEnabled,

      showDrawings,
      setShowDrawings,

      zoom, 
      setZoom, 
      
      offset, 
      setOffset,
    }}>
      {children}
    </GridContext.Provider>
  );
};

export const useGrid = () => {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error('useGrid must be used within a GridProvider');
  }
  return context;
};