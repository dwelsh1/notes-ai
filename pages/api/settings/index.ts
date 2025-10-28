import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      let settings = await prisma.settings.findUnique({
        where: {
          id: 'settings',
        },
      });

      if (!settings) {
        // Create default settings if not found
        settings = await prisma.settings.create({
          data: {
            id: 'settings',
            aiEngine: 'webllm',
            lmStudioUrl: 'http://localhost:1234/v1',
            fallbackEnabled: true,
          },
        });
      }

      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  } else if (req.method === 'PUT') {
    try {
      const {
        aiEngine,
        lmStudioUrl,
        lmStudioModel,
        preferredModel,
        fallbackEnabled,
      } = req.body;

      const settings = await prisma.settings.upsert({
        where: {
          id: 'settings',
        },
        update: {
          aiEngine,
          lmStudioUrl,
          lmStudioModel,
          preferredModel,
          fallbackEnabled,
        },
        create: {
          id: 'settings',
          aiEngine: aiEngine || 'webllm',
          lmStudioUrl: lmStudioUrl || 'http://localhost:1234/v1',
          fallbackEnabled:
            fallbackEnabled !== undefined ? fallbackEnabled : true,
          lmStudioModel,
          preferredModel,
        },
      });

      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update settings' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
