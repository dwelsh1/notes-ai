import { useBlockNoteEditor } from '@blocknote/react';
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
            const raw = (convertBlockToString as any)?.(b) ?? '';
            const isEmpty = raw.trim().length === 0;
            const content: any = [{
              type: 'text',
              text: isEmpty ? 'Empty quote' : raw,
              styles: isEmpty ? { textColor: '#9ca3af' } : {},
            }];
            if (import.meta.env.DEV)
              console.log('[QuoteToolbarButton] convert in-place', b?.id, b?.type);
            let converted = false;
            try {
              // Try built-in quote first
              // @ts-expect-error
              editor.updateBlock(b.id, { type: 'quote' });
              converted = true;
            } catch {}
            if (!converted) {
              try {
                // Fallback to custom block
                // @ts-expect-error
                editor.updateBlock(b.id, { type: 'blockquote' });
                converted = true;
              } catch {}
            }
            if (converted) {
              // Set plain text content on next tick to avoid selection errors
              setTimeout(() => {
                try {
                  editor.updateBlock(b.id, { content });
                  const after = editor.getBlock((b as any).id) as any;
                  try { editor.setTextCursorPosition(after ?? b, 'start'); } catch {}
                } catch {}
              }, 0);
            } else {
              // As a last resort, non-destructive insert-after to avoid data loss
              try {
                const inserted = editor.insertBlocks([
                  { type: 'blockquote', props: {}, content },
                ] as any, (b as any).id, 'after');
                const after = inserted?.[0];
                try { editor.setTextCursorPosition(after ?? b, 'start'); } catch {}
              } catch {}
            }
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
    <button
      type="button"
      title={'Quote: format selection as a block quote'}
      onClick={applyQuote}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 24,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
      }}
    >
      <Quote style={{ width: 18, height: 18, color: '#6b7280' }} />
    </button>
  );
}


