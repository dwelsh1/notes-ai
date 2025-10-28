import { ToolbarButton, useBlockNoteEditor } from '@blocknote/react';
import { Quote } from 'lucide-react';

export function QuoteToolbarButton() {
  const editor = useBlockNoteEditor();

  const applyQuote = () => {
    try {
      const cursor = editor.getTextCursorPosition();
      if (!cursor?.block) return;
      const inserted = editor.insertBlocks(
        [
          {
            // @ts-expect-error: BlockNote supports blockquote type
            type: 'blockquote',
            content: [],
          },
        ],
        cursor.block,
        'after'
      );
      editor.setTextCursorPosition(inserted[0], 'end');
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


