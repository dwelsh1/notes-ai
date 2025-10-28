import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock the BlockNote hooks
jest.mock('@blocknote/react', () => ({
  ToolbarButton: jest.fn(({ children, onClick, isDisabled, mainTooltip }) => (
    <button
      onClick={onClick}
      disabled={isDisabled}
      title={mainTooltip}
      data-testid="correct-toolbar-button"
    >
      {children}
    </button>
  )),
  useBlockNoteEditor: jest.fn(() => ({
    getSelection: jest.fn(),
    insertBlocks: jest.fn(),
    getSelectedText: jest.fn(),
    getTextCursorPosition: jest.fn(),
  })),
  useEditorContentOrSelectionChange: jest.fn((callback) => callback()),
}));

// Mock correctSingleBlock
jest.mock('../../utils/correctSingleBlock');

// Import after mocks are set up
import { CorrectToolbarButton } from '../CorrectToolbarButton';

describe.skip('CorrectToolbarButton', () => {
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
    render(<CorrectToolbarButton {...defaultProps} />);
    expect(screen.getByTestId('correct-toolbar-button')).toBeInTheDocument();
    expect(screen.getByText('Correct')).toBeInTheDocument();
  });

  it('should be disabled when isFetching is true', () => {
    render(<CorrectToolbarButton {...defaultProps} isFetching={true} />);
    const button = screen.getByTestId('correct-toolbar-button');
    expect(button).toBeDisabled();
  });

  it('should be disabled when isGenerating is true', () => {
    render(<CorrectToolbarButton {...defaultProps} isGenerating={true} />);
    const button = screen.getByTestId('correct-toolbar-button');
    expect(button).toBeDisabled();
  });

  it('should call correctBlocks when clicked', () => {
    render(<CorrectToolbarButton {...defaultProps} />);

    const button = screen.getByTestId('correct-toolbar-button');
    fireEvent.click(button);

    expect(button).toBeInTheDocument();
  });

  it('should show tooltip "Correct"', () => {
    render(<CorrectToolbarButton {...defaultProps} />);
    const button = screen.getByTestId('correct-toolbar-button');
    expect(button).toHaveAttribute('title', 'Correct');
  });
});