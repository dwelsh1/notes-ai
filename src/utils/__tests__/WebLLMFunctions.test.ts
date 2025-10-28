import { InitProgressReport } from '@mlc-ai/web-llm';
import { initProgressCallback } from '../WebLLMFunctions';

// Mock the useChatStore hook
jest.mock('../../hooks/useChatStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    userInput: 'test input',
  })),
}));

describe('WebLLMFunctions', () => {
  describe('initProgressCallback', () => {
    it('should be defined', () => {
      expect(initProgressCallback).toBeDefined();
      expect(typeof initProgressCallback).toBe('function');
    });

    it('should accept InitProgressReport parameter', () => {
      const mockReport: InitProgressReport = {
        progress: 0.5,
        timeElapsed: 1000,
        text: 'Loading model...',
      };

      // Should not throw when called with valid report
      expect(() => initProgressCallback(mockReport)).not.toThrow();
    });

    it('should handle different report types', () => {
      const reports: InitProgressReport[] = [
        { progress: 0, timeElapsed: 0, text: 'Starting...' },
        { progress: 0.5, timeElapsed: 500, text: 'Halfway...' },
        { progress: 1, timeElapsed: 1000, text: 'Complete!' },
      ];

      reports.forEach(report => {
        expect(() => initProgressCallback(report)).not.toThrow();
      });
    });

    it('should handle empty text', () => {
      const report: InitProgressReport = {
        progress: 0.5,
        timeElapsed: 1000,
        text: '',
      };

      expect(() => initProgressCallback(report)).not.toThrow();
    });

    it('should handle zero progress', () => {
      const report: InitProgressReport = {
        progress: 0,
        timeElapsed: 0,
        text: 'Initializing...',
      };

      expect(() => initProgressCallback(report)).not.toThrow();
    });

    it('should handle maximum progress', () => {
      const report: InitProgressReport = {
        progress: 1,
        timeElapsed: 2000,
        text: 'Finished!',
      };

      expect(() => initProgressCallback(report)).not.toThrow();
    });
  });
});
