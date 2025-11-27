import { createContext, useContext, useState, ReactNode, SetStateAction, Dispatch } from 'react';
import { CreateComponentMenuVisibleState } from '../types/createComponentMenuTypes';

type MenusContextType = {
  createComponentMenuOpen: CreateComponentMenuVisibleState;
  setCreateComponentMenuOpen: Dispatch<SetStateAction<CreateComponentMenuVisibleState>>;

  createComponentMenuPosition: { x: number; y: number } | null;
  setCreateComponentMenuPosition: Dispatch<SetStateAction<{ x: number; y: number } | null>>;
};

const MenusContext = createContext<MenusContextType | undefined>(undefined);

export const MenusProvider = ({ children }: { children: ReactNode }) => {
  const [createComponentMenuOpen, setCreateComponentMenuOpen] = useState<CreateComponentMenuVisibleState>(CreateComponentMenuVisibleState.CLOSED);
  const [createComponentMenuPosition, setCreateComponentMenuPosition] = useState<{ x: number; y: number } | null>(null);

  return (
    <MenusContext.Provider value={{ 
      createComponentMenuOpen, 
      setCreateComponentMenuOpen,

      createComponentMenuPosition, 
      setCreateComponentMenuPosition
    }}>
      {children}
    </MenusContext.Provider>
  );
};

export const useMenus = () => {
  const context = useContext(MenusContext);
  if (!context) {
    throw new Error('useMenus must be used within a MenusProvider');
  }
  return context;
};