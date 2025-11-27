import React, { useRef, useState, useCallback, useEffect } from 'react'
import { useGrid } from '../../_providers/GridContextProvider'
import { useDrawing } from 'src/sandbox/_providers/DrawingContextProvider'
import { eraseStroke } from '../../_functions/drawing/eraseStroke'
import { clientToWorld } from '../../_functions/drawing/clientToWorld'
import { RenderDrawingPath } from '../../_functions/drawing/RenderDrawingPath'

export default function DrawingLayer() {

  const {
    strokes,
    setStrokes,

    currentPoints,
    setCurrentPoints,

    drawingEnabled,
    showDrawings,

    brushSize,
    erasing,
    brushColor,

    strokeHistory,
    setStrokeHistory,
    historyIndex,
    setHistoryIndex

  } = useDrawing();

  const {
    zoom,
    offset,
  } = useGrid();

  // sync strokes from history when index changes
  useEffect(() => {
    setStrokes(strokeHistory[historyIndex] || [])
    setCurrentPoints([])
  }, [historyIndex, strokeHistory, setStrokes, setCurrentPoints])

  const overlayRef = useRef<SVGSVGElement | null>(null)
  const worldSvgRef = useRef<SVGSVGElement | null>(null)
  const [eraserPos, setEraserPos] = useState<{ x: number, y: number } | null>(null)

  const handlePointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!drawingEnabled) { return }

    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { }
    const { x, y } = clientToWorld(e.clientX, e.clientY, overlayRef.current, offset, zoom)

    if (erasing) {
      if (e.buttons === 1) {
        const newStrokes = eraseStroke(x, y, brushSize, strokes)
        if (newStrokes) setStrokes(newStrokes)
      }
      return
    }

    if (e.buttons !== 1) { return }

    setCurrentPoints([{ x, y, color: brushColor, size: brushSize }])
  }, [drawingEnabled, erasing, offset, zoom, brushColor, brushSize, strokes, setStrokes, setCurrentPoints])

  const handlePointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!drawingEnabled) { return }

    const { x, y } = clientToWorld(e.clientX, e.clientY, overlayRef.current, offset, zoom)

    if (erasing) {
      setEraserPos({ x, y })
      if (e.buttons === 1) {
        const newStrokes = eraseStroke(x, y, brushSize, strokes)
        if (newStrokes) setStrokes(newStrokes)
      }
      return
    }

    if (e.buttons !== 1) { return }

    setCurrentPoints(prev => {
      const last = prev[prev.length - 1]

      if (last) {
        const dist = Math.sqrt(Math.pow(last.x - x, 2) + Math.pow(last.y - y, 2))
        if (dist < 2 / zoom) return prev
      }

      if (!last || last.x !== x || last.y !== y) {
        return [...prev, { x, y, color: brushColor, size: brushSize }]
      }
      return prev
    })
  }, [drawingEnabled, erasing, offset, zoom, brushColor, brushSize, strokes, setStrokes, setCurrentPoints])

  const handlePointerUp = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!drawingEnabled) { return }

    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { }

    if (erasing) {
      // commit erased state to history
      setStrokeHistory(prev => {
        const base = prev.slice(0, historyIndex + 1)
        return [...base, strokes]
      })
      setHistoryIndex(prev => prev + 1)
      return
    }

    if (currentPoints.length > 1) {
      setStrokeHistory(prev => {
        const base = prev.slice(0, historyIndex + 1)
        const currentSnapshot = prev[historyIndex] || []
        const newSnapshot = [...currentSnapshot, {
          id: crypto.randomUUID(),
          points: currentPoints,
        }]
        return [...base, newSnapshot]
      });
      setHistoryIndex(prev => prev + 1)
      return;
    }
    setCurrentPoints([])
  }, [drawingEnabled, erasing, strokes, currentPoints, historyIndex, setStrokeHistory, setHistoryIndex, setCurrentPoints])

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          pointerEvents: 'none', // rendering layer shouldnt capture events
        }}
        className={`h-full w-full`}
      >
        {showDrawings && (
          <svg
            ref={worldSvgRef}
            width="100%"
            height="100%"
            style={{ overflow: 'visible', pointerEvents: 'none' }}
          >
            {strokes.map(s => (
              <g key={s.id}><RenderDrawingPath points={s.points} zoom={zoom} /></g>
            ))}
            {/* render live stroke inside world svg so it aligns with final strokes */}
            {currentPoints.length > 1 && <g><RenderDrawingPath points={currentPoints} zoom={zoom} /></g>}

            {/* eraser cursor */}
            {erasing && eraserPos && (
              <circle
                cx={eraserPos.x}
                cy={eraserPos.y}
                r={brushSize / 2}
                fill="none"
                stroke="white"
                strokeDasharray="4 4"
                strokeWidth={1 / zoom}
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>
        )}
      </div>

      <svg
        ref={overlayRef}
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          overflow: 'visible',
        }}
        className={`${drawingEnabled ? (erasing ? 'cursor-none' : '') : 'pointer-events-none'}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => setEraserPos(null)}
      >
      </svg>
    </>
  )
}
