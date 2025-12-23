import { Editor } from '@tiptap/react';

export interface CaretPosition {
  /** Absolute pixel position from top of the page */
  absoluteY: number;
  /** Position relative to viewport (0-100) */
  viewportPercentage: number;
  /** Absolute pixel position from left of the page */
  absoluteX: number;
  /** Position relative to viewport width (0-100) */
  viewportPercentageX: number;
  /** Whether the caret is currently visible in viewport */
  isInViewport: boolean;
  /** Offset position in the document */
  offset: number;
  /** DOM node at the offset position */
  offsetNode: Node;
  /** Function to get the client rect of the caret position */
  getClientRect: () => DOMRect;
}

/**
 * Get the current caret (cursor) position relative to the screen viewport
 * @param editor - TipTap editor instance
 * @returns CaretPosition object with position data, or null if editor is not focused
 */
export function getCaretPosition(editor: Editor | null): CaretPosition | null {
  if (!editor) {
    return null;
  }

  const { view, state } = editor;
  const { selection } = state;

  // Get the absolute position of the cursor in the document
  const { from } = selection;

  try {
    // Get DOM coordinates of the cursor position
    const coords = view.coordsAtPos(from);

    // Get viewport dimensions
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Calculate position relative to viewport
    const viewportPercentage = (coords.top / viewportHeight) * 100;
    const viewportPercentageX = (coords.left / viewportWidth) * 100;

    // Check if caret is visible in viewport
    const isInViewport =
      coords.top >= 0 &&
      coords.top <= viewportHeight &&
      coords.left >= 0 &&
      coords.left <= viewportWidth;

    // Get the DOM node at the cursor position
    const domAtPos = view.domAtPos(from);
    const offsetNode = domAtPos.node;

    return {
      absoluteY: coords.top,
      viewportPercentage: Math.max(0, Math.min(100, viewportPercentage)),
      absoluteX: coords.left,
      viewportPercentageX: Math.max(0, Math.min(100, viewportPercentageX)),
      isInViewport,
      offset: from,
      offsetNode: offsetNode,
      getClientRect: () => {
        // Return a DOMRect based on the coords
        return new DOMRect(coords.left, coords.top, 0, coords.bottom - coords.top);
      },
    };
  } catch (error) {
    console.error('Error getting caret position:', error);
    return null;
  }
}
