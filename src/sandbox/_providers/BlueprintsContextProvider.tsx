import { createContext, useContext, useState, ReactNode, RefObject, SetStateAction, Dispatch, useRef } from 'react';
import { blueprints, codeContext } from '../types/blueprints';

type BlueprintsContextType = {
  blueprints: blueprints;
  setBlueprints: Dispatch<SetStateAction<blueprints>>;
};

const BlueprintsContext = createContext<BlueprintsContextType | undefined>(undefined);

export const BlueprintsProvider = ({ children }: { children: ReactNode }) => {
   const [blueprints, setBlueprints] = useState<blueprints>({
  components: [],
  screens: [],
  notes: [],
  drawings: [],
   });

  return (
    <BlueprintsContext.Provider value={{ 
      blueprints, 
      setBlueprints,
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