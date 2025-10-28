import { ToolbarButton, useBlockNoteEditor } from '@blocknote/react';
import { Quote } from 'lucide-react';

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
          console.log('[QuoteToolbarButton] update block', b?.id, b?.type);
        // @ts-expect-error: union includes blockquote via custom schema
        editor.updateBlock(b.id, { type: 'blockquote' });
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


