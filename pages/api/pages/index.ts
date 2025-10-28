import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const pages = await prisma.page.findMany({
        include: {
          images: true,
          children: true,
        },
        orderBy: {
          order: 'asc',
        },
      });
      res.status(200).json(pages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch pages' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, content, parentId, order, isFavorite, tags, searchableText } = req.body;
      const page = await prisma.page.create({
        data: {
          title,
          content,
          parentId,
          order,
          isFavorite,
          tags: tags || '[]',
          searchableText: searchableText || null,
        },
      });
      res.status(201).json(page);
    } catch (error) {
      console.error('Failed to create page:', error);
      res.status(500).json({ error: 'Failed to create page' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

