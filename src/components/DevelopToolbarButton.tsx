import { Block } from '@blocknote/core';
import { useBlockNoteEditor } from '@blocknote/react';
import { Lightbulb } from 'lucide-react';
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
    <button
      type="button"
      title={'Develop: expand selected bullets/notes into fuller prose (adds a new paragraph)'}
      disabled={isFetching || isGenerating}
      onClick={() => {
        const selection = editor.getSelection();
        if (selection?.blocks) {
          developBlocks(selection.blocks);
        }
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 24,
        border: 'none',
        background: 'transparent',
        cursor: isFetching || isGenerating ? 'not-allowed' : 'pointer',
      }}
    >
      <Lightbulb style={{ width: '16px', height: '16px', color: '#6b7280' }} />
    </button>
  );
}
