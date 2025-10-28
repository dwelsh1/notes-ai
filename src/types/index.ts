// Type definitions for the BlockNoteLLM application

export interface ProgressProps {
  percentage: number;
}

export interface CustomFormattingToolbarProps {
  onSend: (
    prompt: string,
    task: 'translation' | 'correction' | 'summary' | 'develop',
    updateEditor: (
      text: string,
      editor?: unknown,
      idBlock?: string,
      textColor?: string
    ) => void
  ) => Promise<void>;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  currentProccess: 'translation' | 'correction' | 'summary' | 'develop' | null;
  setCurrentProcess: (
    process: 'translation' | 'correction' | 'summary' | 'develop' | null
  ) => void;
  isFetching: boolean;
  setOutput: (output: string) => void;
}

export interface ToolbarButtonProps {
  onSend: (
    prompt: string,
    task: 'translation' | 'correction' | 'summary' | 'develop',
    updateEditor: (
      text: string,
      editor?: unknown,
      idBlock?: string,
      textColor?: string
    ) => void
  ) => Promise<void>;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  currentProccess: 'translation' | 'correction' | 'summary' | 'develop' | null;
  setCurrentProcess: (
    process: 'translation' | 'correction' | 'summary' | 'develop' | null
  ) => void;
  isFetching: boolean;
  setOutput: (output: string) => void;
}

export type TaskType = 'translation' | 'correction' | 'summary' | 'develop';

export type UpdateEditorFunction = (
  text: string,
  editor?: unknown,
  idBlock?: string,
  textColor?: string
) => void;
