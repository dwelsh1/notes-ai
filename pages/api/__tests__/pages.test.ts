import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '../pages/index';

// Mock Prisma
jest.mock('../../../lib/prisma', () => ({
  prisma: {
    page: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('/api/pages', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    req = {
      method: 'GET',
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
      end: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return all pages', async () => {
      const { prisma } = require('../../../lib/prisma');
      const mockPages = [
        {
          id: '1',
          title: 'Test Page',
          content: '[]',
          parentId: null,
          order: 0,
          isFavorite: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: [],
          images: [],
          children: [],
        },
      ];

      prisma.page.findMany.mockResolvedValue(mockPages);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPages);
    });

    it('should handle errors when fetching pages', async () => {
      const { prisma } = require('../../../lib/prisma');
      prisma.page.findMany.mockRejectedValue(new Error('Database error'));

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch pages',
      });
    });
  });

  describe('POST', () => {
    beforeEach(() => {
      req.method = 'POST';
      req.body = {
        title: 'New Page',
        content: '[]',
        parentId: null,
        order: 0,
        isFavorite: false,
      };
    });

    it('should create a new page', async () => {
      const { prisma } = require('../../../lib/prisma');
      const mockPage = {
        id: '2',
        title: 'New Page',
        content: '[]',
        parentId: null,
        order: 0,
        isFavorite: false,
      };

      prisma.page.create.mockResolvedValue(mockPage);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(prisma.page.create).toHaveBeenCalledWith({
        data: {
          title: 'New Page',
          content: '[]',
          parentId: null,
          order: 0,
          isFavorite: false,
          tags: '[]',
          searchableText: null,
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockPage);
    });

    it('should handle errors when creating a page', async () => {
      const { prisma } = require('../../../lib/prisma');
      prisma.page.create.mockRejectedValue(new Error('Database error'));

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to create page',
      });
    });
  });

  describe('Method Not Allowed', () => {
    it('should return 405 for unsupported methods', async () => {
      req.method = 'DELETE';

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.setHeader).toHaveBeenCalledWith('Allow', ['GET', 'POST']);
      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.end).toHaveBeenCalledWith('Method DELETE Not Allowed');
    });
  });
});
