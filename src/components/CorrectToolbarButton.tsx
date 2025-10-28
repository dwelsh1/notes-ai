import { Block, BlockNoteEditor } from '@blocknote/core';
import {
  ToolbarButton,
  useBlockNoteEditor,
  useEditorContentOrSelectionChange,
} from '@blocknote/react';
import { useState } from 'react';
import correctSingleBlock from '../utils/correctSingleBlock';

// Custom Formatting Toolbar Button to correct the selected text
interface CorrectToolbarButtonProps {
  onSend: (
    prompt: string,
    task: 'translation' | 'correction' | 'summary' | 'develop',
    update: (text: string) => void
  ) => Promise<string | void>;
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
  setCurrentProcess: (
    p: 'translation' | 'correction' | 'summary' | 'develop' | null
  ) => void;
  isFetching: boolean;
  setOutput: (v: string) => void;
}

export function CorrectToolbarButton({
  onSend,
  isGenerating,
  setIsGenerating,
  setCurrentProcess,
  isFetching,
  setOutput,
}: CorrectToolbarButtonProps) {
  const editor = useBlockNoteEditor();

  async function correctBlocks(blocks: Block[], editor: BlockNoteEditor) {
    setIsGenerating(true);
    setCurrentProcess('correction');
    const correctedTextColor = 'blue';
    if (false && blocks.length == 1) {
      const block = blocks[0];
      const correctProps = { ...block.props } as Record<string, unknown>;
      (correctProps as Record<string, unknown>)['textColor'] = correctedTextColor;
      const newBlocks = editor.insertBlocks(
        [
          {
            props: correctProps,
            type: block.type,
          },
        ],
        block.id,
        'after'
      );
      const newBlock = newBlocks[0];
      await correctSingleBlock(
        //                {"content": [{"type":"text", "text": text}]},
        block,
        newBlock,
        editor,
        editor,
        onSend
      );
    } else {
      console.log('correctBlocks');
      for (const block of blocks) {
        const correctProps = { ...block.props } as Record<string, unknown>;
        (correctProps as Record<string, unknown>)['textColor'] = correctedTextColor;
        if (block.content !== undefined) {
          const newBlocks = editor.insertBlocks(
            [
              {
                props: correctProps,
                type: block.type,
              },
            ],
            block.id,
            'after'
          );
          const newBlock = newBlocks[0];
          await correctSingleBlock(block, newBlock, editor, editor, onSend);
        }
      }
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
      mainTooltip={'Correct'}
      isDisabled={isFetching || isGenerating}
      onClick={() => {
        correctBlocks(editor.getSelection()?.blocks, editor);
      }}
    >
      Correct
    </ToolbarButton>
  );
}
