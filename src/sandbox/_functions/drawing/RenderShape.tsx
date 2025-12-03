import { ShapeData } from "src/sandbox/_providers/DrawingContextProvider"

export const RenderShape = ({ shape, zoom }: { shape: ShapeData, zoom: number }) => {
  const { type, start, end, color, size } = shape
  const strokeWidth = size / zoom

  switch (type) {
    case 'rectangle': {
      const x = Math.min(start.x, end.x)
      const y = Math.min(start.y, end.y)
      const width = Math.abs(end.x - start.x)
      const height = Math.abs(end.y - start.y)

      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
        />
      )
    }

    case 'circle': {
      const cx = (start.x + end.x) / 2
      const cy = (start.y + end.y) / 2
      const rx = Math.abs(end.x - start.x) / 2
      const ry = Math.abs(end.y - start.y) / 2

      return (
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
        />
      )
    }

    case 'line': {
      return (
        <line
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke={color}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
        />
      )
    }
  }
}
