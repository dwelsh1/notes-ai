import { systemPrompt } from '../prompt';

describe('prompt', () => {
  describe('systemPrompt', () => {
    it('should have all required prompt types', () => {
      expect(systemPrompt).toHaveProperty('translation');
      expect(systemPrompt).toHaveProperty('correction');
      expect(systemPrompt).toHaveProperty('summary');
      expect(systemPrompt).toHaveProperty('develop');
    });

    it('should have non-empty prompt strings', () => {
      Object.values(systemPrompt).forEach(prompt => {
        expect(typeof prompt).toBe('string');
        expect(prompt.length).toBeGreaterThan(0);
        expect(prompt.trim().length).toBeGreaterThan(0);
      });
    });

    it('should have translation prompt with correct content', () => {
      expect(systemPrompt.translation).toContain('professional translator');
      expect(systemPrompt.translation).toContain('French to English');
      expect(systemPrompt.translation).toContain('markdown');
    });

    it('should have correction prompt with correct content', () => {
      expect(systemPrompt.correction).toContain('grammar expert');
      expect(systemPrompt.correction).toContain('spelling errors');
    });

    it('should have summary prompt with correct content', () => {
      expect(systemPrompt.summary).toContain('writer');
      expect(systemPrompt.summary).toContain('Summarize');
    });

    it('should have develop prompt with correct content', () => {
      expect(systemPrompt.develop).toContain('writer');
      expect(systemPrompt.develop).toContain('ideas');
    });

    it('should have unique prompt types', () => {
      const promptTypes = Object.keys(systemPrompt);
      const uniqueTypes = new Set(promptTypes);
      expect(uniqueTypes.size).toBe(promptTypes.length);
    });

    it('should have prompts that are different from each other', () => {
      const prompts = Object.values(systemPrompt);
      const uniquePrompts = new Set(prompts);
      expect(uniquePrompts.size).toBe(prompts.length);
    });
  });
});
