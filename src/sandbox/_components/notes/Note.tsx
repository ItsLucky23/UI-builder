// import { useState } from "react";
import { note } from "src/sandbox/types/blueprints";
import { useBlueprints } from "src/sandbox/_providers/BlueprintsContextProvider";
import NoteEditor from "./NoteEditor";
import { useGrid } from "src/sandbox/_providers/GridContextProvider";
import { CaretPosition } from "./utils/getCaretPosition";

export default function Note({ note }: { note: note }) {
  const { setBlueprints } = useBlueprints();
  const {
    setOffset
  } = useGrid();
  // const [isResizing, setIsResizing] = useState(false);

  const handleUpdate = (newContent: object) => {
    // console.log("Updating note", note.id, newContent);
    setBlueprints(prev => ({
      ...prev,
      notes: prev.notes.map(n => n.id === note.id ? { ...n, content: JSON.stringify(newContent) } : n)
    }));
  };

  // Drag and drop logic will be handled by the Grid typically, 
  // but if we need local drag handles we can add them here.
  // For now, let's assume the Grid wrapper handles the position, 
  // or we render it absolutely based on position.

  // The Grid usually iterates components and renders them absolute.
  // Let's check Grid.tsx next to see how it handles position. 
  // For now this component is just the inner content of the note card.

  // NOTE: Simple resize handle implementation
  const handleResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simple resizing implementation or just use a library if available.
    // For now we will rely on fixed/auto size or just the editor's scroll.
    // The blueprint has width/height.

    // We can implement a simple drag on the corner.
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = note.width;
    const startHeight = note.height;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(200, startWidth + (moveEvent.clientX - startX));
      const newHeight = Math.max(150, startHeight + (moveEvent.clientY - startY));

      setBlueprints(prev => ({
        ...prev,
        notes: prev.notes.map(n => n.id === note.id ? { ...n, width: newWidth, height: newHeight } : n)
      }));
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleCaretPositionChange = (position: CaretPosition | null) => {
    console.log("Caret position:", position);
    if (!position) { return; }
    if (!position.viewportPercentage) { return }

    setOffset(prev => {
      // console.log(prev);
      if (position.viewportPercentage > 75) {
        prev.y -= 36
      } else if (position.viewportPercentage < 25) {
        prev.y += 36
      }
      return prev;
    })
  };

  return (
    <div
      // className="absolute bg-background border border-border shadow-lg rounded-lg overflow-hidden flex flex-col"
      className="absolute bg-background border border-border shadow-lg rounded-lg overflow-hidden flex flex-col"
      style={{
        left: note.position.x,
        top: note.position.y,
        minWidth: note.width,
        minHeight: note.height
        // width: '370px',
        // height: '3000px',
      }}
      onMouseDown={(e) => {
        // Middle click
        if (e.button === 1) return;

        e.stopPropagation()
        e.preventDefault();
      }}
      onMouseUp={(e) => {
        if (e.button === 1) return;

        e.stopPropagation()
        e.preventDefault();
      }}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault();
      }}
      draggable={false}
    >
      {/* Header / Drag Handle */}
      {/* <div className="h-4 bg-muted cursor-move flex items-center justify-center group">
        <div 
          className="w-8 h-1 bg-border rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        ></div>
      </div> */}

      <div className="flex-1 overflow-hidden relative">
        {/* <div className="flex-1 relative"> */}
        <NoteEditor
          initialContent={note.content}
          onUpdate={handleUpdate}
          onCaretPositionChange={handleCaretPositionChange}
        />
      </div>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize hover:bg-muted"
        onMouseDown={handleResize}
      >
        <svg viewBox="0 0 24 24" className="w-full h-full text-muted-foreground opacity-50">
          <path fill="currentColor" d="M22 22H0l22-22v22z" fillOpacity={0} /> {/* Invisible click area? */}
          <path fill="currentColor" d="M22 22v-6l-6 6h6z" />
        </svg>
      </div>
    </div>
  )
}
