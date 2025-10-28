import { Block } from '@blocknote/core';
import { ToolbarButton, useBlockNoteEditor } from '@blocknote/react';
import { updateBlock } from '../utils/blockManipulation';
import { convertBlockToString } from '../utils/ParserBlockToString';

export function DevelopToolbarButton({
  onSend,
  isGenerating,
  setIsGenerating,
  // currentProccess (unused)
  setCurrentProcess,
  isFetching,
  setOutput,
}) {
  const editor = useBlockNoteEditor();

  async function developBlocks(blocks: Block[]) {
    setIsGenerating(true);
    setCurrentProcess('develop');

    const newBlocks = editor.insertBlocks(
      [
        {
          type: 'paragraph',
          content: [],
        },
      ],
      blocks[blocks.length - 1].id,
      'after'
    );
    let text = '';
    for (const block of blocks) {
      if (block) {
        text += convertBlockToString(block);
      }
    }
    if (text !== '') {
      const prompt = 'Develop text from these elements: ' + text;
      await onSend(prompt, 'develop', (text: string) => {
        updateBlock(editor, newBlocks[0].id, text, 'blue');
      });
    }

    setIsGenerating(false);
    setCurrentProcess(null);
    setOutput('');
  }

  // Selection state not needed for current onClick path; rely on editor.getSelection()

  return (
    <ToolbarButton
      mainTooltip={'Develop'}
      isDisabled={isFetching || isGenerating}
      onClick={() => {
        const selection = editor.getSelection();
        if (selection?.blocks) {
          developBlocks(selection.blocks);
        }
      }}
    >
      Develop
    </ToolbarButton>
  );
}
