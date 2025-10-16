import { createContext, useContext, useState, ReactNode, RefObject, SetStateAction, Dispatch, useRef } from 'react';

type GridContextType = {
  containerRef: RefObject<HTMLDivElement | null>;
  dragging: RefObject<boolean>;
  lastPos: RefObject<{ x: number; y: number }>;

  zoom: number;
  setZoom: Dispatch<SetStateAction<number>>;

  offset: { x: number; y: number };
  setOffset: Dispatch<SetStateAction<{ x: number; y: number }>>;
};

const GridContext = createContext<GridContextType | undefined>(undefined);

export const GridProvider = ({ children }: { children: ReactNode }) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  
  return (
    <GridContext.Provider value={{ 
      containerRef, 
      dragging,
      lastPos,

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