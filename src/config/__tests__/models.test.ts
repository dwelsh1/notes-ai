import { Model, MODEL_DESCRIPTIONS } from '../models';

describe('models', () => {
  describe('Model enum', () => {
    it('should have correct enum values', () => {
      expect(Model.LLAMA_3_8B_INSTRUCT_Q4F16_1).toBe(
        'Llama-3-8B-Instruct-q4f16_1'
      );
      expect(Model.CROISSANT_LLM_CHAT_V0_1_Q4F16_1).toBe(
        'CroissantLLMChat-v0.1-q4f16_1'
      );
      expect(Model.CROISSANT_LLM_CHAT_V0_1_Q4F32_1).toBe(
        'CroissantLLMChat-v0.1-q4f32_1'
      );
      expect(Model.CROISSANT_LLM_CHAT_V0_1_Q0F16_1).toBe(
        'CroissantLLMChat-v0.1-q0f16'
      );
      expect(Model.CROISSANT_LLM_CHAT_V0_1_Q0F32_1).toBe(
        'CroissantLLMChat-v0.1-q0f32'
      );
    });

    it('should have all expected enum values', () => {
      const enumValues = Object.values(Model);
      expect(enumValues).toHaveLength(5);
      expect(enumValues).toContain('Llama-3-8B-Instruct-q4f16_1');
      expect(enumValues).toContain('CroissantLLMChat-v0.1-q4f16_1');
      expect(enumValues).toContain('CroissantLLMChat-v0.1-q4f32_1');
      expect(enumValues).toContain('CroissantLLMChat-v0.1-q0f16');
      expect(enumValues).toContain('CroissantLLMChat-v0.1-q0f32');
    });
  });

  describe('MODEL_DESCRIPTIONS', () => {
    it('should have descriptions for all models', () => {
      const modelValues = Object.values(Model);
      const descriptionKeys = Object.keys(MODEL_DESCRIPTIONS);

      modelValues.forEach(model => {
        expect(descriptionKeys).toContain(model);
      });
    });

    it('should have correct structure for each model description', () => {
      Object.values(Model).forEach(model => {
        const description = MODEL_DESCRIPTIONS[model];
        expect(description).toHaveProperty('displayName');
        expect(description).toHaveProperty('icon');
        expect(typeof description.displayName).toBe('string');
        expect(typeof description.icon).toBe('string');
        expect(description.displayName.length).toBeGreaterThan(0);
        expect(description.icon.length).toBeGreaterThan(0);
      });
    });

    it('should have correct Llama3 description', () => {
      const llamaDescription =
        MODEL_DESCRIPTIONS[Model.LLAMA_3_8B_INSTRUCT_Q4F16_1];
      expect(llamaDescription.displayName).toBe('Llama3');
      expect(llamaDescription.icon).toBe('🦙');
    });

    it('should have correct CroissantLLM descriptions', () => {
      const croissantModels = [
        Model.CROISSANT_LLM_CHAT_V0_1_Q4F16_1,
        Model.CROISSANT_LLM_CHAT_V0_1_Q4F32_1,
        Model.CROISSANT_LLM_CHAT_V0_1_Q0F16_1,
        Model.CROISSANT_LLM_CHAT_V0_1_Q0F32_1,
      ];

      croissantModels.forEach(model => {
        const description = MODEL_DESCRIPTIONS[model];
        expect(description.displayName).toContain('CroissantLLM');
        expect(description.icon).toBe('🥐');
      });
    });

    it('should have unique display names', () => {
      const displayNames = Object.values(MODEL_DESCRIPTIONS).map(
        desc => desc.displayName
      );
      const uniqueDisplayNames = new Set(displayNames);
      expect(uniqueDisplayNames.size).toBe(displayNames.length);
    });
  });
});
