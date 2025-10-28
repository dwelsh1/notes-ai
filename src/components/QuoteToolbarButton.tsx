import { ToolbarButton, useBlockNoteEditor } from '@blocknote/react';

export function QuoteToolbarButton() {
  const editor = useBlockNoteEditor();

  const applyQuote = () => {
    try {
      const selection = editor.getSelection();
      const targets = selection?.blocks?.length
        ? selection.blocks
        : editor.getTextCursorPosition()?.block
        ? [editor.getTextCursorPosition().block]
        : [];
      for (const b of targets) {
        // @ts-expect-error: union type for block kinds includes quote/blockquote
        editor.updateBlock(b.id, { type: 'blockquote' });
      }
    } catch {
      /* no-op */
    }
  };

  return (
    <ToolbarButton
      key={'quoteButton'}
      mainTooltip={'Quote: format selection as a block quote'}
      onClick={applyQuote}
    >
      {/* simple quote glyph */}
      <span style={{ fontWeight: 700, color: '#6b7280' }}>&quot;</span>
    </ToolbarButton>
  );
}


