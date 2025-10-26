export type note = {
  id: string;
  // content: string;
  position: { x: number; y: number; };
  // content: 
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