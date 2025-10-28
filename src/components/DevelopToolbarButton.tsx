import { Block, BlockNoteEditor } from '@blocknote/core';
import {
  ToolbarButton,
  useBlockNoteEditor,
  useEditorContentOrSelectionChange,
} from '@blocknote/react';
import { useState } from 'react';
import {
  addBlock,
  getEditorBlocks,
  updateBlock,
} from '../utils/blockManipulation';
import { convertBlockToString } from '../utils/ParserBlockToString';

export function DevelopToolbarButton({
  onSend,
  isGenerating,
  setIsGenerating,
  currentProccess,
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

  const [selectedBlocks, setSelectedBlocks] = useState<Block[]>([]);

  // Updates state on content or selection change.
  useEditorContentOrSelectionChange(() => {
    const selection = editor.getSelection();
    if (selection !== undefined) {
      setSelectedBlocks(selection.blocks);
    } else {
      const cursorPosition = editor.getTextCursorPosition();
      if (cursorPosition?.block) {
        setSelectedBlocks([cursorPosition.block]);
      }
    }
  }, editor);

  return (
    <ToolbarButton
      mainTooltip={'Develop'}
      isDisabled={isFetching || isGenerating}
      onClick={() => {
        developBlocks(editor.getSelection()?.blocks, editor);
      }}
    >
      Develop
    </ToolbarButton>
  );
}
