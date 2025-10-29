import { useGrid } from "../_providers/GridContextProvider"

export default function DrawingMenu({

}: {

}) {

  const { drawingEnabled } = useGrid();

  if (!drawingEnabled) { return null }

  return (
    <div className="bg-container2 p-2 left-4 top-1/2 -translate-y-1/2 absolute rounded grid grid-cols-2 gap-2 z-50 border border-container3-border">
      <div className="aspect-square w-10 bg-blue-500 rounded-full"></div>
      <div className="aspect-square w-10 bg-blue-500 rounded-full"></div>
      <div className="aspect-square w-10 bg-blue-500 rounded-full"></div>
      <div className="aspect-square w-10 bg-blue-500 rounded-full"></div>
      <div className="aspect-square w-10 bg-blue-500 rounded-full"></div>
    </div>
  )
}