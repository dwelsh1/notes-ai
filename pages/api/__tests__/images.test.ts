import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '../images/index';
import { prisma } from '../../../lib/prisma';

// Mock Prisma
jest.mock('../../../lib/prisma', () => ({
  prisma: {
    image: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('/api/images', () => {
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
    it('should return all images', async () => {
      const mockImages = [
        {
          id: '1',
          filename: 'test.jpg',
          originalName: 'test.jpg',
          mimeType: 'image/jpeg',
          size: 1024,
          pageId: 'page1',
          createdAt: new Date(),
        },
      ];

      prisma.image.findMany.mockResolvedValue(mockImages);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockImages);
    });

    it('should handle errors when fetching images', async () => {
      prisma.image.findMany.mockRejectedValue(new Error('Database error'));

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch images',
      });
    });
  });

  describe('POST', () => {
    beforeEach(() => {
      req.method = 'POST';
      req.body = {
        filename: 'test.jpg',
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        pageId: 'page1',
      };
    });

    it('should create a new image', async () => {
      const mockImage = {
        id: '1',
        filename: 'test.jpg',
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        pageId: 'page1',
      };

      prisma.image.create.mockResolvedValue(mockImage);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(prisma.image.create).toHaveBeenCalledWith({
        data: {
          filename: 'test.jpg',
          originalName: 'test.jpg',
          mimeType: 'image/jpeg',
          size: 1024,
          pageId: 'page1',
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockImage);
    });

    it('should handle errors when creating an image', async () => {
      prisma.image.create.mockRejectedValue(new Error('Database error'));

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to create image',
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
