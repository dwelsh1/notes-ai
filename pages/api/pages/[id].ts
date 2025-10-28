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

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const page = await prisma.page.findUnique({
        where: {
          id: id as string,
        },
        include: {
          images: true,
          children: true,
        },
      });

      if (!page) {
        res.status(404).json({ error: 'Page not found' });
        return;
      }

      res.status(200).json(page);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch page' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { title, content, parentId, order, isFavorite, tags, searchableText } = req.body;
      
      // Build update data object with only provided fields
      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (parentId !== undefined) updateData.parentId = parentId;
      if (order !== undefined) updateData.order = order;
      if (isFavorite !== undefined) updateData.isFavorite = isFavorite;
      if (tags !== undefined) updateData.tags = tags;
      if (searchableText !== undefined) updateData.searchableText = searchableText;
      
      const page = await prisma.page.update({
        where: {
          id: id as string,
        },
        data: updateData,
      });

      res.status(200).json(page);
    } catch (error) {
      if ((error as { code: string }).code === 'P2025') {
        res.status(404).json({ error: 'Page not found' });
        return;
      }
      res.status(500).json({ error: 'Failed to update page' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.page.delete({
        where: {
          id: id as string,
        },
      });

      res.status(200).json({ message: 'Page deleted successfully' });
    } catch (error) {
      if ((error as { code: string }).code === 'P2025') {
        res.status(404).json({ error: 'Page not found' });
        return;
      }
      res.status(500).json({ error: 'Failed to delete page' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

