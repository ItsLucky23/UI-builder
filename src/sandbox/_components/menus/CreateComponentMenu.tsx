import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { CreateComponentMenuState, CreateComponentMenuVisibleState } from "src/sandbox/types/createComponentMenuTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartDiagram, faChartPie, faCode, faFile, faFileText, faNotesMedical, faNoteSticky, faPlus, faTextHeight } from "@fortawesome/free-solid-svg-icons";
import { useMenus } from "src/sandbox/_providers/MenusContextProvider";
import { useBlueprints } from "src/sandbox/_providers/BlueprintsContextProvider";
import { useGrid } from "src/sandbox/_providers/GridContextProvider";
import { getFileExtension, getMimeTypeCategory, readFileAsBase64, readFileAsText, validateFileSize } from "src/sandbox/_functions/files/fileUtils";

const DUMMY_FLOWCHARTS = Array.from({ length: 20 }, (_, i) => ({
  id: `flowchart - ${i} `,
  name: `Flowchart ${i + 1} `,
  description: `Description for flowchart ${i + 1}`
}));

const DUMMY_NOTES = Array.from({ length: 10 }, (_, i) => ({
  id: `note - ${i} `,
  name: `Note ${i + 1} `,
  content: `This is the content for note ${i + 1}`
}));

const DUMMY_COMPONENTS = Array.from({ length: 15 }, (_, i) => ({
  id: `component - ${i} `,
  name: `Component ${i + 1} `,
  description: `Description for component ${i + 1}`
}));

interface SelectionViewProps {
  items: { id: string; name: string }[];
  onCreate: () => void;
  searchPlaceholder: string;
  createLabel: string;
}

function SelectionView({ items, onCreate, searchPlaceholder, createLabel }: SelectionViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full max-h-[310px]">

      <div className="relative border-b border-border p-2">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-background2 p-2 rounded text-sm outline-none focus:ring-1 focus:ring-transparent w-full"
          autoFocus
        />
      </div>

      <div
        className="flex-1 overflow-y-auto flex flex-col gap-1 pr-1 p-2"
      >
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="p-2 hover:bg-background2-hover rounded cursor-pointer text-sm flex items-center gap-2"
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

      <div className="relative p-4 border-t border-border">
        <button
          className="bg-primary hover:bg-primary-hover text-white p-2 rounded text-sm font-medium transition-colors mt-auto flex items-center justify-center gap-2 w-full"
          onClick={onCreate}
        >
          <FontAwesomeIcon icon={faPlus} />
          {createLabel}
        </button>
      </div>

    </div>
  );
}

export default function CreateComponentMenu() {

  const {
    createComponentMenuOpen,
    createComponentMenuPosition,
    setCreateComponentMenuOpen
  } = useMenus();

  const { blueprints, setBlueprints } = useBlueprints();
  const { zoom, offset } = useGrid();

  const [menuState, setMenuState] = useState<CreateComponentMenuState>(CreateComponentMenuState.DEFAULT);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !createComponentMenuPosition) return;

    const file = files[0];

    // Validate file size
    if (!validateFileSize(file, MAX_FILE_SIZE)) {
      alert(`File size exceeds 5MB limit. File size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    try {
      const fileExtension = getFileExtension(file.name);
      const mimeCategory = getMimeTypeCategory(file.type);

      let fileContent: string;

      // Read file based on type
      if (mimeCategory === 'text' || mimeCategory === 'image') {
        if (mimeCategory === 'text') {
          fileContent = await readFileAsText(file);
        } else {
          fileContent = await readFileAsBase64(file);
        }
      } else {
        // Binary files (PDF, ZIP, etc.)
        fileContent = await readFileAsBase64(file);
      }

      // Convert screen coordinates to world coordinates
      const worldX = (createComponentMenuPosition.x - offset.x) / zoom;
      const worldY = (createComponentMenuPosition.y - offset.y) / zoom;

      // Create new file blueprint
      const newFile = {
        id: `file-${Date.now()}`,
        position: { x: worldX, y: worldY },
        fileName: file.name,
        fileType: fileExtension,
        mimeType: file.type,
        fileSize: file.size,
        fileContent,
      };

      // Add to blueprints
      setBlueprints(prev => ({
        ...prev,
        files: [...prev.files, newFile]
      }));

      // Close menu
      setCreateComponentMenuOpen(CreateComponentMenuVisibleState.CLOSED);

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Failed to read file. Please try again.');
    }
  };

  useEffect(() => {
    if (createComponentMenuOpen !== CreateComponentMenuVisibleState.OPEN) { return; }
    setMenuState(CreateComponentMenuState.DEFAULT);
  }, [createComponentMenuOpen])

  if (!createComponentMenuPosition) { return null; }

  return (
    <AnimatePresence>
      {createComponentMenuOpen == CreateComponentMenuVisibleState.OPEN && (
        <motion.div
          initial={{ opacity: 0, scale: 0.90, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.90, y: -5 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "absolute",
            zIndex: 1000,
          }}
        >
          <div
            className="bg-background2 rounded gap-3 flex flex-col w-72 shadow-xl border border-border2 text-text"
            style={{
              position: "absolute",
              left: createComponentMenuPosition.x,
              top: createComponentMenuPosition.y,
              transform: 'translate(20px, calc(-100px + -50%))',
            }}
            id="createComponentMenu"
          >
            {menuState === CreateComponentMenuState.DEFAULT ? (
              <div className="flex flex-col gap-2 p-3">
                <div className="text-xs font-bold text-text2 uppercase tracking-wider px-1">
                  Create
                </div>
                <div
                  className="p-2 hover:bg-background2-hover rounded cursor-pointer"
                  onClick={() => { setMenuState(CreateComponentMenuState.COMPONENTS) }}
                >
                  <FontAwesomeIcon icon={faCode} className="text-muted mr-2" />
                  Component
                </div>
                <div
                  className="p-2 hover:bg-background2-hover rounded cursor-pointer"
                  onClick={() => { setMenuState(CreateComponentMenuState.NOTES) }}
                >
                  <FontAwesomeIcon icon={faFileText} className="text-muted mr-2" />
                  Note
                </div>
                <div
                  className="p-2 hover:bg-background2-hover rounded cursor-pointer"
                  onClick={() => { setMenuState(CreateComponentMenuState.FLOWCHARTS) }}
                >
                  <FontAwesomeIcon icon={faChartDiagram} className="text-muted mr-2" />
                  FlowChart
                </div>
                <div
                  className="p-2 hover:bg-background2-hover rounded cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FontAwesomeIcon icon={faFile} className="text-muted mr-2" />
                  File
                </div>
              </div>
            ) : menuState === CreateComponentMenuState.COMPONENTS ? (
              <SelectionView
                items={DUMMY_COMPONENTS}
                onCreate={() => console.log("Create component")}
                searchPlaceholder="Search components..."
                createLabel="Create New Component"
              />
            ) : menuState === CreateComponentMenuState.FLOWCHARTS ? (
              <SelectionView
                items={DUMMY_FLOWCHARTS}
                onCreate={() => console.log("Create flowchart")}
                searchPlaceholder="Search Flowchart..."
                createLabel="Create New Flowchart"
              />
            ) : menuState === CreateComponentMenuState.NOTES ? (
              <SelectionView
                items={DUMMY_NOTES}
                onCreate={() => console.log("Create note")}
                searchPlaceholder="Search notes..."
                createLabel="Create New Note"
              />
            ) : null}
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}