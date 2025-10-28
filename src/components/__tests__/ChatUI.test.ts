import ChatUI from '../ChatUI';
import { EngineInterface } from '@mlc-ai/web-llm';
import { BlockNoteEditor } from '@blocknote/core';

// Mock the engine
const createMockEngine = (): EngineInterface =>
  ({
    chat: {
      completions: {
        create: jest.fn(),
      },
      clearMessages: jest.fn(),
    },
    resetChat: jest.fn(),
    interruptGenerate: jest.fn(),
    getMessage: jest.fn(),
    runtimeStatsText: jest.fn(),
    setInitProgressCallback: jest.fn(),
    reload: jest.fn(),
    unload: jest.fn(),
  }) as unknown as EngineInterface;

// Mock app-config
jest.mock('../../config/app-config', () => ({
  appConfig: {
    model_list: [],
    model_lib_map: {},
  },
}));

describe('ChatUI', () => {
  let chatUI: ChatUI;
  let mockEngine: EngineInterface;
  let mockMessageUpdate: jest.Mock;
  let mockSetRuntimeStats: jest.Mock;
  let mockBlockUpdate: jest.Mock;
  let mockEditor: Partial<BlockNoteEditor>;

  beforeEach(() => {
    mockEngine = createMockEngine();
    mockMessageUpdate = jest.fn();
    mockSetRuntimeStats = jest.fn();
    mockBlockUpdate = jest.fn();
    mockEditor = {
      updateBlock: jest.fn(),
    };
    chatUI = new ChatUI(mockEngine);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create ChatUI instance with engine', () => {
      expect(chatUI).toBeInstanceOf(ChatUI);
    });
  });

  describe('onGenerate', () => {
    it('should return early if request is in progress', async () => {
      // Mock requestInProgress to be true
      (chatUI as any).requestInProgress = true;

      const result = await chatUI.onGenerate(
        'test prompt',
        mockMessageUpdate,
        mockSetRuntimeStats
      );

      // When requestInProgress is true, onGenerate returns undefined
      expect(result).toBeUndefined();
      expect(mockEngine.chat.completions.create).not.toHaveBeenCalled();
    });

    it.skip('should process generate request when not in progress', async () => {
      // Ensure requestInProgress is false
      (chatUI as any).requestInProgress = false;
      (chatUI as any).chatLoaded = true; // Skip initialization

      const mockCompletion = {
        [Symbol.asyncIterator]: async function* () {
          yield {
            choices: [{ delta: { content: 'Hello' } }],
          };
          yield {
            choices: [{ delta: { content: ' world' } }],
          };
        },
      };

      (mockEngine.chat.completions.create as jest.Mock).mockResolvedValue(
        mockCompletion
      );
      (mockEngine.getMessage as jest.Mock).mockResolvedValue('Hello world');
      (mockEngine.runtimeStatsText as jest.Mock).mockResolvedValue(
        '10ms/token'
      );

      const result = await chatUI.onGenerate(
        'test prompt',
        mockMessageUpdate,
        mockSetRuntimeStats
      );

      // onGenerate returns the promise chain
      expect(result).toBeDefined();
    });

    it('should skip generation with empty prompt', async () => {
      (chatUI as any).requestInProgress = false;
      (chatUI as any).chatLoaded = true;

      await chatUI.onGenerate('', mockMessageUpdate, mockSetRuntimeStats);

      expect(mockEngine.chat.completions.create).not.toHaveBeenCalled();
    });
  });

  describe('onGenerateTranslation', () => {
    it.skip('should process translation request', async () => {
      // Ensure requestInProgress is false
      (chatUI as any).requestInProgress = false;
      (chatUI as any).chatLoaded = true;

      const mockCompletion = {
        [Symbol.asyncIterator]: async function* () {
          yield {
            choices: [{ delta: { content: 'Bonjour' } }],
          };
        },
      };

      (mockEngine.chat.completions.create as jest.Mock).mockResolvedValue(
        mockCompletion
      );
      (mockEngine.getMessage as jest.Mock).mockResolvedValue('Bonjour');
      (mockEngine.runtimeStatsText as jest.Mock).mockResolvedValue(
        '10ms/token'
      );

      const mockSetDisabled = jest.fn();
      const result = await chatUI.onGenerateTranslation(
        'test prompt',
        mockMessageUpdate,
        mockBlockUpdate,
        mockEditor as BlockNoteEditor,
        'block1',
        mockSetRuntimeStats,
        mockSetDisabled
      );

      // onGenerateTranslation returns the promise chain
      expect(result).toBeDefined();
    });

    it('should skip translation with empty prompt', async () => {
      (chatUI as any).requestInProgress = false;
      (chatUI as any).chatLoaded = true;

      const mockSetDisabled = jest.fn();
      await chatUI.onGenerateTranslation(
        '',
        mockMessageUpdate,
        mockBlockUpdate,
        mockEditor as BlockNoteEditor,
        'block1',
        mockSetRuntimeStats,
        mockSetDisabled
      );

      expect(mockEngine.chat.completions.create).not.toHaveBeenCalled();
    });
  });

  describe('onGenerateCorrection', () => {
    it.skip('should process correction request', async () => {
      // Ensure requestInProgress is false
      (chatUI as any).requestInProgress = false;
      (chatUI as any).chatLoaded = true;

      const mockCompletion = {
        [Symbol.asyncIterator]: async function* () {
          yield {
            choices: [{ delta: { content: 'Corrected text' } }],
          };
        },
      };

      (mockEngine.chat.completions.create as jest.Mock).mockResolvedValue(
        mockCompletion
      );
      (mockEngine.getMessage as jest.Mock).mockResolvedValue('Corrected text');
      (mockEngine.runtimeStatsText as jest.Mock).mockResolvedValue(
        '10ms/token'
      );

      const mockSetDisabled = jest.fn();
      const result = await chatUI.onGenerateCorrection(
        'test prompt',
        mockMessageUpdate,
        mockBlockUpdate,
        mockEditor as BlockNoteEditor,
        'block1',
        mockSetRuntimeStats,
        mockSetDisabled
      );

      // onGenerateCorrection returns the promise chain
      expect(result).toBeDefined();
    });

    it('should skip correction with empty prompt', async () => {
      (chatUI as any).requestInProgress = false;
      (chatUI as any).chatLoaded = true;

      const mockSetDisabled = jest.fn();
      await chatUI.onGenerateCorrection(
        '',
        mockMessageUpdate,
        mockBlockUpdate,
        mockEditor as BlockNoteEditor,
        'block1',
        mockSetRuntimeStats,
        mockSetDisabled
      );

      expect(mockEngine.chat.completions.create).not.toHaveBeenCalled();
    });
  });

  describe('onReset', () => {
    it('should reset chat', async () => {
      const mockClearMessages = jest.fn();
      await chatUI.onReset(mockClearMessages);

      expect(mockEngine.resetChat).toHaveBeenCalled();
      expect(mockClearMessages).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it.skip('should handle engine errors gracefully', async () => {
      // Ensure requestInProgress is false
      (chatUI as any).requestInProgress = false;
      (chatUI as any).chatLoaded = true;

      (mockEngine.chat.completions.create as jest.Mock).mockRejectedValue(
        new Error('Engine error')
      );

      const result = await chatUI.onGenerate(
        'test prompt',
        mockMessageUpdate,
        mockSetRuntimeStats
      );

      // Promise chain is returned even on error
      expect(result).toBeDefined();
      expect(mockMessageUpdate).toHaveBeenCalledWith(
        'error',
        expect.stringContaining('Engine error'),
        true
      );
    });

    it('should call interruptGenerate when resetting while in progress', async () => {
      (chatUI as any).requestInProgress = true;

      const mockClearMessages = jest.fn();
      await chatUI.onReset(mockClearMessages);

      expect(mockEngine.interruptGenerate).toHaveBeenCalled();
      expect(mockEngine.resetChat).toHaveBeenCalled();
      expect(mockClearMessages).toHaveBeenCalled();
    });
  });

  describe('asyncInitChat', () => {
    it('should skip initialization if chat is already loaded', async () => {
      (chatUI as any).chatLoaded = true;

      await (chatUI as any).asyncInitChat(mockMessageUpdate);

      expect(mockEngine.reload).not.toHaveBeenCalled();
    });

    it('should handle initialization errors', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      (chatUI as any).chatLoaded = false;
      (mockEngine.reload as jest.Mock).mockRejectedValue(
        new Error('Load error')
      );

      await (chatUI as any).asyncInitChat(mockMessageUpdate);

      expect(mockMessageUpdate).toHaveBeenCalledWith(
        'error',
        expect.stringContaining('Load error'),
        true
      );
      expect(mockEngine.unload).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });
  });
});
