import { createContext, useContext, useState, ReactNode, RefObject, SetStateAction, Dispatch, useRef } from 'react';
import { codeContext } from '../types/blueprints';

type CodeContextType = {
  codeWindows: codeContext[];
  setCodeWindows: Dispatch<SetStateAction<codeContext[]>>;

  activeCodeWindow: string | null;
  setActiveCodeWindow: Dispatch<SetStateAction<string | null>>;
};

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export const CodeProvider = ({ children }: { children: ReactNode }) => {
  const [codeWindows, setCodeWindows] = useState<codeContext[]>([]);
  const [activeCodeWindow, setActiveCodeWindow] = useState<string | null>(null);

  return (
    <CodeContext.Provider value={{ 
      codeWindows, 
      setCodeWindows,

      activeCodeWindow,
      setActiveCodeWindow,
    }}>
      {children}
    </CodeContext.Provider>
  );
};

export const useCode = () => {
  const context = useContext(CodeContext);
  if (!context) {
    throw new Error('useCode must be used within a CodeProvider');
  }
  return context;
};