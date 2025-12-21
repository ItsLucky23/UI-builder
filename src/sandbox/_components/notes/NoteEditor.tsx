import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import CodeBlockComponent from './extensions/CodeBlockComponent'
import CodeBlock from '@tiptap/extension-code-block'
import { getCaretPosition, CaretPosition } from './utils/getCaretPosition'

// Styling
import './NoteEditor.css'

// Custom CodeBlock extension to use our React component
const CustomCodeBlock = CodeBlock.extend({
  addAttributes() {
    return {
      language: {
        default: 'typescript',
      },
      code: {
        default: '',
      }
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent)
  },
})

type NoteEditorProps = {
  initialContent?: string | object;
  onUpdate: (content: object) => void;
  isEditable?: boolean;
  onCaretPositionChange?: (position: CaretPosition | null) => void;
}

export default function NoteEditor({ initialContent, onUpdate, isEditable = true, onCaretPositionChange }: NoteEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // implementation is replaced by CustomCodeBlock
      }),
      // Table.configure({
      //   resizable: true,
      // }),
      // TableRow,
      // TableHeader,
      // TableCell,
      CustomCodeBlock,
    ],
    content: initialContent ? (typeof initialContent === 'string' ? JSON.parse(initialContent) : initialContent) : { type: 'doc', content: [] },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onUpdate(json);

      // Track caret position if callback is provided
      // if (onCaretPositionChange) {
      //   const position = getCaretPosition(editor);
      //   onCaretPositionChange(position);
      // }
    },
    onSelectionUpdate: ({ editor }) => {
      // Also track on selection changes (cursor movement)
      if (onCaretPositionChange) {
        const position = getCaretPosition(editor);
        onCaretPositionChange(position);
      }
    },
    editable: isEditable,
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none p-4 min-h-[150px]',
      },
      handleKeyDown: (view, event) => {
        // Run code before Enter creates a new line
        if (event.key === 'Enter' && !event.shiftKey) {
          // Your code here - this runs BEFORE the new line is created
          console.log('About to create a new line!');

          // Get current caret position before the enter
          if (onCaretPositionChange) {
            const position = getCaretPosition(editor);
            onCaretPositionChange(position);
            // Do something with the position before the change
          }

          // Return false to allow the default Enter behavior to continue
          // Return true to prevent the default behavior
          return false;
        }

        return false; // Not handled, let other handlers process it
      }

      // handleKeyDown: (view, event) => {
      //   // Handle ESC to exit table
      //   if (event.key === 'Escape') {
      //     const { state } = view
      //     const { selection } = state
      //     const { $from } = selection

      //     // Check if we're in a table
      //     for (let depth = $from.depth; depth > 0; depth--) {
      //       if ($from.node(depth).type.name === 'table') {
      //         // Exit the table by inserting paragraph after
      //         const tablePos = $from.before(depth)
      //         const tableNode = state.doc.nodeAt(tablePos)
      //         if (tableNode) {
      //           const afterTablePos = tablePos + tableNode.nodeSize
      //           const tr = state.tr.insert(afterTablePos, state.schema.nodes.paragraph.create())
      //           const newPos = tr.doc.resolve(afterTablePos + 1)
      //           view.dispatch(tr.setSelection(
      //             (state.selection.constructor as any).near(newPos)
      //           ))
      //           return true // Handled
      //         }
      //       }
      //     }
      //   }
      //   return false // Not handled
      // }
    },
  })

  useEffect(() => {
    // If outside forces change content? 
    // Usually we avoid double-updates. 
    // This component is mostly controlled by TipTap internal state, 
    // pushing updates OUT.
  }, []);

  if (!editor) {
    return null
  }

  return (
    <div
      className="note-editor w-full flex flex-col bg-background text-text"
    // className="note-editor w-full flex flex-col bg-background text-text"
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-border text-xs overflow-x-auto">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded hover:bg-muted ${editor.isActive('bold') ? 'bg-muted' : ''}`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded hover:bg-muted ${editor.isActive('italic') ? 'bg-muted' : ''}`}
        >
          Italic
        </button>
        <div className="w-[1px] h-4 bg-border mx-1"></div>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1 rounded hover:bg-muted ${editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1 rounded hover:bg-muted ${editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded hover:bg-muted ${editor.isActive('bulletList') ? 'bg-muted' : ''}`}
        >
          List
        </button>
        <div className="w-[1px] h-4 bg-border mx-1"></div>
        {/* <button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className="p-1 rounded hover:bg-muted"
        >
          Table
        </button> */}
        <button
          onClick={() => editor.chain().focus().setCodeBlock().run()}
          className={`p-1 rounded hover:bg-muted ${editor.isActive('codeBlock') ? 'bg-muted' : ''}`}
        >
          Code
        </button>
      </div>

      {/* <div className="flex-1 overflow-y-auto cursor-text" onClick={() => editor.chain().focus().run()}>
        <EditorContent editor={editor} />
      </div> */}
      {/* <div className="p-4 cursor-text" onClick={() => editor.commands.focus()}></div> */}
      <div className="p-4">
        <EditorContent editor={editor} className="prose prose-zinc dark:prose-invert max-w-none focus:outline-none" />
      </div>
    </div>
  )
}