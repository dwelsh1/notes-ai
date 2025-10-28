import { BlockNoteEditor } from '@blocknote/core';
import {
  updateContentBlock,
  updateBlock,
  addBlock,
  getEditorBlocks,
  duplicateEditor,
} from '../blockManipulation';
import { StyleSchema, StyledText } from '@blocknote/core';

// Mock BlockNoteEditor
const createMockEditor = () => {
  const mockBlocks = new Map();
  const mockDocument = [
    {
      id: 'block1',
      type: 'paragraph',
      content: [{ type: 'text', text: 'Original text' }],
    },
  ];

  return {
    getBlock: jest.fn(
      (id: string) => mockBlocks.get(id) || mockDocument.find(b => b.id === id)
    ),
    updateBlock: jest.fn(),
    insertBlocks: jest.fn(),
    forEachBlock: jest.fn(callback => {
      mockDocument.forEach(block => {
        const text = block.content?.[0]?.text || '';
        if (text !== '') {
          callback(block);
        }
      });
      return true;
    }),
    tryParseMarkdownToBlocks: jest.fn(),
    replaceBlocks: jest.fn(),
    document: mockDocument,
  } as unknown as BlockNoteEditor;
};

describe('blockManipulation', () => {
  let mockEditor: BlockNoteEditor;

  beforeEach(() => {
    mockEditor = createMockEditor();
  });

  describe('updateContentBlock', () => {
    it('should update block content when block exists', () => {
      const content: StyledText<StyleSchema>[] = [
        { type: 'text', text: 'Updated content', styles: {} },
      ];

      updateContentBlock(mockEditor, 'block1', content);

      expect(mockEditor.updateBlock).toHaveBeenCalledWith('block1', {
        content: content,
      });
    });

    it('should not update when block does not exist', () => {
      const content: StyledText<StyleSchema>[] = [
        { type: 'text', text: 'Updated content', styles: {} },
      ];

      updateContentBlock(mockEditor, 'nonexistent', content);

      expect(mockEditor.updateBlock).not.toHaveBeenCalled();
    });
  });

  describe('updateBlock', () => {
    it('should update block with text and default color', () => {
      updateBlock(mockEditor, 'block1', 'New text');

      expect(mockEditor.updateBlock).toHaveBeenCalledWith('block1', {
        content: [
          {
            type: 'text',
            text: 'New text',
            styles: { textColor: 'black' },
          },
        ],
      });
    });

    it('should update block with custom color', () => {
      updateBlock(mockEditor, 'block1', 'New text', 'red');

      expect(mockEditor.updateBlock).toHaveBeenCalledWith('block1', {
        content: [
          {
            type: 'text',
            text: 'New text',
            styles: { textColor: 'red' },
          },
        ],
      });
    });

    it('should not update when block does not exist', () => {
      updateBlock(mockEditor, 'nonexistent', 'New text');

      expect(mockEditor.updateBlock).not.toHaveBeenCalled();
    });
  });

  describe('addBlock', () => {
    it('should add block after existing block', () => {
      addBlock(mockEditor, 'block1', 'New block text');

      expect(mockEditor.insertBlocks).toHaveBeenCalledWith(
        [
          {
            id: undefined,
            content: [
              {
                type: 'text',
                text: 'New block text',
                styles: { textColor: 'black' },
              },
            ],
          },
        ],
        'block1',
        'after'
      );
    });

    it('should add block with custom parameters', () => {
      addBlock(
        mockEditor,
        'block1',
        'New block text',
        'blue',
        'before',
        'newBlockId'
      );

      expect(mockEditor.insertBlocks).toHaveBeenCalledWith(
        [
          {
            id: 'newBlockId',
            content: [
              {
                type: 'text',
                text: 'New block text',
                styles: { textColor: 'blue' },
              },
            ],
          },
        ],
        'block1',
        'before'
      );
    });

    it('should not add block when parent does not exist', () => {
      addBlock(mockEditor, 'nonexistent', 'New block text');

      expect(mockEditor.insertBlocks).not.toHaveBeenCalled();
    });
  });

  describe('getEditorBlocks', () => {
    it('should return array of block IDs with non-empty content', () => {
      const result = getEditorBlocks(mockEditor);

      expect(result).toEqual(['block1']);
      expect(mockEditor.forEachBlock).toHaveBeenCalled();
    });

    it('should return empty array when no blocks have content', () => {
      const emptyEditor = createMockEditor();
      emptyEditor.document = [
        {
          id: 'emptyBlock',
          type: 'paragraph',
          content: [{ type: 'text', text: '' }],
        },
      ];

      // Override forEachBlock to handle empty content
      emptyEditor.forEachBlock = jest.fn(callback => {
        emptyEditor.document.forEach(block => {
          const text = block.content?.[0]?.text || '';
          if (text !== '') {
            callback(block);
          }
        });
        return true;
      });

      const result = getEditorBlocks(emptyEditor);

      expect(result).toEqual([]);
    });
  });

  describe('duplicateEditor', () => {
    it('should duplicate editor content with placeholder', async () => {
      const duplicateEditorMock = createMockEditor();

      const result = await duplicateEditor(
        mockEditor,
        duplicateEditorMock,
        'Placeholder text'
      );

      expect(mockEditor.tryParseMarkdownToBlocks).toHaveBeenCalledWith('');
      expect(duplicateEditorMock.replaceBlocks).toHaveBeenCalledWith(
        duplicateEditorMock.document,
        mockEditor.document
      );
      expect(result).toEqual(['block1']);
    });

    it('should duplicate editor with custom text color', async () => {
      const duplicateEditorMock = createMockEditor();

      const result = await duplicateEditor(
        mockEditor,
        duplicateEditorMock,
        'Placeholder text',
        'red'
      );

      expect(result).toEqual(['block1']);
    });

    it('should handle empty editor', async () => {
      const emptyEditor = createMockEditor();
      emptyEditor.document = [];
      const duplicateEditorMock = createMockEditor();

      // Override forEachBlock to handle empty content
      emptyEditor.forEachBlock = jest.fn(callback => {
        emptyEditor.document.forEach(block => {
          const text = block.content?.[0]?.text || '';
          if (text !== '') {
            callback(block);
          }
        });
        return true;
      });

      const result = await duplicateEditor(
        emptyEditor,
        duplicateEditorMock,
        'Placeholder text'
      );

      expect(result).toEqual([]);
    });
  });
});
