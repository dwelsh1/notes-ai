import { Block, BlockNoteEditor } from '@blocknote/core';
import { ToolbarButton, useBlockNoteEditor } from '@blocknote/react';
import { CheckCircle } from 'lucide-react';
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
    {
      console.log('correctBlocks');
      for (const block of blocks) {
        const correctProps = { ...block.props } as Record<string, unknown>;
        (correctProps as Record<string, unknown>)['textColor'] =
          correctedTextColor;
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

  // (Selection tracking not needed here; we read selection on click.)

  return (
    <ToolbarButton
      mainTooltip={'Correct grammar and spelling for selection (writes improved text to a new block)'}
      isDisabled={isFetching || isGenerating}
      onClick={() => {
        correctBlocks(editor.getSelection()?.blocks, editor);
      }}
    >
      <CheckCircle style={{ width: '16px', height: '16px', color: '#6b7280' }} />
    </ToolbarButton>
  );
}
