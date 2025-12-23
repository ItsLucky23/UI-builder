// import { useState } from "react";
import { note } from "src/sandbox/types/blueprints";
import { useBlueprints } from "src/sandbox/_providers/BlueprintsContextProvider";
import NoteEditor from "./NoteEditor";

export default function Note({ note }: { note: note }) {
  const { setBlueprints } = useBlueprints();

  const handleUpdate = (newContent: object) => {
    setBlueprints(prev => ({
      ...prev,
      notes: prev.notes.map(n => n.id === note.id ? { ...n, content: JSON.stringify(newContent) } : n)
    }));
  };

  return (
    <div
      className="absolute bg-background border border-border shadow-lg rounded-lg overflow-hidden flex flex-col"
      style={{
        left: note.position.x,
        top: note.position.y,
        minWidth: note.width,
        minHeight: note.height
      }}
      onMouseDown={(e) => {
        // Middle click
        if (e.button === 1) {
          e.preventDefault();
          return;
        }

        e.stopPropagation()
      }}
      onMouseUp={(e) => {
        if (e.button === 1) return;

        e.stopPropagation()
      }}
      onClick={(e) => {
        e.stopPropagation()
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
        <NoteEditor
          initialContent={note.content}
          onUpdate={handleUpdate}
        />
      </div>

    </div>
  )
}
