import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const images = await prisma.image.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      res.status(200).json(images);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch images' });
    }
  } else if (req.method === 'POST') {
    try {
      const { filename, originalName, mimeType, size, pageId } = req.body;

      if (!filename || !originalName || !mimeType || !size || !pageId) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const image = await prisma.image.create({
        data: {
          filename,
          originalName,
          mimeType,
          size,
          pageId,
        },
      });
      res.status(201).json(image);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create image' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
