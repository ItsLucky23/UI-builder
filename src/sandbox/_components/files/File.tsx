import { useState } from 'react';
import { useBlueprints } from '../../_providers/BlueprintsContextProvider';
import { file } from '../../types/blueprints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getFileIcon, getMimeTypeCategory, formatFileSize, getMonacoLanguage, getFileExtension } from '../../_functions/files/fileUtils';
import { useBuilderPanel, BuilderMenuMode } from '../../_providers/BuilderPanelContextProvider';
import { useCode } from '../../_providers/CodeContextProvider';
import { isBabelCompatible } from '../../_functions/files/babelUtils';

type FileProps = {
  fileBlueprint: file;
}

export default function File({ fileBlueprint }: FileProps) {
  const { setBlueprints } = useBlueprints();
  const { setBuilderMenuMode, setWindowDividerPosition } = useBuilderPanel();
  const { setCodeWindows, activeCodeWindow, setActiveCodeWindow, codeWindows } = useCode();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(fileBlueprint.name);

  // Derive file properties from name and code
  const fileExtension = getFileExtension(fileBlueprint.name);
  
  // Properly determine MIME type from extension
  const getMimeTypeFromExtension = (ext: string): string => {
    const mimeTypes: Record<string, string> = {
      // Images
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'webp': 'image/webp',
      'bmp': 'image/bmp',
      'ico': 'image/x-icon',
      // Text
      'txt': 'text/plain',
      'md': 'text/markdown',
      'json': 'application/json',
      'xml': 'text/xml',
      'html': 'text/html',
      'css': 'text/css',
      'js': 'text/javascript',
      'jsx': 'text/javascript',
      'ts': 'text/typescript',
      'tsx': 'text/typescript',
      // Other
      'pdf': 'application/pdf',
      'zip': 'application/zip',
    };
    return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
  };
  
  const mimeType = getMimeTypeFromExtension(fileExtension);
  // Use stored size if available, otherwise calculate from code
  const fileSize = fileBlueprint.size ?? (fileBlueprint.code ? new Blob([fileBlueprint.code]).size : 0);
  
  const mimeCategory = getMimeTypeCategory(mimeType);
  const icon = getFileIcon(fileExtension, mimeType);
  const isTextFile = mimeCategory === 'text';
  const isImage = mimeCategory === 'image';

  const handleNameSave = () => {
    if (editedName.trim()) {
      setBlueprints(prev => ({
        ...prev,
        files: prev.files.map(f =>
          f.id === fileBlueprint.id ? {...f, name: editedName.trim()} : f
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
    const language = getMonacoLanguage(fileExtension);

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
          name: fileBlueprint.name,
          code: fileBlueprint.code,
          language: language
        }
      ]
    });

    // Set as active window
    setActiveCodeWindow(fileBlueprint.id);
  };

  const handleDownload = () => {
    const blob = isImage 
      ? new Blob([Uint8Array.from(atob(fileBlueprint.code || ''), c => c.charCodeAt(0))], { type: mimeType })
      : new Blob([fileBlueprint.code || ''], { type: mimeType });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileBlueprint.name || 'download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleToggleViewMode = () => {
    setBlueprints(prev => ({
      ...prev,
      files: prev.files.map(f =>
        f.id === fileBlueprint.id
          ? { ...f, viewMode: f.viewMode === 'rendered' ? 'card' : 'rendered' }
          : f
      )
    }));
  };

  // Check if file is Babel-compatible
  const isFileBabelCompatible = isBabelCompatible(fileBlueprint.name);

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
                    setEditedName(fileBlueprint.name);
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
                {fileBlueprint.name}
              </h3>
            )}
            <p className="text-sm text-muted mt-1">
              {formatFileSize(fileSize)}
            </p>
          </div>
        </div>

        {/* Preview area */}
        {isImage && (
          <div className="mb-3 rounded overflow-hidden border border-border bg-background">
            <img
              src={fileBlueprint.code ? `data:${mimeType};base64,${fileBlueprint.code}` : 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'}
              alt={fileBlueprint.name}
              className="w-full h-auto max-h-48 object-contain"
              onError={(e) => {
                console.error('Image failed to load:', fileBlueprint.name);
                e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><text x="10" y="20" fill="white">Image failed to load</text></svg>';
              }}
            />
          </div>
        )}

        {isTextFile && fileBlueprint.code && (
          <div className="mb-3 p-3 rounded bg-background border border-border">
            <pre className="text-xs text-muted font-mono whitespace-pre-wrap break-words line-clamp-3">
              {fileBlueprint.code.substring(0, 100)}
              {fileBlueprint.code.length > 100 && '...'}
            </pre>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {isFileBabelCompatible && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleViewMode();
              }}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02] font-medium flex items-center justify-center gap-2"
              title={fileBlueprint.viewMode === 'rendered' ? 'Show file card' : 'Show rendered output'}
            >
              <FontAwesomeIcon 
                icon={fileBlueprint.viewMode === 'rendered' ? getFileIcon('file', 'text/plain') : getFileIcon('code', 'text/plain')} 
              />
              {fileBlueprint.viewMode === 'rendered' ? 'Card View' : 'Render'}
            </button>
          )}
          {isTextFile && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewContent();
              }}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-background rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02] font-medium flex items-center justify-center gap-2"
              title="Open in Monaco editor"
            >
              <FontAwesomeIcon icon={getFileIcon('code', 'text/plain')} />
              View/Edit
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02] font-medium"
            title="Download file"
          >
            <FontAwesomeIcon icon={getFileIcon('download', 'text/plain')} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02] font-medium"
            title="Delete file"
          >
            <FontAwesomeIcon icon={getFileIcon('trash', 'text/plain')} />
          </button>
        </div>
      </div>
    </div>
  );
}
