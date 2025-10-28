import { extractSearchableText, updateSearchableText } from '../extractSearchableText';

describe('extractSearchableText', () => {
  it('should extract text from simple paragraph content', () => {
    const content = JSON.stringify([
      {
        id: '1',
        type: 'paragraph',
        props: { textColor: 'default' },
        content: [{ type: 'text', text: 'Hello world' }],
        children: [],
      },
    ]);

    const result = extractSearchableText(content);
    expect(result).toContain('Hello world');
  });

  it('should extract text from multiple blocks', () => {
    const content = JSON.stringify([
      {
        id: '1',
        type: 'paragraph',
        props: {},
        content: [{ type: 'text', text: 'First paragraph' }],
        children: [],
      },
      {
        id: '2',
        type: 'paragraph',
        props: {},
        content: [{ type: 'text', text: 'Second paragraph' }],
        children: [],
      },
    ]);

    const result = extractSearchableText(content);
    expect(result).toContain('First paragraph');
    expect(result).toContain('Second paragraph');
  });

  it('should extract text from nested children', () => {
    const content = JSON.stringify([
      {
        id: '1',
        type: 'bulletListItem',
        props: {},
        content: [{ type: 'text', text: 'Parent item' }],
        children: [
          {
            id: '2',
            type: 'bulletListItem',
            props: {},
            content: [{ type: 'text', text: 'Child item' }],
            children: [],
          },
        ],
      },
    ]);

    const result = extractSearchableText(content);
    expect(result).toContain('Parent item');
    expect(result).toContain('Child item');
      });

  it('should extract text from string content', () => {
    const content = JSON.stringify([
      {
        id: '1',
        type: 'paragraph',
        props: {},
        content: ['Simple text string'],
        children: [],
      },
    ]);

    const result = extractSearchableText(content);
    expect(result).toBe('Simple text string');
  });

  it('should extract URLs from link content', () => {
    const content = JSON.stringify([
      {
        id: '1',
        type: 'paragraph',
        props: {},
        content: [
          { type: 'text', text: 'Visit ' },
          { type: 'link', url: 'https://example.com', text: 'example' },
        ],
        children: [],
      },
    ]);

    const result = extractSearchableText(content);
    expect(result).toContain('https://example.com');
  });

  it('should handle empty content', () => {
    const content = JSON.stringify([]);
    const result = extractSearchableText(content);
    expect(result).toBe('');
  });

  it('should handle null content array', () => {
    const content = JSON.stringify([
      {
        id: '1',
        type: 'paragraph',
        props: {},
        content: null,
        children: [],
      },
    ]);

    const result = extractSearchableText(content);
    expect(result).toBe('');
  });

  it('should handle invalid JSON', () => {
    const invalidContent = 'not valid json';
    const result = extractSearchableText(invalidContent);
    expect(result).toBe('');
  });

  it('should extract text from heading blocks', () => {
    const content = JSON.stringify([
      {
        id: '1',
        type: 'heading',
        props: { level: 1 },
        content: [{ type: 'text', text: 'Main Title' }],
        children: [],
      },
    ]);

    const result = extractSearchableText(content);
    expect(result).toContain('Main Title');
  });

  it('should trim resulting text', () => {
    const content = JSON.stringify([
      {
        id: '1',
        type: 'paragraph',
        props: {},
        content: [{ type: 'text', text: '   Text with spaces   ' }],
        children: [],
      },
    ]);

    const result = extractSearchableText(content);
    expect(result).toContain('Text with spaces');
  });

  it('should handle content with mixed object properties', () => {
    const content = JSON.stringify([
      {
        id: '1',
        type: 'paragraph',
        props: {},
        content: [
          { type: 'text', text: 'Hello' },
          { type: 'text', text: 'World' },
        ],
        children: [],
      },
    ]);

    const result = extractSearchableText(content);
    expect(result).toContain('Hello');
    expect(result).toContain('World');
  });
});

describe('updateSearchableText', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update searchable text for a page', async () => {
    const mockFetch = global.fetch as jest.Mock;
    mockFetch.mockResolvedValue({ ok: true } as Response);

    await updateSearchableText('page123', 'My Page', '[]');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/pages/page123',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('My Page'),
      }
    );
  });

  it('should handle fetch errors gracefully', async () => {
    const mockFetch = global.fetch as jest.Mock;
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockFetch.mockRejectedValue(new Error('Network error'));

    await updateSearchableText('page123', 'My Page', '[]');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to update searchable text:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it('should combine title and extracted text', async () => {
    const mockFetch = global.fetch as jest.Mock;
    mockFetch.mockResolvedValue({ ok: true } as Response);

    const content = JSON.stringify([
      {
        id: '1',
        type: 'paragraph',
        content: [{ type: 'text', text: 'Page content' }],
      },
    ]);

    await updateSearchableText('page123', 'My Page', content);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('My Page Page content'),
      })
    );
  });
});
