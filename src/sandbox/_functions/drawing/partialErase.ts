import { Editor, TLShape, TLDrawShape } from 'tldraw'

export const partialErase = (editor: Editor, point: { x: number, y: number }, radius: number) => {
  const shapes = editor.getCurrentPageShapes()

  // Filter shapes close to point
  const candidates = shapes.filter(shape => {
    // Simple bounding box check
    const bounds = editor.getShapePageBounds(shape.id)
    if (!bounds) return false

    // Check if eraser fully covers the shape (Fix for "last point" issue)
    if (
      bounds.x >= point.x - radius &&
      bounds.x + bounds.w <= point.x + radius &&
      bounds.y >= point.y - radius &&
      bounds.y + bounds.h <= point.y + radius
    ) {
      editor.deleteShape(shape.id)
      return false // Handled
    }

    return (
      point.x >= bounds.x - radius &&
      point.x <= bounds.x + bounds.w + radius &&
      point.y >= bounds.y - radius &&
      point.y <= bounds.y + bounds.h + radius
    )
  })

  candidates.forEach(shape => {
    if (shape.type === 'draw') {
      processDrawShape(editor, shape as TLDrawShape, point, radius)
    } else if (shape.type === 'geo') {
      const drawShape = convertGeoToDraw(editor, shape)
      if (drawShape) {
        editor.deleteShape(shape.id)
        editor.createShape(drawShape)
        processDrawShape(editor, drawShape as TLDrawShape, point, radius)
      }
    }
  })
}

const processDrawShape = (editor: Editor, shape: TLDrawShape, center: { x: number, y: number }, radius: number) => {
  const shapeTransform = editor.getShapePageTransform(shape.id)
  if (!shapeTransform) return

  const localCenter = shapeTransform.clone().invert().applyToPoint(center)
  // Approximate scale
  const decomposition = shapeTransform.decompose()
  const scale = decomposition.scaleX
  const localRadius = radius / scale

  let changed = false
  const newSegments: { points: { x: number, y: number }[] }[] = []
  let currentSegment: { x: number, y: number }[] = []

  const allPoints = shape.props.segments.flatMap(s => s.points)

  for (const p of allPoints) {
    const dx = p.x - localCenter.x
    const dy = p.y - localCenter.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist <= localRadius) {
      changed = true
      if (currentSegment.length > 0) {
        newSegments.push({ points: currentSegment })
        currentSegment = []
      }
    } else {
      currentSegment.push(p)
    }
  }

  if (currentSegment.length > 0) {
    newSegments.push({ points: currentSegment })
  }

  if (changed) {
    if (newSegments.length === 0) {
      editor.deleteShape(shape.id)
    } else {
      editor.deleteShape(shape.id)

      newSegments.forEach(segment => {
        // If segment has too few points, it might be invisible or glitchy.
        // But if it's the result of a cut, we should try to keep it unless it's empty.
        if (segment.points.length < 2) return

        editor.createShape({
          type: 'draw',
          x: shape.x,
          y: shape.y,
          props: {
            ...shape.props,
            segments: [{ type: 'free', points: segment.points }],
            isComplete: true
          }
        })
      })
    }
  }
}

const convertGeoToDraw = (_editor: Editor, shape: TLShape) => {
  const w = (shape.props as any).w
  const h = (shape.props as any).h

  if (!w || !h) return null

  const points: { x: number, y: number }[] = []
  const step = 2; // Higher granularity (was 5 or implicit)

  if ((shape.props as any).geo === 'ellipse') {
    // Circumference approx
    const circumference = Math.PI * (w + h);
    const steps = Math.max(50, Math.ceil(circumference / step));

    for (let i = 0; i <= steps; i++) {
      const angle = (i / steps) * Math.PI * 2
      // Ellipse parametric equation relative to center (w/2, h/2)
      // But draw shape points are relative to (0,0) of the shape? 
      // Yes, tldraw shapes usually have origin at top-left.
      points.push({
        x: w / 2 + (w / 2) * Math.cos(angle),
        y: h / 2 + (h / 2) * Math.sin(angle)
      })
    }
  } else {
    // Rectangle
    // Top edge
    for (let i = 0; i <= w; i += step) points.push({ x: i, y: 0 })
    // Right edge
    for (let i = 0; i <= h; i += step) points.push({ x: w, y: i })
    // Bottom edge
    for (let i = w; i >= 0; i -= step) points.push({ x: i, y: h })
    // Left edge
    for (let i = h; i >= 0; i -= step) points.push({ x: 0, y: i })
    // Close loop explicitly
    points.push({ x: 0, y: 0 })
  }

  return {
    type: 'draw',
    x: shape.x,
    y: shape.y,
    rotation: shape.rotation,
    props: {
      segments: [{ type: 'free', points }],
      color: (shape.props as any).color,
      size: (shape.props as any).size,
      isComplete: true,
      isClosed: false, // Draw shapes are usually open unless filled, but 'isClosed' property might not exist on draw shape props in the same way
      fill: (shape.props as any).fill,
    }
  }
}
