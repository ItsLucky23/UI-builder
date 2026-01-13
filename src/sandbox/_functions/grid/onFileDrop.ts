import { useGrid } from "../../_providers/GridContextProvider";
import { useBlueprints } from "../../_providers/BlueprintsContextProvider";
import { useDrawing } from "../../_providers/DrawingContextProvider";
import { getFileExtension, getMimeTypeCategory, getMonacoLanguage, readFileAsBase64, readFileAsText, validateFileSize } from "../files/fileUtils";

export default function useOnFileDrop() {
  const { zoom, offset } = useGrid();
  const { setBlueprints } = useBlueprints();
  const { drawingEnabled } = useDrawing();

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleDragOver = (e: DragEvent) => {
    // Don't allow drag-and-drop when drawing is enabled
    if (drawingEnabled) { return; }

    // Check if dragging files
    if (e.dataTransfer?.types.includes('Files')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDrop = async (e: DragEvent) => {
    // Don't allow drag-and-drop when drawing is enabled
    if (drawingEnabled) {
      console.log('[DROP EVENT] Blocked - drawing is enabled');
      return;
    }

    e.preventDefault();

    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file size
      if (!validateFileSize(file, MAX_FILE_SIZE)) {
        alert(`File "${file.name}" exceeds 5MB limit. File size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        continue;
      }

      try {
        const mimeCategory = getMimeTypeCategory(file.type);
        const extension = getFileExtension(file.name);
        const monacoLanguage = getMonacoLanguage(extension);

        // Check if the file extension is a known text/code type by checking if Monaco recognizes it
        // This handles cases where browsers don't provide proper MIME types for code files (.tsx, .ts, etc.)
        const isKnownTextExtension = monacoLanguage !== 'plaintext' || extension === 'txt';

        let fileContent: string = '';

        // Read file based on type - prioritize extension check for code files
        if (isKnownTextExtension || mimeCategory === 'text') {
          fileContent = await readFileAsText(file);
        } else if (mimeCategory === 'image') {
          fileContent = await readFileAsBase64(file);
        } else {
          // Binary files (PDF, ZIP, etc.)
          fileContent = await readFileAsBase64(file);
        }

        // Convert screen coordinates to world coordinates
        const worldX = (e.clientX - offset.x) / zoom;
        const worldY = (e.clientY - 50 - offset.y) / zoom;

        // Create new file blueprint
        const newFile = {
          id: `file-${Date.now()}-${i}`,
          position: { x: worldX, y: worldY },
          name: file.name,
          code: fileContent,
          size: file.size,
        };

        // Add to blueprints
        setBlueprints(prev => ({
          ...prev,
          files: [...prev.files, newFile]
        }));
      } catch (error) {
        console.error('Error reading file:', error);
        alert(`Failed to read file "${file.name}". Please try again.`);
      }
    }
  };

  return { handleDragOver, handleDrop };
}
