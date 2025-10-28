import { ToolbarButton, useBlockNoteEditor } from '@blocknote/react';
import { Quote } from 'lucide-react';

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
      if (!targets.length) return;
      for (const b of targets) {
        // @ts-expect-error: union includes blockquote
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
      <Quote style={{ width: 18, height: 18, color: '#6b7280' }} />
    </ToolbarButton>
  );
}


