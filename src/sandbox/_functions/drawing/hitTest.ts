import { StrokeData, ShapeData } from "src/sandbox/_providers/DrawingContextProvider"

/**
 * Check if a point is near a stroke path
 */
export function hitTestStroke(
  point: { x: number; y: number },
  stroke: StrokeData,
  threshold: number = 10
): boolean {
  // Check each line segment in the stroke
  for (let i = 0; i < stroke.points.length - 1; i++) {
    const p1 = stroke.points[i]
    const p2 = stroke.points[i + 1]

    const distance = pointToLineSegmentDistance(point, p1, p2)
    if (distance <= threshold + (p1.size / 2)) {
      return true
    }
  }

  return false
}

/**
 * Check if a point is inside a shape
 */
export function hitTestShape(
  point: { x: number; y: number },
  shape: ShapeData,
  threshold: number = 10
): boolean {
  const { type, start, end, size } = shape

  switch (type) {
    case 'rectangle': {
      const minX = Math.min(start.x, end.x) - threshold
      const maxX = Math.max(start.x, end.x) + threshold
      const minY = Math.min(start.y, end.y) - threshold
      const maxY = Math.max(start.y, end.y) + threshold

      return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY
    }

    case 'circle': {
      const cx = (start.x + end.x) / 2
      const cy = (start.y + end.y) / 2
      const rx = Math.abs(end.x - start.x) / 2 + threshold
      const ry = Math.abs(end.y - start.y) / 2 + threshold

      // Ellipse equation: (x-cx)²/rx² + (y-cy)²/ry² <= 1
      const normalized = Math.pow((point.x - cx) / rx, 2) + Math.pow((point.y - cy) / ry, 2)
      return normalized <= 1
    }

    case 'line': {
      const distance = pointToLineSegmentDistance(point, start, end)
      return distance <= threshold + (size / 2)
    }
  }
}

/**
 * Calculate distance from a point to a line segment
 */
function pointToLineSegmentDistance(
  point: { x: number; y: number },
  lineStart: { x: number; y: number },
  lineEnd: { x: number; y: number }
): number {
  const dx = lineEnd.x - lineStart.x
  const dy = lineEnd.y - lineStart.y

  if (dx === 0 && dy === 0) {
    // Line segment is just a point
    return Math.sqrt(
      Math.pow(point.x - lineStart.x, 2) + Math.pow(point.y - lineStart.y, 2)
    )
  }

  // Calculate parameter t that determines the closest point on the line segment
  const t = Math.max(0, Math.min(1,
    ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (dx * dx + dy * dy)
  ))

  // Calculate closest point on the line segment
  const closestX = lineStart.x + t * dx
  const closestY = lineStart.y + t * dy

  // Return distance to closest point
  return Math.sqrt(
    Math.pow(point.x - closestX, 2) + Math.pow(point.y - closestY, 2)
  )
}
