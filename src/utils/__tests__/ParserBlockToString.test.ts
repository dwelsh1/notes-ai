import { convertBlockToString } from '../ParserBlockToString';
import { Block } from '@blocknote/core';

describe('ParserBlockToString', () => {
  describe('convertBlockToString', () => {
    it('should convert paragraph block to string', () => {
      const block: Block = {
        id: '1',
        type: 'paragraph',
        content: [{ type: 'text', text: 'Hello world' }],
      };

      const result = convertBlockToString(block);
      expect(result).toBe('Hello world');
    });

    it('should handle empty paragraph block', () => {
      const block: Block = {
        id: '1',
        type: 'paragraph',
        content: [],
      };

      const result = convertBlockToString(block);
      expect(result).toBe('');
    });

    it('should handle paragraph with multiple text items', () => {
      const block: Block = {
        id: '1',
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Hello ' },
          { type: 'text', text: 'world' },
        ],
      };

      const result = convertBlockToString(block);
      expect(result).toBe('Hello world');
    });

    it('should handle link blocks recursively', () => {
      const block: Block = {
        id: '1',
        type: 'paragraph',
        content: [
          {
            type: 'link',
            href: 'https://example.com',
            content: [{ type: 'text', text: 'Click here' }],
          },
        ],
      };

      const result = convertBlockToString(block);
      expect(result).toBe('Click here');
    });

    it('should handle table blocks', () => {
      const block: Block = {
        id: '1',
        type: 'table',
        content: {
          rows: [
            {
              cells: [
                [{ type: 'text', text: 'Cell 1' }],
                [{ type: 'text', text: 'Cell 2' }],
              ],
            },
            {
              cells: [
                [{ type: 'text', text: 'Cell 3' }],
                [{ type: 'text', text: 'Cell 4' }],
              ],
            },
          ],
        },
      } as Block;

      const result = convertBlockToString(block);
      expect(result).toBe(' Cell 1 Cell 2 Cell 3 Cell 4');
    });

    it('should handle empty table', () => {
      const block: Block = {
        id: '1',
        type: 'table',
        content: {
          rows: [],
        },
      } as Block;

      const result = convertBlockToString(block);
      expect(result).toBe('');
    });

    it('should handle table with empty cells', () => {
      const block: Block = {
        id: '1',
        type: 'table',
        content: {
          rows: [
            {
              cells: [[], [{ type: 'text', text: 'Cell 2' }]],
            },
          ],
        },
      } as Block;

      const result = convertBlockToString(block);
      expect(result).toBe(' Cell 2');
    });

    it('should handle block without content', () => {
      const block: Block = {
        id: '1',
        type: 'paragraph',
      } as Block;

      const result = convertBlockToString(block);
      expect(result).toBe('');
    });

    it('should handle nested link in table', () => {
      const block: Block = {
        id: '1',
        type: 'table',
        content: {
          rows: [
            {
              cells: [
                [
                  {
                    type: 'link',
                    href: 'https://example.com',
                    content: [{ type: 'text', text: 'Link text' }],
                  },
                ],
              ],
            },
          ],
        },
      } as Block;

      const result = convertBlockToString(block);
      expect(result).toBe(' ');
    });
  });
});
