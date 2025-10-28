import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';

describe('Header', () => {
  const defaultProps = {
    onTranslate: jest.fn(),
    onCorrect: jest.fn(),
    onSummarize: jest.fn(),
    onDevelop: jest.fn(),
    onClear: jest.fn(), // Kept for backward compatibility but button is removed
    onStop: jest.fn(),
    isGenerating: false,
    isFetching: false,
    currentProcess: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render header with all buttons', () => {
    render(<Header {...defaultProps} />);

    expect(screen.getByText('NotesAI')).toBeInTheDocument();
    expect(
      screen.getByTitle('Translate the entire document in a new block note')
    ).toBeInTheDocument();
    expect(
      screen.getByTitle('Correct the entire document in a new block note')
    ).toBeInTheDocument();
    expect(
      screen.getByTitle('Summarize the entire document')
    ).toBeInTheDocument();
    expect(
      screen.getByTitle('Generate text from bullet points')
    ).toBeInTheDocument();
    expect(screen.getByTitle('Stop generation')).toBeInTheDocument();
  });

  it('should call onTranslate when Translate button is clicked', () => {
    render(<Header {...defaultProps} />);

    fireEvent.click(
      screen.getByTitle('Translate the entire document in a new block note')
    );
    expect(defaultProps.onTranslate).toHaveBeenCalledTimes(1);
  });

  it('should call onCorrect when Correct button is clicked', () => {
    render(<Header {...defaultProps} />);

    fireEvent.click(
      screen.getByTitle('Correct the entire document in a new block note')
    );
    expect(defaultProps.onCorrect).toHaveBeenCalledTimes(1);
  });

  it('should call onSummarize when Summarize button is clicked', () => {
    render(<Header {...defaultProps} />);

    fireEvent.click(screen.getByTitle('Summarize the entire document'));
    expect(defaultProps.onSummarize).toHaveBeenCalledTimes(1);
  });

  it('should call onDevelop when Develop button is clicked', () => {
    render(<Header {...defaultProps} />);

    fireEvent.click(screen.getByTitle('Generate text from bullet points'));
    expect(defaultProps.onDevelop).toHaveBeenCalledTimes(1);
  });

  it('should call onStop when Stop button is clicked', () => {
    render(<Header {...defaultProps} isGenerating={true} />);

    const stopButton = screen.getByTitle('Stop generation');
    fireEvent.click(stopButton);
    expect(defaultProps.onStop).toHaveBeenCalledTimes(1);
  });

  it('should disable AI buttons when isGenerating is true', () => {
    render(<Header {...defaultProps} isGenerating={true} />);

    const translateButton = screen.getByTitle(
      'Translate the entire document in a new block note'
    );
    const correctButton = screen.getByTitle(
      'Correct the entire document in a new block note'
    );
    const summarizeButton = screen.getByTitle('Summarize the entire document');
    const developButton = screen.getByTitle('Generate text from bullet points');

    expect(translateButton).toBeDisabled();
    expect(correctButton).toBeDisabled();
    expect(summarizeButton).toBeDisabled();
    expect(developButton).toBeDisabled();
  });

  it('should disable AI buttons when isFetching is true', () => {
    render(<Header {...defaultProps} isFetching={true} />);

    const translateButton = screen.getByTitle(
      'Translate the entire document in a new block note'
    );
    const correctButton = screen.getByTitle(
      'Correct the entire document in a new block note'
    );
    const summarizeButton = screen.getByTitle('Summarize the entire document');
    const developButton = screen.getByTitle('Generate text from bullet points');

    expect(translateButton).toBeDisabled();
    expect(correctButton).toBeDisabled();
    expect(summarizeButton).toBeDisabled();
    expect(developButton).toBeDisabled();
  });

  it('should render NotesAI logo', () => {
    render(<Header {...defaultProps} />);

    const logoElement = screen.getByText('N');
    expect(logoElement).toBeInTheDocument();
  });

  it('should have proper styling for header', () => {
    const { container } = render(<Header {...defaultProps} />);

    const header = container.querySelector('header');
    expect(header?.style.backgroundColor).toBe('white');
    expect(header?.style.padding).toBe('8px 16px');
    expect(header?.style.borderBottom).toContain('1px solid');
  });

  it('should have hover effects on buttons', () => {
    render(<Header {...defaultProps} />);

    const translateButton = screen.getByTitle(
      'Translate the entire document in a new block note'
    );

    fireEvent.mouseEnter(translateButton);
    // Check that the button has the hover style applied
    expect(translateButton.style.backgroundColor).toBe('rgb(243, 244, 246)');

    fireEvent.mouseLeave(translateButton);
    // Check that the button returns to transparent
    expect(translateButton.style.backgroundColor).toBe('transparent');
  });

  it('should not have hover effects when disabled', () => {
    render(<Header {...defaultProps} isGenerating={true} />);

    const translateButton = screen.getByTitle(
      'Translate the entire document in a new block note'
    );

    fireEvent.mouseEnter(translateButton);
    // When disabled, hover should not change the background
    expect(translateButton.style.backgroundColor).toBe('transparent');
  });
});
