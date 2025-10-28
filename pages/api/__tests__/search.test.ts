import { GET } from '../search';
import { prisma } from '../../../lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

// Mock Prisma
jest.mock('../../../lib/prisma', () => ({
  prisma: {
    page: {
      findMany: jest.fn(),
    },
    $queryRaw: jest.fn(),
    $queryRawUnsafe: jest.fn(),
  },
}));

// Mock response
const mockResponse = () => {
  const res = {} as NextApiResponse;
  res.setHeader = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

describe('/api/search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty array for empty query', async () => {
    const req = {
      method: 'GET',
      query: { q: '' },
    } as NextApiRequest;

    const res = mockResponse();

    await GET(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('should return empty array for missing query', async () => {
    const req = {
      method: 'GET',
      query: {},
    } as NextApiRequest;

    const res = mockResponse();

    await GET(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('should search pages by title', async () => {
    const mockResults = [
      {
        id: '1',
        title: 'Test Page',
        content: '{}',
        parentId: null,
        order: 0,
        isFavorite: false,
        tags: '[]',
        createdAt: new Date(),
        updatedAt: new Date(),
        searchableText: 'Test Page',
      },
    ];

    (prisma.$queryRawUnsafe as jest.Mock).mockResolvedValue(mockResults);

    const req = {
      method: 'GET',
      query: { q: 'Test' },
    } as NextApiRequest;

    const res = mockResponse();

    await GET(req, res);

    expect(prisma.$queryRawUnsafe).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResults);
  });

  it('should return 405 for non-GET methods', async () => {
    const req = {
      method: 'POST',
      query: { q: 'Test' },
    } as NextApiRequest;

    const res = mockResponse();

    await GET(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });

  it('should handle database errors', async () => {
    (prisma.$queryRawUnsafe as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = {
      method: 'GET',
      query: { q: 'Test' },
    } as NextApiRequest;

    const res = mockResponse();

    await GET(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to search pages' });
  });
});

