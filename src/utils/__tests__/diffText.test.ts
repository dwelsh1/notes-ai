import diffText from '../diffText';
import { StyleSchema, StyledText } from '@blocknote/core';

describe('diffText', () => {
  describe('design = 1 (word-by-word comparison)', () => {
    it('should return identical content for identical text', () => {
      const originalText = 'Hello world';
      const correctedText = 'Hello world';

      const [sourceContent, correctedContent] = diffText(
        originalText,
        correctedText,
        1
      );

      expect(sourceContent).toEqual(correctedContent);
      expect(sourceContent).toHaveLength(2);
      expect(sourceContent[0]).toEqual({
        type: 'text',
        text: 'Hello ',
        styles: {},
      });
      expect(sourceContent[1]).toEqual({
        type: 'text',
        text: 'world ',
        styles: {},
      });
    });

    it('should highlight differences in words', () => {
      const originalText = 'Hello world';
      const correctedText = 'Hello there';

      const [sourceContent, correctedContent] = diffText(
        originalText,
        correctedText,
        1
      );

      expect(sourceContent[0]).toEqual({
        type: 'text',
        text: 'Hello ',
        styles: {},
      });
      expect(sourceContent[1]).toEqual({
        type: 'text',
        text: 'world ',
        styles: { backgroundColor: 'red' },
      });

      expect(correctedContent[0]).toEqual({
        type: 'text',
        text: 'Hello ',
        styles: {},
      });
      expect(correctedContent[1]).toEqual({
        type: 'text',
        text: 'there ',
        styles: { backgroundColor: 'red' },
      });
    });

    it('should handle longer original text', () => {
      const originalText = 'Hello world test';
      const correctedText = 'Hello world';

      const [sourceContent, correctedContent] = diffText(
        originalText,
        correctedText,
        1
      );

      expect(sourceContent).toHaveLength(3);
      expect(correctedContent).toHaveLength(2);

      // Extra word in original should not have red background
      expect(sourceContent[2]).toEqual({
        type: 'text',
        text: 'test ',
        styles: {},
      });
    });

    it('should handle longer corrected text', () => {
      const originalText = 'Hello world';
      const correctedText = 'Hello world test';

      const [sourceContent, correctedContent] = diffText(
        originalText,
        correctedText,
        1
      );

      expect(sourceContent).toHaveLength(2);
      expect(correctedContent).toHaveLength(2);

      // Both should be identical since we only compare up to original length
      expect(sourceContent[0]).toEqual(correctedContent[0]);
      expect(sourceContent[1]).toEqual(correctedContent[1]);
    });

    it('should handle empty strings', () => {
      const [sourceContent, correctedContent] = diffText('', '', 1);

      expect(sourceContent).toEqual([{ type: 'text', text: ' ', styles: {} }]);
      expect(correctedContent).toEqual([
        { type: 'text', text: ' ', styles: {} },
      ]);
    });

    it('should handle single word differences', () => {
      const originalText = 'Hello';
      const correctedText = 'Hi';

      const [sourceContent, correctedContent] = diffText(
        originalText,
        correctedText,
        1
      );

      expect(sourceContent[0]).toEqual({
        type: 'text',
        text: 'Hello ',
        styles: { backgroundColor: 'red' },
      });
      expect(correctedContent[0]).toEqual({
        type: 'text',
        text: 'Hi ',
        styles: { backgroundColor: 'red' },
      });
    });
  });

  describe('design = 2 (diff library)', () => {
    it('should return identical content for identical text', () => {
      const originalText = 'Hello world';
      const correctedText = 'Hello world';

      const [sourceContent, correctedContent] = diffText(
        originalText,
        correctedText,
        2
      );

      expect(sourceContent).toEqual(correctedContent);
      expect(sourceContent).toHaveLength(1);
      expect(sourceContent[0]).toEqual({
        type: 'text',
        text: 'Hello world',
        styles: {},
      });
    });

    it('should highlight added text in green', () => {
      const originalText = 'Hello';
      const correctedText = 'Hello world';

      const [sourceContent, correctedContent] = diffText(
        originalText,
        correctedText,
        2
      );

      expect(sourceContent).toHaveLength(1);
      expect(sourceContent[0]).toEqual({
        type: 'text',
        text: 'Hello',
        styles: {},
      });

      expect(correctedContent).toHaveLength(2);
      expect(correctedContent[0]).toEqual({
        type: 'text',
        text: 'Hello',
        styles: {},
      });
      expect(correctedContent[1]).toEqual({
        type: 'text',
        text: ' world',
        styles: { backgroundColor: 'green' },
      });
    });

    it('should highlight removed text in red', () => {
      const originalText = 'Hello world';
      const correctedText = 'Hello';

      const [sourceContent, correctedContent] = diffText(
        originalText,
        correctedText,
        2
      );

      expect(sourceContent).toHaveLength(2);
      expect(sourceContent[0]).toEqual({
        type: 'text',
        text: 'Hello',
        styles: {},
      });
      expect(sourceContent[1]).toEqual({
        type: 'text',
        text: ' world',
        styles: { backgroundColor: 'red' },
      });

      expect(correctedContent).toHaveLength(1);
      expect(correctedContent[0]).toEqual({
        type: 'text',
        text: 'Hello',
        styles: {},
      });
    });

    it('should handle complex changes', () => {
      const originalText = 'The quick brown fox';
      const correctedText = 'The fast red fox';

      const [sourceContent, correctedContent] = diffText(
        originalText,
        correctedText,
        2
      );

      // Should have unchanged parts and changed parts
      expect(sourceContent.length).toBeGreaterThan(0);
      expect(correctedContent.length).toBeGreaterThan(0);

      // Check that unchanged parts have no styles
      const unchangedSource = sourceContent.find(
        item => !item.styles.backgroundColor
      );
      const unchangedCorrected = correctedContent.find(
        item => !item.styles.backgroundColor
      );
      expect(unchangedSource).toBeDefined();
      expect(unchangedCorrected).toBeDefined();
    });

    it('should handle empty strings', () => {
      const [sourceContent, correctedContent] = diffText('', '', 2);

      expect(sourceContent).toEqual([{ type: 'text', text: '', styles: {} }]);
      expect(correctedContent).toEqual([
        { type: 'text', text: '', styles: {} },
      ]);
    });
  });

  describe('default behavior (design = 2)', () => {
    it('should use design = 2 by default', () => {
      const originalText = 'Hello';
      const correctedText = 'Hello world';

      const [sourceContent, correctedContent] = diffText(
        originalText,
        correctedText
      );

      // Should behave like design = 2
      expect(
        correctedContent.some(item => item.styles.backgroundColor === 'green')
      ).toBe(true);
    });
  });
});
