import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { Tldraw, Editor, DefaultSizeStyle, TldrawEditor, TldrawUi, TldrawUiTooltipProps, TLUiOverrides } from 'tldraw'
import 'tldraw/tldraw.css'
import { useGrid } from '../../_providers/GridContextProvider'
import { useDrawing } from 'src/sandbox/_providers/DrawingContextProvider'
import { partialErase } from '../../_functions/drawing/partialErase'

const CAMERA_OPTIONS = { wheelBehavior: 'none', panSpeed: 0, zoomSpeed: 0 } as const

export default function DrawingLayer() {
  const { setEditor, drawingEnabled, showDrawings, partialEraser } = useDrawing()
  const { zoom, offset, setZoom, setOffset } = useGrid()

  const [mount, setMount] = useState(false)
  const [ready, setReady] = useState(false)
  const editorRef = useRef<Editor | null>(null)

  // Refs for stable callbacks
  const offsetRef = useRef(offset)
  const zoomRef = useRef(zoom)

  // Keep refs in sync
  useEffect(() => {
    offsetRef.current = offset
    zoomRef.current = zoom
  }, [offset, zoom])

  // Delay mount to ensure client-side rendering if needed
  useEffect(() => {
    setMount(true)
  }, [])

  const handleMount = useCallback((editor: Editor) => {
    setEditor(editor)
    editorRef.current = editor

    // Initial camera sync
    // We divide by zoom because tldraw applies its own zoom scale to the coordinates
    // Grid: translate(offset) scale(zoom)
    // Tldraw: scale(zoom) translate(camera)
    // To match: camera = -offset / zoom
    editor.setCamera({
      x: -offsetRef.current.x,
      y: -offsetRef.current.y,
      z: zoomRef.current
    })

    // Configure editor
    editor.updateInstanceState({ isReadonly: false })

    // Prevent flash
    setTimeout(() => setReady(true), 100)
  }, [setEditor])

  // Sync camera when grid changes
  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    let rafId: number

    const updateCamera = () => {
      editor.setCamera({
        x: -offset.x / zoom,
        y: -offset.y / zoom,
        z: zoom
      })
    }

    rafId = requestAnimationFrame(updateCamera)

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [offset, zoom])

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!partialEraser || !editorRef.current) return

    if (e.buttons === 1) {
      const point = editorRef.current.screenToPage({ x: e.clientX, y: e.clientY })

      // Get current size style
      const size = editorRef.current.getStyleForNextShape(DefaultSizeStyle)
      let radius = 10
      switch (size) {
        case 's': radius = 5; break;
        case 'm': radius = 10; break;
        case 'l': radius = 20; break;
        case 'xl': radius = 40; break;
      }

      partialErase(editorRef.current, point, radius / editorRef.current.getZoomLevel())
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    // Exact logic from onMouseWheel.ts
    // We must stop propagation so the grid's listener doesn't fire too (double event)
    // But since the grid listener is on the container, and we are ON TOP of the container,
    // we are the primary handler.

    // Note: onMouseWheel.ts uses native WheelEvent, React uses React.WheelEvent
    // The logic is identical.

    const zoomLevels = [
      0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45,
      0.5, 0.625, 0.75, 0.875, 1, 1.125, 1.25, 1.375,
      1.5, 1.75, 2, 2.5, 3, 3.5, 4, 4.5, 5
    ];
    const minZoom = zoomLevels[0];
    const maxZoom = zoomLevels[zoomLevels.length - 1];

    const usingMouseWheel = Math.abs(e.deltaY) > 50;

    let newZoom;
    if (usingMouseWheel) {
      const closestIndex = zoomLevels.reduce((closestIdx, level, idx) => {
        const currentDiff = Math.abs(level - zoom);
        const closestDiff = Math.abs(zoomLevels[closestIdx] - zoom);
        return currentDiff < closestDiff ? idx : closestIdx;
      }, 0);

      let newIndex = closestIndex;
      if (e.deltaY < 0) {
        newIndex = Math.min(zoomLevels.length - 1, closestIndex + 1);
      } else {
        newIndex = Math.max(0, closestIndex - 1);
      }
      newZoom = zoomLevels[newIndex];

    } else {
      const zooming = e.ctrlKey;
      if (zooming) {
        const divider = zoom < 1 ? 70 : zoom < 3 ? 30 : 10;
        const additional = Math.abs(e.deltaY) / divider;
        if (e.deltaY < 0) {
          newZoom = Math.min(maxZoom, zoom + additional);
        } else {
          newZoom = Math.max(minZoom, zoom - additional);
        }
      } else {
        const speed = 1;
        setOffset(prev => ({
          x: prev.x - e.deltaX / zoom * speed,
          y: prev.y - e.deltaY / zoom * speed,
        }));
        return;
      }
    }

    if (!newZoom) return;

    const mx = e.clientX;
    const my = e.clientY;

    setOffset(prev => ({
      x: mx - ((mx - prev.x) / zoom) * newZoom,
      y: my - ((my - prev.y) / zoom) * newZoom,
    }));

    setZoom(newZoom);
  }

  const tldrawComponent = useMemo(() => {

    const overrides: TLUiOverrides = {
      tools(editor, tools, helpers) {
        return {
          ...tools,
          // draw: { ...tools.draw, isHidden: true},
        }
      },

      actions(editor, actions, helpers) {
        return {
          ...actions,
          // "file.new": { ...actions["file.new"], isHidden: true },
          // "file.open": { ...actions["file.open"], isHidden: true },
          // undo: { ...actions.undo, isHidden: true },
          // redo: { ...actions.redo, isHidden: true },
          // copy: { ...actions.copy, isHidden: true },
          // paste: { ...actions.paste, isHidden: true },
          // cut: { ...actions.cut, isHidden: true },
          // clearSelection: { ...actions.clearSelection, isHidden: true },
        }
      }
    }

    // <Tldraw
    //   hideUi={true}
    //   onMount={handleMount}
    //   cameraOptions={CAMERA_OPTIONS}
    //   className='border-none'
    // />
    return (
      <TldrawEditor
        onMount={handleMount}
      >
        <TldrawUi 
          // overrides={overrides}
        />
      </TldrawEditor>
    )
  }, [handleMount])

  if (!mount) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: drawingEnabled ? 'all' : 'none',
        zIndex: 10,
        visibility: showDrawings ? 'visible' : 'hidden',
        cursor: partialEraser ? 'crosshair' : 'auto',
        opacity: ready ? 1 : 0,
        transition: 'opacity 0.2s ease-in-out'
      }}
      className="tldraw-wrapper"
      onPointerMove={handlePointerMove}
      onWheel={handleWheel}
    >
      <style>{`
        .tl-background {
          background-color: transparent !important;
        }
      `}</style>
      <div
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: partialEraser ? 'none' : 'all'
        }}
      >
        {tldrawComponent}
      </div>
    </div>
  )
}
