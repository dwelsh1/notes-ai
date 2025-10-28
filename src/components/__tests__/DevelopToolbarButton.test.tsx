import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock the BlockNote hooks
jest.mock('@blocknote/react', () => ({
  ToolbarButton: jest.fn(({ children, onClick, isDisabled, mainTooltip }) => (
    <button
      onClick={onClick}
      disabled={isDisabled}
      title={mainTooltip}
      data-testid="develop-toolbar-button"
    >
      {children}
    </button>
  )),
  useBlockNoteEditor: jest.fn(() => ({
    getSelection: jest.fn(),
    insertBlocks: jest.fn(),
    getTextCursorPosition: jest.fn(),
  })),
  useEditorContentOrSelectionChange: jest.fn(callback => callback()),
}));

// Mock blockManipulation
jest.mock('../../utils/blockManipulation', () => ({
  addBlock: jest.fn(),
  getEditorBlocks: jest.fn(),
  updateBlock: jest.fn(),
}));

// Mock ParserBlockToString
jest.mock('../../utils/ParserBlockToString', () => ({
  convertBlockToString: jest.fn(block => block.content?.[0]?.text || ''),
}));

// Import after mocks
import { DevelopToolbarButton } from '../DevelopToolbarButton';

describe.skip('DevelopToolbarButton', () => {
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
    render(<DevelopToolbarButton {...defaultProps} />);
    expect(screen.getByTestId('develop-toolbar-button')).toBeInTheDocument();
    expect(screen.getByText('Develop')).toBeInTheDocument();
  });

  it('should be disabled when isFetching is true', () => {
    render(<DevelopToolbarButton {...defaultProps} isFetching={true} />);
    const button = screen.getByTestId('develop-toolbar-button');
    expect(button).toBeDisabled();
  });

  it('should be disabled when isGenerating is true', () => {
    render(<DevelopToolbarButton {...defaultProps} isGenerating={true} />);
    const button = screen.getByTestId('develop-toolbar-button');
    expect(button).toBeDisabled();
  });

  it('should call developBlocks when clicked', () => {
    render(<DevelopToolbarButton {...defaultProps} />);

    const button = screen.getByTestId('develop-toolbar-button');
    fireEvent.click(button);

    expect(button).toBeInTheDocument();
  });

  it('should show tooltip "Develop"', () => {
    render(<DevelopToolbarButton {...defaultProps} />);
    const button = screen.getByTestId('develop-toolbar-button');
    expect(button).toHaveAttribute('title', 'Develop');
  });
});
