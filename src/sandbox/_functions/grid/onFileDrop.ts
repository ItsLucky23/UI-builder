import { useGrid } from "../../_providers/GridContextProvider";
import { useBlueprints } from "../../_providers/BlueprintsContextProvider";
import { useDrawing } from "../../_providers/DrawingContextProvider";
import { getFileExtension, getMimeTypeCategory, readFileAsBase64, readFileAsText, validateFileSize } from "../files/fileUtils";

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
    console.log('[DROP EVENT] File drop detected!', e);

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
        console.log(`[File Upload] Starting: "${file.name}", Type: "${file.type}", Category: "${mimeCategory}", Size: ${file.size} bytes`);

        let fileContent: string = ''; // Initialize to empty string

        // Read file based on type
        if (mimeCategory === 'text' || mimeCategory === 'image') {
          if (mimeCategory === 'text') {
            console.log('[File Upload] Reading as text...');
            fileContent = await readFileAsText(file);
          } else {
            console.log('[File Upload] Reading as base64 (image)...');
            fileContent = await readFileAsBase64(file);
          }
        } else {
          // Binary files (PDF, ZIP, etc.)
          console.log('[File Upload] Reading as base64 (binary)...');
          fileContent = await readFileAsBase64(file);
        }

        console.log(`[File Upload] Content read successfully. Length: ${fileContent?.length || 0} chars, First 100 chars:`, fileContent?.substring(0, 100));

        // Convert screen coordinates to world coordinates
        const worldX = (e.clientX - offset.x) / zoom;
        const worldY = (e.clientY - offset.y) / zoom;

        // Create new file blueprint
        const newFile = {
          id: `file-${Date.now()}-${i}`,
          position: { x: worldX, y: worldY },
          name: file.name, // Full filename with extension
          code: fileContent, // File content (text or base64)
          size: file.size, // Original file size in bytes
        };

        console.log('[File Upload] Created file blueprint:', newFile);

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
