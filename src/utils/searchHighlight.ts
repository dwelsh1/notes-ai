/**
 * Highlights search terms in text
 */
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm || !text) return text;

  // Escape special regex characters
  const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Create regex for case-insensitive matching
  const regex = new RegExp(`(${escapedTerm})`, 'gi');
  
  // Replace matches with highlighted version
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Splits text into parts with highlighted search terms
 */
export function splitWithHighlight(text: string, searchTerm: string): string {
  return highlightSearchTerm(text, searchTerm);
}

