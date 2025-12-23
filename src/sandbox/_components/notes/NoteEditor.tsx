import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockComponent from './CodeBlockComponent'
import { getCaretPosition, CaretPosition } from '../../_functions/notes/getCaretPosition'

// Styling
import 'src/NoteEditor.css'


import { Node, mergeAttributes } from '@tiptap/core'
import { handleCaretPositionChange } from 'src/sandbox/_functions/notes/handleCaretPosition'

const CustomCodeBlock = Node.create({
  name: 'codeBlock',
  group: 'block',
  atom: true,

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

  parseHTML() {
    return [
      {
        tag: 'pre',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent)
  },

  addCommands() {
    return {
      setCodeBlock: (attributes: any) => ({ commands }: any) => {
        return commands.setNode(this.name, attributes)
      },
      toggleCodeBlock: (attributes: any) => ({ commands }: any) => {
        return commands.toggleNode(this.name, 'paragraph', attributes)
      },
    }
  },
})

type NoteEditorProps = {
  initialContent?: string | object;
  onUpdate: (content: object) => void;
  isEditable?: boolean;
  onCaretPositionChange?: (position: CaretPosition | null) => void;
}

export default function NoteEditor({ initialContent, onUpdate, isEditable = true, onCaretPositionChange }: NoteEditorProps) {

  const handleCaretPosition = handleCaretPositionChange();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // implementation is replaced by CustomCodeBlock
      }),
      CustomCodeBlock,
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
        handleCaretPosition(getCaretPosition(editor));

        if (event.key === 'Enter' && !event.shiftKey) {

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
        <button
          onClick={() => editor.chain().focus().setCodeBlock().run()}
          className={`p-1 rounded hover:bg-muted ${editor.isActive('codeBlock') ? 'bg-muted' : ''}`}
        >
          Code
        </button>
      </div>
      <div className="p-4">
        <EditorContent editor={editor} className="prose prose-zinc dark:prose-invert max-w-none focus:outline-none" />
      </div>
    </div>
  )
}