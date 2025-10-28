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
  return (
    <FormattingToolbar>
      <BlockTypeSelect key={'blockTypeSelect'} />

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
