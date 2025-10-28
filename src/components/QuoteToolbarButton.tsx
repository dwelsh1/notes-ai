import { ToolbarButton, useBlockNoteEditor } from '@blocknote/react';
import { Quote } from 'lucide-react';
import { convertBlockToString } from '../utils/ParserBlockToString';

export function QuoteToolbarButton() {
  const editor = useBlockNoteEditor();

  const applyQuote = () => {
    try {
      if (import.meta.env.DEV) console.log('[QuoteToolbarButton] click');
      const selection = editor.getSelection();
      if (import.meta.env.DEV)
        console.log('[QuoteToolbarButton] selection', selection);
      const targets = selection?.blocks?.length
        ? selection.blocks
        : editor.getTextCursorPosition()?.block
        ? [editor.getTextCursorPosition().block]
        : [];
      if (import.meta.env.DEV)
        console.log(
          '[QuoteToolbarButton] targets',
          targets.map((t: any) => ({ id: t.id, type: t.type }))
        );
      if (!targets.length) {
        if (import.meta.env.DEV)
          console.warn('[QuoteToolbarButton] no targets, abort');
        return;
      }
      for (const b of targets) {
        if (import.meta.env.DEV)
          console.log('[QuoteToolbarButton] process block', b?.id, b?.type);
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
        if (import.meta.env.DEV)
          console.log('[QuoteToolbarButton] inserted', inserted?.[0]?.id);
        editor.updateBlock(inserted[0].id, { content: text } as any);
        editor.setTextCursorPosition(inserted[0], 'end');
      }
    } catch (e) {
      if (import.meta.env.DEV)
        console.error('[QuoteToolbarButton] error', e);
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


