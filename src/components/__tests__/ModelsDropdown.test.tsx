import React from 'react';
import { render, screen } from '@testing-library/react';
import ModelsDropdown from '../ModelsDropdown';
import { Model } from '../../config/models';

// Mock the useChatStore hook
jest.mock('../../hooks/useChatStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    selectedModel: Model.LLAMA_3_8B_INSTRUCT_Q4F16_1,
    setSelectedModel: jest.fn(),
  })),
}));

// Mock webllm
jest.mock('@mlc-ai/web-llm', () => ({
  hasModelInCache: jest.fn(() => Promise.resolve(false)),
}));

// Mock app-config
jest.mock('../../config/app-config', () => ({
  appConfig: {
    model_list: [],
    model_lib_map: {},
  },
}));

describe('ModelsDropdown', () => {
  const mockResetEngineAndChatHistory = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render models dropdown', () => {
    render(
      <ModelsDropdown
        resetEngineAndChatHistory={mockResetEngineAndChatHistory}
      />
    );

    // Check that all models are rendered
    Object.values(Model).forEach(model => {
      expect(screen.getByText(model)).toBeInTheDocument();
    });
  });

  it('should display model cache status', () => {
    render(
      <ModelsDropdown
        resetEngineAndChatHistory={mockResetEngineAndChatHistory}
      />
    );

    // Check that cache status is displayed for each model
    const notCachedElements = screen.getAllByText('Not Cached');
    expect(notCachedElements).toHaveLength(Object.values(Model).length);
  });

  it('should render all available models', () => {
    render(
      <ModelsDropdown
        resetEngineAndChatHistory={mockResetEngineAndChatHistory}
      />
    );

    // Verify all models from the enum are displayed
    expect(
      screen.getByText(Model.LLAMA_3_8B_INSTRUCT_Q4F16_1)
    ).toBeInTheDocument();
    expect(
      screen.getByText(Model.CROISSANT_LLM_CHAT_V0_1_Q4F16_1)
    ).toBeInTheDocument();
    expect(
      screen.getByText(Model.CROISSANT_LLM_CHAT_V0_1_Q4F32_1)
    ).toBeInTheDocument();
    expect(
      screen.getByText(Model.CROISSANT_LLM_CHAT_V0_1_Q0F16_1)
    ).toBeInTheDocument();
    expect(
      screen.getByText(Model.CROISSANT_LLM_CHAT_V0_1_Q0F32_1)
    ).toBeInTheDocument();
  });

  it('should have proper structure', () => {
    const { container } = render(
      <ModelsDropdown
        resetEngineAndChatHistory={mockResetEngineAndChatHistory}
      />
    );

    // Check that the component has the expected structure
    const mainDiv = container.querySelector('div');
    expect(mainDiv).toBeInTheDocument();

    const innerDiv = mainDiv?.querySelector('div');
    expect(innerDiv).toBeInTheDocument();
  });
});
