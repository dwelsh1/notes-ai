import React from 'react';
import { render, screen } from '@testing-library/react';
import { CustomFormattingToolbar } from '../CustomFormattingToolbar';

// Mock the BlockNote components
jest.mock('@blocknote/react', () => ({
  BasicTextStyleButton: ({ basicTextStyle }: { basicTextStyle?: string }) => (
    <button data-testid={`${basicTextStyle || 'code'}-button`}>
      {basicTextStyle || 'Code'}
    </button>
  ),
  BlockTypeSelect: () => (
    <select data-testid="block-type-select">
      <option>Paragraph</option>
    </select>
  ),
  ColorStyleButton: () => (
    <button data-testid="color-style-button">Color</button>
  ),
  CreateLinkButton: () => (
    <button data-testid="create-link-button">Link</button>
  ),
  FormattingToolbar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="formatting-toolbar">{children}</div>
  ),
  ImageCaptionButton: () => (
    <button data-testid="image-caption-button">Caption</button>
  ),
  NestBlockButton: () => <button data-testid="nest-block-button">Nest</button>,
  ReplaceImageButton: () => (
    <button data-testid="replace-image-button">Replace</button>
  ),
  TextAlignButton: ({ textAlignment }: { textAlignment: string }) => (
    <button data-testid={`text-align-${textAlignment}-button`}>
      {textAlignment}
    </button>
  ),
  UnnestBlockButton: () => (
    <button data-testid="unnest-block-button">Unnest</button>
  ),
}));

// Mock the custom toolbar buttons
jest.mock('../TranslateToolbarButton', () => ({
  TranslateToolbarButton: () => (
    <button data-testid="translate-toolbar-button">Translate</button>
  ),
}));

jest.mock('../CorrectToolbarButton', () => ({
  CorrectToolbarButton: () => (
    <button data-testid="correct-toolbar-button">Correct</button>
  ),
}));

jest.mock('../DevelopToolbarButton', () => ({
  DevelopToolbarButton: () => (
    <button data-testid="develop-toolbar-button">Develop</button>
  ),
}));

describe('CustomFormattingToolbar', () => {
  const defaultProps = {
    onSend: jest.fn(),
    isGenerating: false,
    setIsGenerating: jest.fn(),
    currentProccess: null,
    setCurrentProcess: jest.fn(),
    isFetching: false,
    setOutput: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render formatting toolbar', () => {
    render(<CustomFormattingToolbar {...defaultProps} />);

    expect(screen.getByTestId('formatting-toolbar')).toBeInTheDocument();
  });

  it('should render block type select', () => {
    render(<CustomFormattingToolbar {...defaultProps} />);

    expect(screen.getByTestId('block-type-select')).toBeInTheDocument();
  });

  it('should render custom toolbar buttons', () => {
    render(<CustomFormattingToolbar {...defaultProps} />);

    expect(screen.getByTestId('translate-toolbar-button')).toBeInTheDocument();
    expect(screen.getByTestId('correct-toolbar-button')).toBeInTheDocument();
    expect(screen.getByTestId('develop-toolbar-button')).toBeInTheDocument();
  });

  it('should render text style buttons', () => {
    render(<CustomFormattingToolbar {...defaultProps} />);

    expect(screen.getByTestId('bold-button')).toBeInTheDocument();
    expect(screen.getByTestId('italic-button')).toBeInTheDocument();
    expect(screen.getByTestId('underline-button')).toBeInTheDocument();
    expect(screen.getByTestId('strike-button')).toBeInTheDocument();
    expect(screen.getByTestId('code-button')).toBeInTheDocument();
  });

  it('should render text alignment buttons', () => {
    render(<CustomFormattingToolbar {...defaultProps} />);

    expect(screen.getByTestId('text-align-left-button')).toBeInTheDocument();
    expect(screen.getByTestId('text-align-center-button')).toBeInTheDocument();
    expect(screen.getByTestId('text-align-right-button')).toBeInTheDocument();
  });

  it('should render utility buttons', () => {
    render(<CustomFormattingToolbar {...defaultProps} />);

    expect(screen.getByTestId('color-style-button')).toBeInTheDocument();
    expect(screen.getByTestId('nest-block-button')).toBeInTheDocument();
    expect(screen.getByTestId('unnest-block-button')).toBeInTheDocument();
    expect(screen.getByTestId('create-link-button')).toBeInTheDocument();
  });

  it('should render image buttons', () => {
    render(<CustomFormattingToolbar {...defaultProps} />);

    expect(screen.getByTestId('image-caption-button')).toBeInTheDocument();
    expect(screen.getByTestId('replace-image-button')).toBeInTheDocument();
  });
});
