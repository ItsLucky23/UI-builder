import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faFile,
  faFileCode,
  faFileImage,
  faFilePdf,
  faFileZipper,
  faFileLines,
  faFileVideo,
  faFileAudio,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Extract file extension from filename
 */
export function getFileExtension(fileName: string): string {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Categorize MIME type into general categories
 */
export function getMimeTypeCategory(mimeType: string): 'text' | 'image' | 'pdf' | 'video' | 'audio' | 'binary' {
  if (mimeType.startsWith('text/')) return 'text';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';

  // Check for text-based file types that might not have text/ MIME type
  const textExtensions = ['json', 'xml', 'svg', 'js', 'ts', 'jsx', 'tsx', 'css', 'html', 'md', 'txt', 'lua', 'py', 'rb', 'go', 'rs', 'java', 'c', 'cpp', 'h', 'php', 'sh', 'bat', 'yaml', 'yml', 'toml', 'ini', 'conf'];
  if (mimeType.includes('javascript') || mimeType.includes('json') || mimeType.includes('xml')) {
    return 'text';
  }

  return 'binary';
}

/**
 * Map file extension to Monaco editor language
 */
export function getMonacoLanguage(extension: string): string {
  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    json: 'json',
    css: 'css',
    scss: 'scss',
    less: 'less',
    html: 'html',
    xml: 'xml',
    md: 'markdown',
    lua: 'lua',
    py: 'python',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    cs: 'csharp',
    php: 'php',
    sh: 'shell',
    bat: 'bat',
    ps1: 'powershell',
    yaml: 'yaml',
    yml: 'yaml',
    toml: 'toml',
    ini: 'ini',
    sql: 'sql',
    txt: 'plaintext',
  };

  return languageMap[extension.toLowerCase()] || 'plaintext';
}

/**
 * Read file as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Read file as base64
 */
export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Remove the data:*/*;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validate file size (max in bytes)
 */
export function validateFileSize(file: File, maxSizeBytes: number): boolean {
  return file.size <= maxSizeBytes;
}

/**
 * Get FontAwesome icon for file type
 */
export function getFileIcon(extension: string, mimeType: string): IconDefinition {
  const ext = extension.toLowerCase();

  // Code files
  const codeExtensions = ['js', 'jsx', 'ts', 'tsx', 'json', 'xml', 'html', 'css', 'scss', 'less', 'lua', 'py', 'rb', 'go', 'rs', 'java', 'c', 'cpp', 'cs', 'php', 'sh', 'bat'];
  if (codeExtensions.includes(ext)) {
    return faFileCode;
  }

  // Images
  const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'ico'];
  if (imageExtensions.includes(ext) || mimeType.startsWith('image/')) {
    return faFileImage;
  }

  // PDF
  if (ext === 'pdf' || mimeType === 'application/pdf') {
    return faFilePdf;
  }

  // Archives
  const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'];
  if (archiveExtensions.includes(ext)) {
    return faFileZipper;
  }

  // Video
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
  if (videoExtensions.includes(ext) || mimeType.startsWith('video/')) {
    return faFileVideo;
  }

  // Audio
  const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'];
  if (audioExtensions.includes(ext) || mimeType.startsWith('audio/')) {
    return faFileAudio;
  }

  // Text files
  const textExtensions = ['txt', 'md', 'log'];
  if (textExtensions.includes(ext)) {
    return faFileLines;
  }

  // Default
  return faFile;
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
