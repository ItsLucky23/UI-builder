import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { useCallback, useState } from 'react'
import BaseCodeEditor from '../editor/BaseCodeEditor'
import { Node, mergeAttributes } from '@tiptap/core'

export const CustomCodeBlock = Node.create({
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
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
        })
      },
    }
  },
})

function CodeBlockComponent({ node, updateAttributes }: any) {
  // node.attrs.language
  // node.content (but for code block, content is text)
  // For editable code block in TipTap, usually it's best to rely on TipTap's text model
  // But since we want Monaco, we might treat this node as an "island" or properly sync it.
  // syncing bi-directionally can be tricky.

  // Alternative: We store the code in attributes, expecting it to be a "void" node from TipTap's perspective?
  // Or we try to sync `node.textContent`?

  // Simplest for "Pro" feel: The code block is a distinct entity.
  // We use node.attrs.code (custom attribute) or just sync with node.content.

  // Let's try syncing with node content.

  const [language, setLanguage] = useState(node.attrs.language || 'typescript');

  // Ensure we have a stable unique ID for this code block instance
  const [uniqueId] = useState(() => node.attrs.id || Math.random().toString(36).substring(7));

  const onChange = useCallback((value: string | undefined) => {
    // We update the node content.
    // However, TipTap CodeBlock expects simpler text. 
    // If we use standard codeBlock, we might need to update its text content.
    // This is hard to do from inside the view in a "clean" way for standard nodes.

    // BETTER APPROACH for complex inner editors:
    // Update a custom attribute "code" and let the node be empty/void or just a container.
    updateAttributes({ code: value });
  }, [updateAttributes]);

  return (
    <NodeViewWrapper className="code-block my-4 rounded-md overflow-hidden border border-border bg-background shadow-sm">
      <div className="flex items-center justify-between bg-background2 px-3 py-1 border-b border-border">
        <select
          contentEditable={false}
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            updateAttributes({ language: e.target.value });
          }}
          onMouseDown={(e) => { e.stopPropagation(); }}
          onClick={(e) => { e.stopPropagation(); }}
          className="bg-transparent text-xs text-text outline-none cursor-pointer"
        >
          <option className='bg-background2' value="typescript">TypeScript</option>
          <option className='bg-background2' value="javascript">JavaScript</option>
          <option className='bg-background2' value="html">HTML</option>
          <option className='bg-background2' value="css">CSS</option>
          <option className='bg-background2' value="json">JSON</option>
          <option className='bg-background2' value="python">Python</option>
        </select>
        {/* <div className="text-xs text-muted-foreground">Monaco Editor</div> */}
      </div>
      <div
        className="relative min-h-[50px]"
        contentEditable={false}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      > {/* Auto-growing height */}
        <BaseCodeEditor
          value={node.attrs.code || ''}
          onChange={onChange}
          language={language}
          path={`file:///note-${uniqueId}.tsx`}
          options={{
            minimap: { enabled: false },
            lineNumbers: "off",
            glyphMargin: false,
            folding: false,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 0,
            scrollBeyondLastLine: false,
            padding: { top: 8, bottom: 8 }
          }}
        />
      </div>
    </NodeViewWrapper>
  )
}
