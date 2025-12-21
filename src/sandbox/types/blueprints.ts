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
}

export type component = codeContext & {
  position?: { x: number; y: number; };
}

export type screen = codeContext & {
  position: { x: number; y: number; };
}

export type blueprints = {
  components: component[];
  screens: screen[];
  notes: note[];
  drawings: drawing[];
}  