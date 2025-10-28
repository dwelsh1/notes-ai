import { ToolbarButton, useBlockNoteEditor } from '@blocknote/react';
import { Quote } from 'lucide-react';
import { convertBlockToString } from '../utils/ParserBlockToString';

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
        const text = convertBlockToString(b as any);
        const inserted = editor.insertBlocks(
          [
            {
              // @ts-expect-error: union includes blockquote
              type: 'blockquote',
              content: [],
            },
          ],
          (b as any).id,
          'after'
        );
        editor.updateBlock(inserted[0].id, { content: text } as any);
        editor.setTextCursorPosition(inserted[0], 'end');
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


