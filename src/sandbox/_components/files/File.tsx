import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import {file} from "../../types/blueprints";
import {useBlueprints} from "../../_providers/BlueprintsContextProvider";
import {formatFileSize, getFileIcon, getMimeTypeCategory, getMonacoLanguage} from "../../_functions/files/fileUtils";
import {useCode} from "../../_providers/CodeContextProvider";
import {BuilderMenuMode, useBuilderPanel} from "../../_providers/BuilderPanelContextProvider";

interface FileProps {
  file: file;
}

export default function File({ file: fileBlueprint }: FileProps) {
  const {setBlueprints} = useBlueprints();
  const {setCodeWindows, setActiveCodeWindow} = useCode();
  const {setBuilderMenuMode, setWindowDividerPosition, prevBuilderMenuMode} = useBuilderPanel();
  
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
    setBlueprints(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== fileBlueprint.id)
    }));
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
                }}
                className="w-full bg-background border border-border rounded px-2 py-1 text-sm font-medium text-text outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            ) : (
              <div
                className="text-sm font-medium text-text break-words cursor-text hover:bg-background-hover rounded px-2 py-1 -mx-2"
                onClick={() => setIsEditingName(true)}
                title="Click to rename"
              >
                {fileBlueprint.fileName}
              </div>
            )}
            <div className="text-xs text-muted mt-1 px-2">
              {formatFileSize(fileBlueprint.fileSize)} • {fileBlueprint.fileType.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Preview area */}
        <div className="mb-3 bg-background border border-border rounded p-2 min-h-[100px] flex items-center justify-center">
          {isImage ? (
            <img
              src={`data:${fileBlueprint.mimeType};base64,${fileBlueprint.fileContent}`}
              alt={fileBlueprint.fileName}
              className="max-w-full max-h-48 object-contain"
            />
          ) : isTextFile && fileBlueprint.fileContent ? (
            <div className="w-full max-h-32 overflow-hidden">
              <pre className="text-xs text-text2 font-mono whitespace-pre-wrap break-words line-clamp-6">
                {fileBlueprint.fileContent.substring(0, 200)}
                {fileBlueprint.fileContent.length > 200 && '...'}
              </pre>
            </div>
          ) : (
            <div className="text-center">
              <FontAwesomeIcon icon={icon} className="text-4xl text-muted mb-2" />
              <div className="text-xs text-muted">
                {mimeCategory === 'pdf' ? 'PDF Document' : 
                 mimeCategory === 'binary' ? 'Binary File' : 
                 'Preview not available'}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewContent();
            }}
            disabled={!isTextFile}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
              isTextFile
                ? 'bg-primary hover:bg-primary-hover text-white cursor-pointer'
                : 'bg-background text-text2 cursor-not-allowed opacity-50'
            }`}
            title={!isTextFile ? 'Monaco editor integration coming soon' : 'Open in editor'}
          >
            {isTextFile ? 'View/Edit' : 'View Only'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="px-3 py-2 text-sm font-medium rounded bg-wrong hover:bg-wrong-hover text-white transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
