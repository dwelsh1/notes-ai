import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const image = await prisma.image.findUnique({
        where: {
          id: id as string,
        },
        include: {
          page: true,
        },
      });

      if (!image) {
        res.status(404).json({ error: 'Image not found' });
        return;
      }

      res.status(200).json(image);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch image' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { filename, originalName, mimeType, size, pageId } = req.body;
      
      const image = await prisma.image.update({
        where: {
          id: id as string,
        },
        data: {
          filename,
          originalName,
          mimeType,
          size,
          pageId,
        },
      });

      res.status(200).json(image);
    } catch (error) {
      if ((error as { code: string }).code === 'P2025') {
        res.status(404).json({ error: 'Image not found' });
        return;
      }
      res.status(500).json({ error: 'Failed to update image' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.image.delete({
        where: {
          id: id as string,
        },
      });

      res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
      if ((error as { code: string }).code === 'P2025') {
        res.status(404).json({ error: 'Image not found' });
        return;
      }
      res.status(500).json({ error: 'Failed to delete image' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

