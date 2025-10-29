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
      setTimeout(() => {
        try {
          for (const b of targets) {
            if (import.meta.env.DEV)
              console.log('[QuoteToolbarButton] convert in-place', b?.id, b?.type);
            try {
              // Try built-in quote first
              // @ts-expect-error
              editor.updateBlock(b.id, { type: 'quote' });
            } catch {
              // Fallback to custom blockquote
              // @ts-expect-error
              editor.updateBlock(b.id, { type: 'blockquote' });
            }
            const txt = (convertBlockToString as any)?.(b) ?? '';
            if (!txt || txt.trim().length === 0) {
              try {
                editor.updateBlock(b.id, {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  content: [{ type: 'text', text: 'Empty quote', styles: { textColor: '#9ca3af' } }] as any,
                });
              } catch {}
            }
            try {
              editor.setTextCursorPosition(b, 'start');
            } catch {}
          }
        } catch (e) {
          if (import.meta.env.DEV)
            console.error('[QuoteToolbarButton] deferred error', e);
        }
      }, 0);
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


