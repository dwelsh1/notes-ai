import { renderHook, act } from '@testing-library/react';
import useChatStore from '../useChatStore';

// Mock MLCEngine
const mockMLCEngine = {
  generate: jest.fn(),
  reload: jest.fn(),
  interruptGenerate: jest.fn(),
} as any;

describe('useChatStore', () => {
  beforeEach(() => {
    // Reset the store state before each test
    useChatStore.setState({
      engine: null,
      progress: 'Not loadeed',
      progressPercentage: 0,
      userInput: '',
      isFetching: false,
      isGenerating: false,
      output: '',
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useChatStore());

      expect(result.current.engine).toBeNull();
      expect(result.current.progress).toBe('Not loadeed');
      expect(result.current.progressPercentage).toBe(0);
      expect(result.current.userInput).toBe('');
      expect(result.current.isFetching).toBe(false);
      expect(result.current.isGenerating).toBe(false);
      expect(result.current.output).toBe('');
    });
  });

  describe('engine management', () => {
    it('should set and get engine', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setEngine(mockMLCEngine);
      });

      expect(result.current.engine).toBe(mockMLCEngine);
    });
  });

  describe('progress management', () => {
    it('should set and get progress', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setProgress('Loading model...');
      });

      expect(result.current.progress).toBe('Loading model...');
    });

    it('should set and get progress percentage', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setProgressPercentage(0.5);
      });

      expect(result.current.progressPercentage).toBe(0.5);
    });
  });

  describe('user input management', () => {
    it('should set and get user input', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setUserInput('Hello world');
      });

      expect(result.current.userInput).toBe('Hello world');
    });

    it('should handle empty user input', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setUserInput('');
      });

      expect(result.current.userInput).toBe('');
    });
  });

  describe('loading state management', () => {
    it('should set and get isFetching state', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setIsFetching(true);
      });

      expect(result.current.isFetching).toBe(true);

      act(() => {
        result.current.setIsFetching(false);
      });

      expect(result.current.isFetching).toBe(false);
    });

    it('should set and get isGenerating state', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setIsGenerating(true);
      });

      expect(result.current.isGenerating).toBe(true);

      act(() => {
        result.current.setIsGenerating(false);
      });

      expect(result.current.isGenerating).toBe(false);
    });
  });

  describe('output management', () => {
    it('should set and get output', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setOutput('Generated text');
      });

      expect(result.current.output).toBe('Generated text');
    });

    it('should handle empty output', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setOutput('');
      });

      expect(result.current.output).toBe('');
    });
  });

  describe('multiple state updates', () => {
    it('should handle multiple state updates correctly', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setEngine(mockMLCEngine);
        result.current.setProgress('Processing...');
        result.current.setProgressPercentage(0.75);
        result.current.setUserInput('Test input');
        result.current.setIsFetching(true);
        result.current.setIsGenerating(true);
        result.current.setOutput('Test output');
      });

      expect(result.current.engine).toBe(mockMLCEngine);
      expect(result.current.progress).toBe('Processing...');
      expect(result.current.progressPercentage).toBe(0.75);
      expect(result.current.userInput).toBe('Test input');
      expect(result.current.isFetching).toBe(true);
      expect(result.current.isGenerating).toBe(true);
      expect(result.current.output).toBe('Test output');
    });
  });
});
