import { Block, BlockNoteEditor } from '@blocknote/core';
import diffText from './diffText';
import { diffWords, diffChars } from 'diff';
import { MLCEngine } from '@mlc-ai/web-llm';
import { convertBlockToString } from './ParserBlockToString';

async function correctSingleBlock(
  sourceBlock: Block | undefined,
  destBlock: Block | undefined,
  sourceEditor: BlockNoteEditor,
  destEditor: BlockNoteEditor,
  onSend: Function,
  design: number = 1
) {
  const text = convertBlockToString(sourceBlock);
  // get plain text of sourceBlock

  if (text === '') {
    return;
  }
  console.log(text);

  await onSend(
    'I want you to copy this text word for word while correcting spelling errors in French without introduction, explanation or context, just write the correction: ' +
      text,
    'correction',
    async (correctedText: string) => {
      try {
        if (design == 1) {
          const [sourceContent, correctedContent] = diffText(
            text,
            correctedText
          );

          destEditor.updateBlock(destBlock.id, { content: correctedContent });
          sourceEditor.updateBlock(sourceBlock.id, { content: sourceContent });
        } else {
          const diffContent =
            design == 2
              ? diffWords(text, correctedText)
              : diffChars(text, correctedText);
          const correctedContent = [];
          for (const sequence of diffContent) {
            if (sequence['added']) {
              correctedContent.push({
                type: 'text',
                text: sequence['value'],
                styles: {
                  backgroundColor: 'green',
                  // "textColor": "green"
                },
              });
            } else if (sequence['removed']) {
              correctedContent.push({
                type: 'text',
                text: sequence.value,
                styles: {
                  backgroundColor: 'red',
                  textColor: 'red',
                  strike: true,
                },
              });
            } else {
              correctedContent.push({
                type: 'text',
                text: sequence.value,
                styles: {},
              });
            }
          }
          destEditor.updateBlock(destBlock.id, { content: correctedContent });
        }
      } catch (error) {
        console.log(error);
      }
    }
  );
}

export default correctSingleBlock;
