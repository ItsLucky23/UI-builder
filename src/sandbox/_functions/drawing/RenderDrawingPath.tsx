import { getStroke } from 'perfect-freehand'
import { getSvgPathFromStroke } from './getSvgPathFromStroke'
import { DrawingPoint } from 'src/sandbox/_providers/DrawingContextProvider'

export const RenderDrawingPath = ({ points, zoom }: { points: DrawingPoint[], zoom: number }) => {
  const stroke = getStroke(points, {
    size: Math.min(20, (12 / zoom)) * (points[0].size / 10),
    thinning: 0,
    smoothing: 0.5,
    streamline: 0.5,
    easing: (t: number) => t,
    last: true,
  })
  const pathData = getSvgPathFromStroke(stroke)
  return <path d={pathData} fill={points[0].color} stroke="none" />
}