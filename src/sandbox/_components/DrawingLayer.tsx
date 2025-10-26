import React, { useRef, useState } from 'react'
import { getStroke } from 'perfect-freehand'
import { getSvgPathFromStroke } from '../_functions/drawing/getSvgPathFromStroke'
import { useGrid } from '../_providers/GridContextProvider'

type Point = { x: number; y: number; pressure: number }

type StrokeData = {
  id: string
  points: Point[] // points are stored in WORLD coordinates
}

export default function DrawingLayer({
  view,
}: {
  view: { position: { x: number; y: number } }
}) {
  const [strokes, setStrokes] = useState<StrokeData[]>([])
  const [currentPoints, setCurrentPoints] = useState<Point[]>([])
  const { zoom, offset } = useGrid()
  const overlayRef = useRef<SVGSVGElement | null>(null)
  const worldSvgRef = useRef<SVGSVGElement | null>(null)

  // Convert client (mouse) coords to world coords (matching your transformed content)
  const clientToWorld = (clientX: number, clientY: number) => {
    const rect = overlayRef.current!.getBoundingClientRect()
    const screenX = clientX - rect.left
    const screenY = clientY - rect.top
    // offset is applied as translate(px) before scaling, so subtract it then divide by zoom
    return {
      x: (screenX - offset.x) / zoom,
      y: (screenY - offset.y) / zoom,
    }
  }

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    // capture pointer so we keep receiving move/up
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch {}
    const { x, y } = clientToWorld(e.clientX, e.clientY)
    setCurrentPoints([{ x, y, pressure: e.pressure ?? 1 }])
  }

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.buttons !== 1) return
    const { x, y } = clientToWorld(e.clientX, e.clientY)
    setCurrentPoints(prev => {
      // avoid adding duplicate points in rapid events
      const last = prev[prev.length - 1]
      if (!last || last.x !== x || last.y !== y) {
        return [...prev, { x, y, pressure: e.pressure ?? 1 }]
      }
      return prev
    })
  }

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch {}
    if (currentPoints.length === 0) return
    setStrokes(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        points: currentPoints,
      },
    ])
    setCurrentPoints([])
  }

  const renderPath = (points: Point[]) => {
    // perfect-freehand expects points in the same coordinate space you'll render them in.
    // We're rendering inside the transformed (world) SVG, so points are world coords.
    // If you want the stroke visual thickness to stay constant on screen,
    // divide size by zoom. If you want stroke size to scale with zoom, remove / zoom.
    const stroke = getStroke(points, {
      size: 4 / zoom, // keep screen-consistent thickness
      thinning: 0.5,
      smoothing: 0.8,
      streamline: 0.3,
      easing: t => t,
    })
    const pathData = getSvgPathFromStroke(stroke)
    return <path d={pathData} fill="black" stroke="none" />
  }

  return (
    <>
      {/* Transformed world div - render all strokes here so they follow translate/scale */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          pointerEvents: 'none', // rendering layer shouldn't capture events
        }}
        className="h-full w-full"
      >
        <svg
          ref={worldSvgRef}
          width="100%"
          height="100%"
          style={{ overflow: 'visible', pointerEvents: 'none' }}
        >
          {strokes.map(s => (
            <g key={s.id}>{renderPath(s.points)}</g>
          ))}
          {/* Render live stroke inside world SVG so it aligns with final strokes */}
          {currentPoints.length > 0 && <g>{renderPath(currentPoints)}</g>}
        </svg>
      </div>

      {/* Overlay SVG (untransformed) — captures pointer input */}
      <svg
        ref={overlayRef}
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          overflow: 'visible',
          pointerEvents: 'auto',
          touchAction: 'none', // improves pointer/stylus responsiveness
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Optional: visualize where you're drawing in raw screen space (debug). 
            We don't draw currentPoints here because they are world coords;
            drawing happens inside the transformed SVG. */}
      </svg>
    </>
  )
}
