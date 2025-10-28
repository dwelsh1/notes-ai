import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

// Export GET for use in tests
export { GET };

interface BlockContent {
  type: string;
  content?: any[];
  children?: any[];
  [key: string]: any;
}

// Extract plain text from BlockNote JSON content
function extractTextFromBlocks(content: string): string {
  try {
    const blocks: BlockContent[] = JSON.parse(content);
    const textParts: string[] = [];

    function traverseBlock(block: BlockContent): void {
      // Extract text from type property and any string content
      if (block.type && typeof block.type === 'string') {
        textParts.push(block.type);
      }

      // Extract from content array
      if (Array.isArray(block.content)) {
        block.content.forEach((item) => {
          if (typeof item === 'string') {
            textParts.push(item);
          } else if (typeof item === 'object' && item !== null) {
            Object.values(item).forEach((val) => {
              if (typeof val === 'string') {
                textParts.push(val);
              }
            });
          }
        });
      }

      // Recurse into children
      if (Array.isArray(block.children)) {
        block.children.forEach((child) => {
          if (typeof child === 'object' && child !== null) {
            traverseBlock(child);
          }
        });
      }

      // Extract any string values from the block object
      Object.values(block).forEach((val) => {
        if (typeof val === 'string') {
          textParts.push(val);
        } else if (Array.isArray(val)) {
          val.forEach((item) => {
            if (typeof item === 'string') {
              textParts.push(item);
            }
          });
        }
      });
    }

    blocks.forEach(traverseBlock);
    return textParts.join(' ');
  } catch (error) {
    return '';
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string' || q.trim() === '') {
      res.status(200).json([]);
      return;
    }

    const searchTerm = q.trim();

    // Escape special FTS5 characters and prepare query
    const escapedTerm = searchTerm.replace(/["'\u2019]/g, '');
    const ftsQuery = searchTerm.includes(' ') ? `"${escapedTerm}"` : escapedTerm;

    // Use FTS5 for fast, ranked search with highlighting
    const results = await prisma.$queryRawUnsafe(`
      SELECT 
        p.id,
        p.title,
        p.content,
        p."parentId" as "parentId",
        p."order" as "order",
        p."isFavorite" as "isFavorite",
        p.tags,
        p."createdAt" as "createdAt",
        p."updatedAt" as "updatedAt",
        p."searchableText" as "searchableText"
      FROM pages_fts
      JOIN page p ON pages_fts.id = p.id
      WHERE pages_fts MATCH '${ftsQuery}'
      ORDER BY 
        CASE WHEN LOWER(p.title) LIKE LOWER('%${searchTerm}%') THEN 0 ELSE 1 END,
        p."updatedAt" DESC
      LIMIT 50
    `);

    res.status(200).json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search pages' });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return GET(req, res);
}

