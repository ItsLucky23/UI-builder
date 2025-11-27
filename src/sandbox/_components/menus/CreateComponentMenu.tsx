import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { CreateComponentMenuState, CreateComponentMenuVisibleState } from "src/sandbox/types/createComponentMenuTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCode, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useMenus } from "src/sandbox/_providers/MenusContextProvider";

const DUMMY_SCREENS = Array.from({ length: 20 }, (_, i) => ({
  id: `screen-${i}`,
  name: `Screen ${i + 1}`,
  description: `Description for screen ${i + 1}`
}));

const DUMMY_NOTES = Array.from({ length: 10 }, (_, i) => ({
  id: `note-${i}`,
  name: `Note ${i + 1}`,
  content: `This is the content for note ${i + 1}`
}));

const DUMMY_COMPONENTS = Array.from({ length: 15 }, (_, i) => ({
  id: `component-${i}`,
  name: `Component ${i + 1}`,
  description: `Description for component ${i + 1}`
}));

interface SelectionViewProps {
  title: string;
  items: { id: string; name: string }[];
  onBack: () => void;
  onCreate: () => void;
  searchPlaceholder: string;
  createLabel: string;
}

function SelectionView({ title, items, onBack, onCreate, searchPlaceholder, createLabel }: SelectionViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-3 h-full max-h-[300px]">
      <div className="flex items-center gap-2 border-b border-common pb-2">
        <button onClick={onBack} className="text-sm flex items-center gap-1 cursor-pointer">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <span className="font-medium ml-2">{title}</span>
      </div>

      <div className="relative">
        <FontAwesomeIcon icon={faSearch} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-container3 pl-8 p-2 rounded text-sm outline-none focus:ring-1 focus:ring-primary w-full"
          autoFocus
        />
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-1 pr-1 custom-scrollbar">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="p-2 hover:bg-container3 rounded cursor-pointer text-sm flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faCode} className="text-muted" />
            {item.name}
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="text-white/50 text-sm text-center py-4">
            No items found
          </div>
        )}
      </div>

      <button
        className="bg-primary hover:bg-primary-hover text-white p-2 rounded text-sm font-medium transition-colors mt-auto flex items-center justify-center gap-2"
        onClick={onCreate}
      >
        <FontAwesomeIcon icon={faPlus} />
        {createLabel}
      </button>
    </div>
  );
}

export default function CreateComponentMenu() {

  const { createComponentMenuOpen, createComponentMenuPosition } = useMenus();

  const [menuState, setMenuState] = useState<CreateComponentMenuState>(CreateComponentMenuState.DEFAULT);

  const handleBack = () => {
    setMenuState(CreateComponentMenuState.DEFAULT);
  };

  useEffect(()=> {
    if (createComponentMenuOpen !== CreateComponentMenuVisibleState.OPEN) { return; }
    setMenuState(CreateComponentMenuState.DEFAULT);
  }, [createComponentMenuOpen])

  if (!createComponentMenuPosition) { return null; }

  return (
    <AnimatePresence>
      {createComponentMenuOpen == CreateComponentMenuVisibleState.OPEN && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "absolute",
            zIndex: 1000,
          }}
        >
          <div
            className="bg-container2 rounded p-4 gap-4 flex flex-col w-72 shadow-xl border border-container2-border"
            style={{
              position: "absolute",
              left: createComponentMenuPosition.x,
              top: createComponentMenuPosition.y,
              transform: 'translate(20px, calc(-100px + -50%))',
            }}
            id="createComponentMenu"
          >
            {menuState === CreateComponentMenuState.DEFAULT ? (
              <div className="flex flex-col gap-2">
                <div className="text-xs font-bold text-muted uppercase tracking-wider mb-1 px-1">
                  Create
                </div>
                <div 
                  className="p-2 hover:bg-container3 rounded cursor-pointer"
                  onClick={() => { setMenuState(CreateComponentMenuState.COMPONENTS) }}
                >
                  Component
                </div>
                <div 
                  className="p-2 hover:bg-container3 rounded cursor-pointer"
                  onClick={() => { setMenuState(CreateComponentMenuState.SCREENS) }}
                >
                  Screen
                </div>
                <div 
                  className="p-2 hover:bg-container3 rounded cursor-pointer"
                  onClick={() => { setMenuState(CreateComponentMenuState.NOTES) }}
                >
                  Note
                </div>
              </div>
            ) : menuState === CreateComponentMenuState.COMPONENTS ? (
              <SelectionView
                title="Select Component"
                items={DUMMY_COMPONENTS}
                onBack={handleBack}
                onCreate={() => console.log("Create component")}
                searchPlaceholder="Search components..."
                createLabel="Create New Component"
              />
            ) : menuState === CreateComponentMenuState.SCREENS ? (
              <SelectionView
                title="Select Screen"
                items={DUMMY_SCREENS}
                onBack={handleBack}
                onCreate={() => console.log("Create screen")}
                searchPlaceholder="Search screens..."
                createLabel="Create New Screen"
              />
            ) : menuState === CreateComponentMenuState.NOTES ? (
              <SelectionView
                title="Select Note"
                items={DUMMY_NOTES}
                onBack={handleBack}
                onCreate={() => console.log("Create note")}
                searchPlaceholder="Search notes..."
                createLabel="Create New Note"
              />
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}