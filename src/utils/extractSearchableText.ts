// Utility to extract searchable text from BlockNote content

interface BlockContent {
  type: string;
  content?: any[];
  children?: any[];
  props?: {
    textColor?: string;
    backgroundColor?: string;
    textAlignment?: string;
    level?: number;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Extracts plain text from BlockNote JSON content for search indexing
 */
export function extractSearchableText(content: string): string {
  try {
    const blocks: BlockContent[] = JSON.parse(content);
    const textParts: string[] = [];

    function traverseBlock(block: BlockContent): void {
      // Extract text from content array
      if (Array.isArray(block.content)) {
        block.content.forEach(item => {
          if (typeof item === 'string') {
            textParts.push(item);
          } else if (typeof item === 'object' && item !== null) {
            // Handle text nodes with text property
            if (item.text) {
              textParts.push(item.text);
            }
            // Handle links
            if (item.url) {
              textParts.push(item.url);
            }
            // Handle any other string properties
            Object.values(item).forEach(val => {
              if (typeof val === 'string') {
                textParts.push(val);
              }
            });
          }
        });
      }

      // Recurse into children
      if (Array.isArray(block.children)) {
        block.children.forEach(child => {
          if (typeof child === 'object' && child !== null) {
            traverseBlock(child);
          }
        });
      }
    }

    blocks.forEach(traverseBlock);
    return textParts.join(' ').trim();
  } catch (error) {
    return '';
  }
}

/**
 * Updates the searchableText field for a page when content changes
 */
export async function updateSearchableText(
  pageId: string,
  title: string,
  content: string
): Promise<void> {
  const extractedText = extractSearchableText(content);
  const searchableText = `${title} ${extractedText}`.trim();

  try {
    await fetch(`http://localhost:4000/api/pages/${pageId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ searchableText }),
    });
  } catch (error) {
    console.error('Failed to update searchable text:', error);
  }
}
