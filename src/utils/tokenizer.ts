import {
  ChatCompletionSystemMessageParam,
  ChatCompletionUserMessageParam,
} from '@mlc-ai/web-llm';

export const checkInputLength = async (
  chat: (ChatCompletionSystemMessageParam | ChatCompletionUserMessageParam)[]
): Promise<boolean> => {
  // Simple character-based length check instead of tokenizer
  const totalLength = chat.reduce((acc, message) => {
    return acc + (message.content?.length || 0);
  }, 0);

  // Approximate token limit: ~4 characters per token
  return totalLength > 14000; // 3500 tokens * 4 chars/token
};
