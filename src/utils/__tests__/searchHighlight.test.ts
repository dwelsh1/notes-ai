import { highlightSearchTerm } from '../searchHighlight';

describe('searchHighlight', () => {
  describe('highlightSearchTerm', () => {
    it('should highlight exact match in text', () => {
      const result = highlightSearchTerm('Hello world', 'world');
      expect(result).toBe('Hello <mark>world</mark>');
    });

    it('should be case-insensitive', () => {
      const result = highlightSearchTerm('Hello World', 'world');
      expect(result).toBe('Hello <mark>World</mark>');
    });

    it('should highlight multiple occurrences', () => {
      const result = highlightSearchTerm('test test test', 'test');
      expect(result).toBe(
        '<mark>test</mark> <mark>test</mark> <mark>test</mark>'
      );
    });

    it('should handle partial matches', () => {
      const result = highlightSearchTerm('testing', 'test');
      expect(result).toBe('<mark>test</mark>ing');
    });

    it('should return original text when no match', () => {
      const result = highlightSearchTerm('Hello world', 'xyz');
      expect(result).toBe('Hello world');
    });

    it('should handle empty search term', () => {
      const result = highlightSearchTerm('Hello world', '');
      expect(result).toBe('Hello world');
    });

    it('should handle empty text', () => {
      const result = highlightSearchTerm('', 'test');
      expect(result).toBe('');
    });

    it('should escape special regex characters', () => {
      const result = highlightSearchTerm('Hello (world)', '(');
      expect(result).toBe('Hello <mark>(</mark>world)');
    });

    it('should handle unicode characters', () => {
      const result = highlightSearchTerm('Hello 世界', '世界');
      expect(result).toBe('Hello <mark>世界</mark>');
    });
  });
});
