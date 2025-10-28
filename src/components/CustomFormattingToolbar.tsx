import {
  BasicTextStyleButton,
  ColorStyleButton,
  CreateLinkButton,
  FormattingToolbar,
  ImageCaptionButton,
  NestBlockButton,
  ReplaceImageButton,
  TextAlignButton,
  UnnestBlockButton,
  useBlockNoteEditor,
} from '@blocknote/react';
import { TranslateToolbarButton } from './TranslateToolbarButton';
import { CorrectToolbarButton } from './CorrectToolbarButton';
import { DevelopToolbarButton } from './DevelopToolbarButton';
import { QuoteToolbarButton } from './QuoteToolbarButton';

export function CustomFormattingToolbar({
  onSend,
  isGenerating,
  setIsGenerating,
  currentProccess,
  setCurrentProcess,
  isFetching,
  setOutput,
}) {
  const editor = useBlockNoteEditor();

  const applyHeadingLevel = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    try {
      const selection = editor.getSelection();
      const targets = selection?.blocks?.length
        ? selection.blocks
        : editor.getTextCursorPosition()?.block
        ? [editor.getTextCursorPosition().block]
        : [];
      for (const b of targets) {
        // @ts-expect-error - union props; BlockNote accepts heading with level
        editor.updateBlock(b.id, { type: 'heading', props: { level } });
      }
    } catch {
      /* noop */
    }
  };

  const applyList = (kind: 'bullet' | 'numbered') => {
    try {
      const selection = editor.getSelection();
      const targets = selection?.blocks?.length
        ? selection.blocks
        : editor.getTextCursorPosition()?.block
        ? [editor.getTextCursorPosition().block]
        : [];
      for (const b of targets) {
        const type = kind === 'bullet' ? 'bulletListItem' : 'numberedListItem';
        // @ts-expect-error - BlockNote union accepts list item types
        editor.updateBlock(b.id, { type });
      }
    } catch {
      /* noop */
    }
  };
  const applyParagraph = () => {
    try {
      const selection = editor.getSelection();
      const targets = selection?.blocks?.length
        ? selection.blocks
        : editor.getTextCursorPosition()?.block
        ? [editor.getTextCursorPosition().block]
        : [];
      for (const b of targets) {
        editor.updateBlock(b.id, { type: 'paragraph', props: {} });
      }
    } catch {
      /* noop */
    }
  };
  return (
    <FormattingToolbar>
      {/* Custom block type dropdown including H1–H6 */}
      <select
        key={'blockTypeSelect'}
        data-testid="block-type-select"
        onChange={e => {
          const val = e.target.value;
          if (val === 'paragraph') applyParagraph();
          if (val === 'h1') applyHeadingLevel(1);
          if (val === 'h2') applyHeadingLevel(2);
          if (val === 'h3') applyHeadingLevel(3);
          if (val === 'h4') applyHeadingLevel(4);
          if (val === 'h5') applyHeadingLevel(5);
          if (val === 'h6') applyHeadingLevel(6);
          if (val === 'bullet') applyList('bullet');
          if (val === 'numbered') applyList('numbered');
          // reset placeholder
          e.currentTarget.selectedIndex = 0;
        }}
        defaultValue=""
        style={{ marginLeft: 6, padding: '2px 4px', fontSize: 12 }}
        title="Change block type"
      >
        <option value="" disabled>
          Paragraph / Headings
        </option>
        <option value="paragraph">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
        <option value="h5">Heading 5</option>
        <option value="h6">Heading 6</option>
        <option value="bullet">
          Bullet List
        </option>
        <option value="numbered">
          Numbered List
        </option>
      </select>

      <ImageCaptionButton key={'imageCaptionButton'} />
      <ReplaceImageButton key={'replaceImageButton'} />

      <BasicTextStyleButton basicTextStyle={'bold'} key={'boldStyleButton'} />
      <BasicTextStyleButton
        basicTextStyle={'italic'}
        key={'italicStyleButton'}
      />
      <BasicTextStyleButton
        basicTextStyle={'underline'}
        key={'underlineStyleButton'}
      />
      <BasicTextStyleButton
        basicTextStyle={'strike'}
        key={'strikeStyleButton'}
      />
      {/* Extra button to toggle code styles */}
      <BasicTextStyleButton key={'codeStyleButton'} basicTextStyle={'code'} />
      {/* Quote block button */}
      <QuoteToolbarButton />
      {/* Divider after Quote */}
      <div
        key={'divider-after-quote'}
        style={{ width: '1px', height: '20px', background: '#e5e7eb', margin: '0 6px' }}
      />

      <TextAlignButton textAlignment={'left'} key={'textAlignLeftButton'} />
      <TextAlignButton textAlignment={'center'} key={'textAlignCenterButton'} />
      <TextAlignButton textAlignment={'right'} key={'textAlignRightButton'} />

      <ColorStyleButton key={'colorStyleButton'} />

      <NestBlockButton key={'nestBlockButton'} />
      <UnnestBlockButton key={'unnestBlockButton'} />

      <CreateLinkButton key={'createLinkButton'} />

      {/* Divider before AI actions */}
      <div
        key={'divider-ai'}
        style={{ width: '1px', height: '20px', background: '#e5e7eb', margin: '0 6px' }}
      />

      {/* AI actions moved after divider at the end */}
      <TranslateToolbarButton
        key={'translateButton'}
        onSend={onSend}
        isGenerating={isGenerating}
        setIsGenerating={setIsGenerating}
        currentProccess={currentProccess}
        setCurrentProcess={setCurrentProcess}
        isFetching={isFetching}
        setOutput={setOutput}
      />
      <CorrectToolbarButton
        key={'correctButton'}
        onSend={onSend}
        isGenerating={isGenerating}
        setIsGenerating={setIsGenerating}
        currentProccess={currentProccess}
        setCurrentProcess={setCurrentProcess}
        isFetching={isFetching}
        setOutput={setOutput}
      />
      <DevelopToolbarButton
        key={'developButton'}
        onSend={onSend}
        isGenerating={isGenerating}
        setIsGenerating={setIsGenerating}
        currentProccess={currentProccess}
        setCurrentProcess={setCurrentProcess}
        isFetching={isFetching}
        setOutput={setOutput}
      />
    </FormattingToolbar>
  );
}
