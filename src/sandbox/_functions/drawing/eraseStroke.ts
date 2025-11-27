import { DrawingPoint, StrokeData } from "src/sandbox/_providers/DrawingContextProvider";

export const eraseStroke = (
  x: number,
  y: number,
  brushSize: number,
  prevStrokes: StrokeData[]
): StrokeData[] | null => {
  const radius = brushSize / 2;
  const newStrokes: StrokeData[] = [];
  let changed = false;

  for (const stroke of prevStrokes) {
    // optimization: check bounding box first
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of stroke.points) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }

    // expand bounds by radius to be safe
    if (x + radius < minX || x - radius > maxX || y + radius < minY || y - radius > maxY) {
      newStrokes.push(stroke);
      continue;
    }

    // check points
    let currentSegment: DrawingPoint[] = [];
    let strokeModified = false;

    for (const p of stroke.points) {
      const dist = Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2);
      if (dist > radius) {
        currentSegment.push(p);
      } else {
        strokeModified = true;
        changed = true;
        if (currentSegment.length > 1) {
          newStrokes.push({ id: crypto.randomUUID(), points: currentSegment });
        }
        currentSegment = [];
      }
    }

    if (currentSegment.length > 1) {
      // if stroke was not modified at all, keep original id
      newStrokes.push({ id: strokeModified ? crypto.randomUUID() : stroke.id, points: currentSegment });
    } else if (currentSegment.length <= 1 && !strokeModified) {
      // if original stroke was tiny and not touched
      if (stroke.points.length > 1) {
        newStrokes.push(stroke);
      }
    }
  }

  return changed ? newStrokes : null;
}
