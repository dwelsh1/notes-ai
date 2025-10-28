import { InitProgressReport } from '@mlc-ai/web-llm';

export const initProgressCallback = (report: InitProgressReport) => {
  // Progress callback for WebLLM initialization
  console.log('Init progress:', report);
};
