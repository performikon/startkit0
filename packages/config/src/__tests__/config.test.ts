import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ConfigError, ConfigManager, Environment, getConfigProvider, getSupabaseConfig } from '../config.js';

// Mock the validation module
jest.mock('../validation.js', () => ({
  validateSupabaseEnv: jest.fn().mockReturnValue({
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_API_KEY: 'test-api-key',
    SUPABASE_JWT_SECRET: 'test-jwt-secret'
  })
}));

describe('Config Module', () => {
  // Save original environment and restore after tests
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Reset environment variables
    process.env = { ...originalEnv };
    
    // Reset ConfigManager singleton
    // @ts-ignore - accessing private property for testing
    ConfigManager.instance = undefined;
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('Environment Enum', () => {
    it('should have the correct environment values', () => {
      expect(Environment.Development).toBe('development');
      expect(Environment.Staging).toBe('staging');
      expect(Environment.Production).toBe('production');
      expect(Environment.Test).toBe('test');
    });
  });

  describe('ConfigError', () => {
    it('should create an error with the correct name and message', () => {
      const errorMessage = 'Test error message';
      const error = new ConfigError(errorMessage);
      
      expect(error.name).toBe('ConfigError');
      expect(error.message).toBe(errorMessage);
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('ConfigManager', () => {
    it('should be a singleton', () => {
      const instance1 = ConfigManager.getInstance();
      const instance2 = ConfigManager.getInstance();
      
      expect(instance1).toBe(instance2);
    });

    it('should determine environment based on NODE_ENV', () => {
      // Test development environment (default)
      process.env.NODE_ENV = 'development';
      let config = ConfigManager.getInstance();
      expect(config.getEnvironment()).toBe(Environment.Development);
      
      // Reset singleton for next test
      // @ts-ignore - accessing private property for testing
      ConfigManager.instance = undefined;
      
      // Test production environment
      process.env.NODE_ENV = 'production';
      config = ConfigManager.getInstance();
      expect(config.getEnvironment()).toBe(Environment.Production);
    });
  });

  describe('Helper Functions', () => {
    it('getConfigProvider should return ConfigManager instance', () => {
      const provider = getConfigProvider();
      expect(provider).toBeInstanceOf(ConfigManager);
    });

    it('getSupabaseConfig should return Supabase configuration', () => {
      // Set up environment variables
      process.env.SUPABASE_URL = 'https://example.supabase.co';
      process.env.SUPABASE_API_KEY = 'test-api-key';
      
      const config = getSupabaseConfig();
      
      expect(config.url).toBe('https://example.supabase.co');
      expect(config.apiKey).toBe('test-api-key');
    });
  });
});