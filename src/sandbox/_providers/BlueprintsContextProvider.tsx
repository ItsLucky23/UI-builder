import { createContext, useContext, useState, ReactNode, RefObject, SetStateAction, Dispatch, useRef } from 'react';
import { blueprints, codeContext } from '../types/blueprints';

type BlueprintsContextType = {
  blueprints: blueprints;
  setBlueprints: Dispatch<SetStateAction<blueprints>>;

  instances: blueprints[];
  setInstances: Dispatch<SetStateAction<blueprints[]>>;

  highlightInstances: boolean;
  setHighlightInstances: Dispatch<SetStateAction<boolean>>;
};

const BlueprintsContext = createContext<BlueprintsContextType | undefined>(undefined);

export const BlueprintsProvider = ({ children }: { children: ReactNode }) => {
  const [blueprints, setBlueprints] = useState<blueprints>({
    components: [],
    screens: [],
    notes: [],
    drawings: [],
  }); //? blueprint is a unqiue item
  
  const [instances, setInstances] = useState<blueprints[]>([]); //? instance can contain any blueprint infinite times

  const [highlightInstances, setHighlightInstances] = useState(true); //? the border around a instance that can be toggled in the bottom menu

  return (
    <BlueprintsContext.Provider value={{ 
      blueprints, 
      setBlueprints,

      instances,
      setInstances,

      highlightInstances,
      setHighlightInstances,
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