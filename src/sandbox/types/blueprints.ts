export type note = {
  id: string;
  position: { x: number; y: number; };
  content: string; // JSON content from TipTap
  width: number;
  height: number;
}

export type drawing = {
  id: string;
  // strokes: number[][][];
  position: { x: number; y: number; };
  // strokes: number[][][];
}

export type codeContext = {
  id: string;
  name: string;
  code: string;
  language?: string; // Optional language for Monaco editor (e.g., 'javascript', 'python', 'lua')
}

export type component = codeContext & {
  position?: { x: number; y: number; };
}

export type screen = codeContext & {
  position: { x: number; y: number; };
}

export type file = {
  id: string;
  position: { x: number; y: number; };
  fileName: string;
  fileType: string; // file extension (e.g., 'js', 'png', 'pdf')
  mimeType: string; // MIME type (e.g., 'image/png', 'application/pdf')
  fileSize: number; // size in bytes
  fileContent: string; // base64 for binary files, plain text for text files
}

export type blueprints = {
  components: component[];
  screens: screen[];
  notes: note[];
  drawings: drawing[];
  files: file[];
}  