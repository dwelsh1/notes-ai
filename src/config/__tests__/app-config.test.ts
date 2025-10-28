import { appConfig } from '../app-config';

// Mock the prebuiltAppConfig
jest.mock('@mlc-ai/web-llm', () => ({
  prebuiltAppConfig: {
    model_list: [
      {
        model_url: 'https://example.com/model',
        model_lib: 'model_lib',
        local_id: 'test-model',
      },
    ],
    model_lib_map: {
      model_lib: 'https://example.com/lib',
    },
  },
}));

describe('app-config', () => {
  describe('appConfig', () => {
    it('should export appConfig', () => {
      expect(appConfig).toBeDefined();
    });

    it('should be an object', () => {
      expect(typeof appConfig).toBe('object');
      expect(appConfig).not.toBeNull();
    });

    it('should have required properties for MLCEngine', () => {
      // Check for common properties that prebuiltAppConfig should have
      expect(appConfig).toHaveProperty('model_list');
      expect(appConfig).toHaveProperty('model_lib_map');
    });

    it('should have model_list as an array', () => {
      expect(Array.isArray(appConfig.model_list)).toBe(true);
    });

    it('should have model_lib_map as an object', () => {
      expect(typeof appConfig.model_lib_map).toBe('object');
    });

    it('should have at least one model in model_list', () => {
      expect(appConfig.model_list.length).toBeGreaterThan(0);
    });

    it('should have models with required properties', () => {
      appConfig.model_list.forEach(model => {
        expect(model).toHaveProperty('model_url');
        expect(model).toHaveProperty('model_lib');
        expect(model).toHaveProperty('local_id');
      });
    });
  });
});
