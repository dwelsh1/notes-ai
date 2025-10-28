import {
  BasicTextStyleButton,
  BlockTypeSelect,
  ColorStyleButton,
  CreateLinkButton,
  FormattingToolbar,
  ImageCaptionButton,
  NestBlockButton,
  ReplaceImageButton,
  TextAlignButton,
  UnnestBlockButton,
} from '@blocknote/react';
import { ToolbarButton, useBlockNoteEditor } from '@blocknote/react';
import { TranslateToolbarButton } from './TranslateToolbarButton';
import { CorrectToolbarButton } from './CorrectToolbarButton';
import { DevelopToolbarButton } from './DevelopToolbarButton';

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
  return (
    <FormattingToolbar>
      <BlockTypeSelect key={'blockTypeSelect'} />

      {/* Extra button to toggle blue text & background */}
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

      <TextAlignButton textAlignment={'left'} key={'textAlignLeftButton'} />
      <TextAlignButton textAlignment={'center'} key={'textAlignCenterButton'} />
      <TextAlignButton textAlignment={'right'} key={'textAlignRightButton'} />

      <ColorStyleButton key={'colorStyleButton'} />

      <NestBlockButton key={'nestBlockButton'} />
      <UnnestBlockButton key={'unnestBlockButton'} />

      <CreateLinkButton key={'createLinkButton'} />

      {/* Divider insert (Markdown '---') */}
      <ToolbarButton
        key={'dividerButton'}
        mainTooltip={'Divider'}
        isDisabled={isFetching || isGenerating}
        onClick={async () => {
          try {
            const blocks = await editor.tryParseMarkdownToBlocks('---');
            const sel = editor.getSelection();
            const afterId = sel?.blocks?.[sel.blocks.length - 1]?.id;
            if (afterId) {
              editor.insertBlocks(blocks, afterId, 'after');
            } else {
              editor.insertBlocks(blocks);
            }
          } catch (e) {
            // no-op
          }
        }}
      >
        Divider
      </ToolbarButton>
    </FormattingToolbar>
  );
}
