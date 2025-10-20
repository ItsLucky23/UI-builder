import { createContext, useContext, useState, ReactNode, RefObject, SetStateAction, Dispatch, useRef } from 'react';

type MenuStatesContextType = {
  createComponentMenuOpen: boolean;
  setCreateComponentMenuOpen: Dispatch<SetStateAction<boolean>>;

  mousePositionCreateComponentMenu: { x: number; y: number } | null;
  setMousePositionCreateComponentMenu: Dispatch<SetStateAction<{ x: number; y: number } | null>>;

  editMenuState: "CODE" | "BUILDER" | "CLOSED";
  setEditMenuState: Dispatch<SetStateAction<"CODE" | "BUILDER" | "CLOSED">>;

  lastMenuState: "CODE" | "BUILDER";
  setLastMenuState: Dispatch<SetStateAction<"CODE" | "BUILDER">>;

  windowDividerDragging: RefObject<boolean>;

  windowDivider: boolean;
  setWindowDivider: Dispatch<SetStateAction<boolean>>;

  windowDividerPosition: number | null;
  setWindowDividerPosition: Dispatch<SetStateAction<number | null>>;

  lastPositionWindowDivider: RefObject<number>;
  // mousePositionWindowDivider: { x: number; y: number } | null;
  // setMousePositionWindowDivider: Dispatch<SetStateAction<{ x: number; y: number } | null>>;

  // lastMousePositionWindowDivider: { x: number; y: number } | null;
  // setLastMousePositionWindowDivider: Dispatch<SetStateAction<{ x: number; y: number } | null>>;
};

const MenuStatesContext = createContext<MenuStatesContextType | undefined>(undefined);

export const MenuStatesProvider = ({ children }: { children: ReactNode }) => {
  const [createComponentMenuOpen, setCreateComponentMenuOpen] = useState(false);
  const [mousePositionCreateComponentMenu, setMousePositionCreateComponentMenu] = useState<{ x: number; y: number } | null>(null);

  const [editMenuState, setEditMenuState] = useState<"CODE" | "BUILDER" | "CLOSED">("CLOSED");
  const [lastMenuState, setLastMenuState] = useState<"CODE" | "BUILDER">("BUILDER");

  const windowDividerDragging: RefObject<boolean> = useRef(false);
  const [windowDivider, setWindowDivider] = useState<boolean>(false);
  const [windowDividerPosition, setWindowDividerPosition] = useState<number | null>(null);
  const lastPositionWindowDivider = useRef<number>(0);
  // const [mousePositionWindowDivider, setMousePositionWindowDivider] = useState<{ x: number; y: number } | null>(null);
  // const [lastMousePositionWindowDivider, setLastMousePositionWindowDivider] = useState<{ x: number; y: number } | null>(null); //? used when divider hits the min/max positions we store last position so when going back with mouse we start moving again when at the position again

  return (
    <MenuStatesContext.Provider value={{ 
      createComponentMenuOpen, 
      setCreateComponentMenuOpen,

      mousePositionCreateComponentMenu,
      setMousePositionCreateComponentMenu,

      editMenuState,
      setEditMenuState,

      lastMenuState,
      setLastMenuState,
      
      windowDividerPosition,
      setWindowDividerPosition,

      windowDividerDragging,
      
      windowDivider,
      setWindowDivider,

      lastPositionWindowDivider,
      // mousePositionWindowDivider,
      // setMousePositionWindowDivider,

      // lastMousePositionWindowDivider,
      // setLastMousePositionWindowDivider,
    }}>
      {children}
    </MenuStatesContext.Provider>
  );
};

export const useMenuStates = () => {
  const context = useContext(MenuStatesContext);
  if (!context) {
    throw new Error('useMenuState must be used within a MenuStateProvider');
  }
  return context;
};