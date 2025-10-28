import { checkInputLength } from '../tokenizer';
import {
  ChatCompletionSystemMessageParam,
  ChatCompletionUserMessageParam,
} from '@mlc-ai/web-llm';

describe('tokenizer', () => {
  describe('checkInputLength', () => {
    it('should return false for short input', async () => {
      const shortChat: (
        | ChatCompletionSystemMessageParam
        | ChatCompletionUserMessageParam
      )[] = [{ role: 'user', content: 'Hello world' }];

      const result = await checkInputLength(shortChat);
      expect(result).toBe(false);
    });

    it('should return true for long input exceeding token limit', async () => {
      const longContent = 'a'.repeat(15000); // Exceeds 14000 character limit
      const longChat: (
        | ChatCompletionSystemMessageParam
        | ChatCompletionUserMessageParam
      )[] = [{ role: 'user', content: longContent }];

      const result = await checkInputLength(longChat);
      expect(result).toBe(true);
    });

    it('should handle empty content', async () => {
      const chatWithEmpty: (
        | ChatCompletionSystemMessageParam
        | ChatCompletionUserMessageParam
      )[] = [
        { role: 'user', content: '' },
        { role: 'system', content: undefined },
      ];

      const result = await checkInputLength(chatWithEmpty);
      expect(result).toBe(false);
    });

    it('should accumulate length from multiple messages', async () => {
      const chat: (
        | ChatCompletionSystemMessageParam
        | ChatCompletionUserMessageParam
      )[] = [
        { role: 'system', content: 'a'.repeat(5000) },
        { role: 'user', content: 'a'.repeat(5000) },
        { role: 'assistant', content: 'a'.repeat(5000) },
      ];

      const result = await checkInputLength(chat);
      expect(result).toBe(true);
    });

    it('should handle exactly at the limit', async () => {
      const chatAtLimit: (
        | ChatCompletionSystemMessageParam
        | ChatCompletionUserMessageParam
      )[] = [{ role: 'user', content: 'a'.repeat(14000) }];

      const result = await checkInputLength(chatAtLimit);
      expect(result).toBe(false);
    });

    it('should handle one character over the limit', async () => {
      const chatOverLimit: (
        | ChatCompletionSystemMessageParam
        | ChatCompletionUserMessageParam
      )[] = [{ role: 'user', content: 'a'.repeat(14001) }];

      const result = await checkInputLength(chatOverLimit);
      expect(result).toBe(true);
    });
  });
});
