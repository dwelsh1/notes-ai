import { Block, BlockNoteEditor } from '@blocknote/core';
import correctSingleBlock from '../correctSingleBlock';
import { convertBlockToString } from '../ParserBlockToString';
import diffText from '../diffText';

// Mock the dependencies
jest.mock('../ParserBlockToString');
jest.mock('../diffText');

const mockConvertBlockToString = convertBlockToString as jest.MockedFunction<
  typeof convertBlockToString
>;
const mockDiffText = diffText as jest.MockedFunction<typeof diffText>;

describe('correctSingleBlock', () => {
  let mockSourceEditor: Partial<BlockNoteEditor>;
  let mockDestEditor: Partial<BlockNoteEditor>;
  let mockOnSend: jest.Mock;

  beforeEach(() => {
    mockSourceEditor = {
      updateBlock: jest.fn(),
    };
    mockDestEditor = {
      updateBlock: jest.fn(),
    };
    mockOnSend = jest.fn();

    jest.clearAllMocks();
  });

  describe('with empty text', () => {
    it('should return early when text is empty', async () => {
      const mockBlock: Block = {
        id: 'test-block',
        type: 'paragraph',
        content: [{ type: 'text', text: '' }],
      } as Block;

      mockConvertBlockToString.mockReturnValue('');

      await correctSingleBlock(
        mockBlock,
        mockBlock,
        mockSourceEditor as BlockNoteEditor,
        mockDestEditor as BlockNoteEditor,
        mockOnSend
      );

      expect(mockOnSend).not.toHaveBeenCalled();
    });
  });

  describe('with valid text', () => {
    it('should call onSend with correct parameters', async () => {
      const mockBlock: Block = {
        id: 'test-block',
        type: 'paragraph',
        content: [{ type: 'text', text: 'Hello world' }],
      } as Block;

      mockConvertBlockToString.mockReturnValue('Hello world');

      await correctSingleBlock(
        mockBlock,
        mockBlock,
        mockSourceEditor as BlockNoteEditor,
        mockDestEditor as BlockNoteEditor,
        mockOnSend
      );

      expect(mockOnSend).toHaveBeenCalledWith(
        'I want you to copy this text word for word while correcting spelling errors in French without introduction, explanation or context, just write the correction: Hello world',
        'correction',
        expect.any(Function)
      );
    });

    it('should handle design = 1 (default)', async () => {
      const mockBlock: Block = {
        id: 'test-block',
        type: 'paragraph',
        content: [{ type: 'text', text: 'Hello world' }],
      } as Block;

      mockConvertBlockToString.mockReturnValue('Hello world');
      mockDiffText.mockReturnValue([
        [{ type: 'text', text: 'Hello', styles: {} }],
        [{ type: 'text', text: 'Hello', styles: {} }],
      ]);

      await correctSingleBlock(
        mockBlock,
        mockBlock,
        mockSourceEditor as BlockNoteEditor,
        mockDestEditor as BlockNoteEditor,
        mockOnSend
      );

      // Get the callback function passed to onSend
      const callback = mockOnSend.mock.calls[0][2];

      // Call the callback to simulate the correction response
      await callback('Hello world');

      expect(mockDiffText).toHaveBeenCalledWith('Hello world', 'Hello world');
      expect(mockDestEditor.updateBlock).toHaveBeenCalledWith('test-block', {
        content: [{ type: 'text', text: 'Hello', styles: {} }],
      });
      expect(mockSourceEditor.updateBlock).toHaveBeenCalledWith('test-block', {
        content: [{ type: 'text', text: 'Hello', styles: {} }],
      });
    });

    it('should handle design = 2 (diffWords)', async () => {
      const mockBlock: Block = {
        id: 'test-block',
        type: 'paragraph',
        content: [{ type: 'text', text: 'Hello world' }],
      } as Block;

      mockConvertBlockToString.mockReturnValue('Hello world');

      await correctSingleBlock(
        mockBlock,
        mockBlock,
        mockSourceEditor as BlockNoteEditor,
        mockDestEditor as BlockNoteEditor,
        mockOnSend,
        2
      );

      const callback = mockOnSend.mock.calls[0][2];
      await callback('Hello world');

      expect(mockDestEditor.updateBlock).toHaveBeenCalledWith('test-block', {
        content: expect.any(Array),
      });
    });

    it('should handle design = 3 (diffChars)', async () => {
      const mockBlock: Block = {
        id: 'test-block',
        type: 'paragraph',
        content: [{ type: 'text', text: 'Hello world' }],
      } as Block;

      mockConvertBlockToString.mockReturnValue('Hello world');

      await correctSingleBlock(
        mockBlock,
        mockBlock,
        mockSourceEditor as BlockNoteEditor,
        mockDestEditor as BlockNoteEditor,
        mockOnSend,
        3
      );

      const callback = mockOnSend.mock.calls[0][2];
      await callback('Hello world');

      expect(mockDestEditor.updateBlock).toHaveBeenCalledWith('test-block', {
        content: expect.any(Array),
      });
    });
  });

  describe('error handling', () => {
    it('should handle errors in callback gracefully', async () => {
      const mockBlock: Block = {
        id: 'test-block',
        type: 'paragraph',
        content: [{ type: 'text', text: 'Hello world' }],
      } as Block;

      mockConvertBlockToString.mockReturnValue('Hello world');
      mockDiffText.mockImplementation(() => {
        throw new Error('Test error');
      });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await correctSingleBlock(
        mockBlock,
        mockBlock,
        mockSourceEditor as BlockNoteEditor,
        mockDestEditor as BlockNoteEditor,
        mockOnSend
      );

      const callback = mockOnSend.mock.calls[0][2];
      await callback('Hello world');

      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });
  });
});
