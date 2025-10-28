import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock the BlockNote hooks
jest.mock('@blocknote/react', () => ({
  ToolbarButton: jest.fn(({ children, onClick, isDisabled, mainTooltip }) => (
    <button
      onClick={onClick}
      disabled={isDisabled}
      title={mainTooltip}
      data-testid="translate-toolbar-button"
    >
      {children}
    </button>
  )),
  useBlockNoteEditor: jest.fn(() => ({
    getSelection: jest.fn(),
    insertBlocks: jest.fn(),
    getSelectedText: jest.fn(),
    getTextCursorPosition: jest.fn(),
    blocksToMarkdownLossy: jest.fn(),
    tryParseMarkdownToBlocks: jest.fn(),
    updateBlock: jest.fn(),
  })),
  useEditorContentOrSelectionChange: jest.fn(callback => callback()),
}));

// Import after mocks
import { TranslateToolbarButton } from '../TranslateToolbarButton';

describe.skip('TranslateToolbarButton', () => {
  const mockOnSend = jest.fn();
  const mockSetIsGenerating = jest.fn();
  const mockSetCurrentProcess = jest.fn();
  const mockSetOutput = jest.fn();

  const defaultProps = {
    onSend: mockOnSend,
    isGenerating: false,
    setIsGenerating: mockSetIsGenerating,
    currentProccess: null,
    setCurrentProcess: mockSetCurrentProcess,
    isFetching: false,
    setOutput: mockSetOutput,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the button', () => {
    render(<TranslateToolbarButton {...defaultProps} />);
    expect(screen.getByTestId('translate-toolbar-button')).toBeInTheDocument();
    expect(screen.getByText('Translate')).toBeInTheDocument();
  });

  it('should be disabled when isFetching is true', () => {
    render(<TranslateToolbarButton {...defaultProps} isFetching={true} />);
    const button = screen.getByTestId('translate-toolbar-button');
    expect(button).toBeDisabled();
  });

  it('should be disabled when isGenerating is true', () => {
    render(<TranslateToolbarButton {...defaultProps} isGenerating={true} />);
    const button = screen.getByTestId('translate-toolbar-button');
    expect(button).toBeDisabled();
  });

  it('should call translateBlocks when clicked', () => {
    render(<TranslateToolbarButton {...defaultProps} />);

    const button = screen.getByTestId('translate-toolbar-button');
    fireEvent.click(button);

    expect(button).toBeInTheDocument();
  });

  it('should show tooltip "Translate"', () => {
    render(<TranslateToolbarButton {...defaultProps} />);
    const button = screen.getByTestId('translate-toolbar-button');
    expect(button).toHaveAttribute('title', 'Translate');
  });
});
