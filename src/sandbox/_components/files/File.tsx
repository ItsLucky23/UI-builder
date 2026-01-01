import { useState } from 'react';
import { useBlueprints } from '../../_providers/BlueprintsContextProvider';
import { file } from '../../types/blueprints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getFileIcon, getMimeTypeCategory, formatFileSize, getMonacoLanguage } from '../../_functions/files/fileUtils';
import { useBuilderPanel, BuilderMenuMode } from '../../_providers/BuilderPanelContextProvider';
import { useCode } from '../../_providers/CodeContextProvider';

type FileProps = {
  fileBlueprint: file;
}

export default function File({ fileBlueprint }: FileProps) {
  const { setBlueprints } = useBlueprints();
  const { setBuilderMenuMode, setWindowDividerPosition } = useBuilderPanel();
  const { setCodeWindows, activeCodeWindow, setActiveCodeWindow, codeWindows } = useCode();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(fileBlueprint.fileName);

  const mimeCategory = getMimeTypeCategory(fileBlueprint.mimeType);
  const icon = getFileIcon(fileBlueprint.fileType, fileBlueprint.mimeType);
  const isTextFile = mimeCategory === 'text';
  const isImage = mimeCategory === 'image';

  const handleNameSave = () => {
    if (editedName.trim()) {
      setBlueprints(prev => ({
        ...prev,
        files: prev.files.map(f =>
          f.id === fileBlueprint.id ? {...f, fileName: editedName.trim()} : f
        )
      }));
    }
    setIsEditingName(false);
  };

  const handleDelete = () => {
    // Remove from blueprints
    setBlueprints(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== fileBlueprint.id)
    }));

    // Remove from code windows if open
    setCodeWindows(prev => prev.filter(cw => cw.id !== fileBlueprint.id));

    // If this file was the active window, switch to another window
    if (activeCodeWindow === fileBlueprint.id) {
      const remainingWindows = codeWindows.filter(cw => cw.id !== fileBlueprint.id);
      if (remainingWindows.length > 0) {
        setActiveCodeWindow(remainingWindows[0].id);
      } else {
        setActiveCodeWindow('');
      }
    }
  };

  const handleViewContent = () => {
    if (!isTextFile) return;

    // Detect language from file extension
    const language = getMonacoLanguage(fileBlueprint.fileType);

    // Open editor panel
    setBuilderMenuMode(BuilderMenuMode.CODE);
    setWindowDividerPosition(prev => prev || 50);

    // Add file to code windows
    setCodeWindows(prev => {
      const exists = prev.find(cw => cw.id === fileBlueprint.id);
      if (exists) {
        return prev;
      }
      return [
        ...prev,
        {
          id: fileBlueprint.id,
          name: fileBlueprint.fileName,
          code: fileBlueprint.fileContent,
          language: language
        }
      ]
    });

    // Set as active window
    setActiveCodeWindow(fileBlueprint.id);
  };

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: fileBlueprint.position.x,
        top: fileBlueprint.position.y,
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-background2 border border-border rounded-lg shadow-lg p-4 w-80">
        {/* Header with icon and name */}
        <div className="flex items-start gap-3 mb-3">
          <div className="text-3xl text-primary mt-1">
            <FontAwesomeIcon icon={icon} />
          </div>
          <div className="flex-1 min-w-0">
            {isEditingName ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameSave();
                  if (e.key === 'Escape') {
                    setEditedName(fileBlueprint.fileName);
                    setIsEditingName(false);
                  }
                  e.stopPropagation();
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-2 py-1 bg-background border border-border rounded text-text focus:outline-none focus:border-primary"
                autoFocus
              />
            ) : (
              <h3
                className="font-semibold text-text truncate cursor-pointer hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingName(true);
                }}
              >
                {fileBlueprint.fileName}
              </h3>
            )}
            <p className="text-sm text-muted mt-1">
              {formatFileSize(fileBlueprint.fileSize)}
            </p>
          </div>
        </div>

        {/* Preview area */}
        {isImage && (
          <div className="mb-3 rounded overflow-hidden border border-border bg-background">
            <img
              src={fileBlueprint.fileContent}
              alt={fileBlueprint.fileName}
              className="w-full h-auto max-h-48 object-contain"
            />
          </div>
        )}

        {isTextFile && (
          <div className="mb-3 p-3 rounded bg-background border border-border">
            <pre className="text-xs text-muted font-mono whitespace-pre-wrap break-words line-clamp-3">
              {fileBlueprint.fileContent.substring(0, 100)}
              {fileBlueprint.fileContent.length > 100 && '...'}
            </pre>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {isTextFile && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewContent();
              }}
              className="flex-1 px-3 py-2 bg-primary hover:bg-primary/80 text-background rounded transition-colors"
              title="Open in Monaco editor"
            >
              <FontAwesomeIcon icon={getFileIcon('code', 'text/plain')} className="mr-2" />
              View/Edit
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
          >
            <FontAwesomeIcon icon={getFileIcon('trash', 'text/plain')} />
          </button>
        </div>
      </div>
    </div>
  );
}
