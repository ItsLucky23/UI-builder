import { useEditor, EditorContent } from '@tiptap/react'
import { useEffect } from 'react'
import StarterKit from '@tiptap/starter-kit'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { NodeSelection } from '@tiptap/pm/state'
import { getCaretPosition, CaretPosition } from '../../_functions/notes/getCaretPosition'
import { PlaceholderPerLine } from '../../_functions/notes/PlaceholderPerLine'

// Styling
import 'src/NoteEditor.css'


import { handleCaretPositionChange } from 'src/sandbox/_functions/notes/handleCaretPosition'
import { CustomCodeBlock } from './CodeBlockComponent'
import { useNotes } from 'src/sandbox/_providers/NotesContextProvider'
import { NoteOptionsVisibleState } from 'src/sandbox/types/NotesOptionsTypes'


type NoteEditorProps = {
  initialContent?: string | object;
  onUpdate: (content: object) => void;
  isEditable?: boolean;
  onCaretPositionChange?: (position: CaretPosition | null) => void;
}

export default function NoteEditor({ initialContent, onUpdate, isEditable = true, onCaretPositionChange }: NoteEditorProps) {

  const handleCaretPosition = handleCaretPositionChange();

  const {
    setNoteOptionsMenuOpen,
    setNoteOptionsMenuPosition,
    setLastActiveEditor
  } = useNotes();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // implementation is replaced by CustomCodeBlock
      }),
      CustomCodeBlock,
      PlaceholderPerLine,
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-item',
        },
      }),
    ],
    content: initialContent ? (typeof initialContent === 'string' ? JSON.parse(initialContent) : initialContent) : { type: 'doc', content: [] },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onUpdate(json);
    },
    editable: isEditable,
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none p-4 min-h-[150px]',
      },
      handleKeyDown: (view, event) => {
        // Only adjust viewport position for navigation keys, not while typing
        const isNavigationKey = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End', 'Enter', 'Backspace'].includes(event.key);
        if (isNavigationKey) {
          handleCaretPosition(getCaretPosition(editor));
        }

        if (event.key == "/") {
          const { state } = editor;
          const { selection } = state;
          const { $anchor } = selection;
          const currentNode = $anchor.parent;

          if (currentNode.textContent !== "") { return; }

          const caretPos = getCaretPosition(editor);

          // Save editor and cursor position before opening menu
          setLastActiveEditor({
            editor: editor,
            position: selection.anchor
          });

          setNoteOptionsMenuPosition({
            x: caretPos ? caretPos.absoluteX : 0,
            y: caretPos ? caretPos.absoluteY : 0,
          });
          setNoteOptionsMenuOpen(NoteOptionsVisibleState.OPEN);
          return true;
        }

        if (event.key === 'Enter' && !event.shiftKey) {
          const { state } = view;
          const { selection } = state;

          // Check if we have a NodeSelection (block is selected) with a code block
          // This ensures we only focus Monaco when the code block itself is selected,
          // not when the cursor is just adjacent to it
          if (selection instanceof NodeSelection) {
            const node = selection.node;

            if (node && node.type.name === 'codeBlock') {
              // Find the Monaco editor within the selected code block and focus it
              // Use a slight delay to ensure the DOM is ready
              setTimeout(() => {
                const selectedCodeBlock = document.querySelector('.code-block');
                const monacoId = selectedCodeBlock?.getAttribute('data-monaco-id');

                if (monacoId) {
                  const monacoEditor = (window as any).__monacoEditors?.[monacoId];

                  if (monacoEditor) {
                    monacoEditor.focus();
                  }
                }
              }, 50);
              return true; // Prevent default Enter behavior
            }
          }

          // Return false to allow the default Enter behavior to continue
          // Return true to prevent the default behavior
          return false;
        }

        return false;
      }
    },
  })

  if (!editor) { return null }

  return (
    <div
      className="note-editor w-full flex flex-col bg-background text-text"
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-border text-xs overflow-x-auto">
        MAYBE A TITLE OR SOME
      </div>
      <div className="p-4">
        <EditorContent editor={editor} className="prose prose-zinc dark:prose-invert max-w-none focus:outline-none" />
      </div>
    </div>
  )
}